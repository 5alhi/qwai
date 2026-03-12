# Coolify Deployment Guide — qw.ai

This guide walks you through deploying the qw.ai website on Coolify from start to finish. It covers pushing the code to GitHub, provisioning a MySQL database, configuring the application in Coolify, setting environment variables, running the database migration, and pointing your domain.

---

## Prerequisites

Before you begin, ensure you have the following:

| Requirement | Details |
|---|---|
| A Coolify instance | Self-hosted on a VPS (DigitalOcean, Hetzner, Vultr, etc.) or Coolify Cloud |
| A GitHub account | The code will be hosted here |
| A MySQL database | Can be provisioned directly inside Coolify |
| Your domain `qw.ai` | With access to DNS settings |
| Git installed locally | To push the code |

---

## Phase 1 — Push the Code to GitHub

### Step 1.1 — Create a GitHub Repository

Go to [github.com/new](https://github.com/new) and create a new repository. Recommended settings:

| Setting | Value |
|---|---|
| Repository name | `qw-ai-website` |
| Visibility | **Private** (recommended for production) |
| Initialize with README | **No** (the project already has one) |

Click **Create repository** and keep the page open — you will need the repository URL in the next step.

### Step 1.2 — Push the Project Code

Open a terminal on your local machine (or in the Manus sandbox) and run the following commands from inside the project directory:

```bash
cd /home/ubuntu/qw-ai-website

# Initialize git if not already done
git init

# Add all files
git add .

# Create the initial commit
git commit -m "Initial commit: qw.ai full-stack website"

# Add your GitHub repository as the remote origin
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/qw-ai-website.git

# Push to GitHub
git push -u origin main
```

> **Note:** If your default branch is called `master` instead of `main`, use `git push -u origin master`.

After the push completes, refresh your GitHub repository page — you should see all the project files listed there.

---

## Phase 2 — Provision a MySQL Database in Coolify

The qw.ai website requires a MySQL database to store articles and admin sessions. Coolify can provision and manage this database for you.

### Step 2.1 — Open Coolify and Navigate to Databases

Log into your Coolify dashboard and click **Databases** in the left sidebar, then click **+ New Database**.

### Step 2.2 — Select MySQL

Choose **MySQL** from the list of available database engines. Select the server where you want it to run.

### Step 2.3 — Configure the Database

Fill in the following fields:

| Field | Recommended Value |
|---|---|
| Database name | `qwai` |
| Username | `qwai_user` |
| Password | Generate a strong random password |
| Version | MySQL 8.0 |

Click **Create Database** and wait for it to start. Once it is running, click on the database entry to view its connection details.

### Step 2.4 — Copy the Connection String

In the database detail view, find the **Connection String** (also called the DSN). It will look like this:

```
mysql://qwai_user:YOUR_PASSWORD@YOUR_COOLIFY_HOST:3306/qwai
```

Copy this string — you will need it in Phase 3 as the `DATABASE_URL` environment variable.

> **Important:** If your application and database are on the same Coolify server, you can use the internal Docker network hostname instead of the public IP. Coolify typically shows both options. Use the **internal** connection string for better performance and security.

---

## Phase 3 — Create the Application in Coolify

### Step 3.1 — Add a New Application

In Coolify, click **Applications** in the left sidebar, then click **+ New Application**.

### Step 3.2 — Connect Your GitHub Repository

Select **GitHub** as the source. If you have not connected GitHub to Coolify before:

1. Click **Connect GitHub**
2. Authorize Coolify to access your repositories
3. Select the `qw-ai-website` repository

Once connected, select the repository and set the branch to `main`.

### Step 3.3 — Configure the Build Settings

Coolify will detect the `Dockerfile` in the repository root automatically. Verify the following settings:

| Setting | Value |
|---|---|
| Build Pack | **Dockerfile** |
| Dockerfile location | `/Dockerfile` (root of the repo) |
| Port | `3000` |
| Base directory | `/` |

### Step 3.4 — Set the Application Name and Domain

Give the application a name such as `qw-ai-website`. You will configure the domain in Phase 5 — for now, Coolify will assign a temporary URL.

Click **Save** to create the application (do not deploy yet — you need to set environment variables first).

---

## Phase 4 — Set Environment Variables

This is the most critical step. The application will not start correctly without these variables.

### Step 4.1 — Open the Environment Variables Panel

In your application's settings in Coolify, click the **Environment Variables** tab (sometimes labelled **Envs**).

### Step 4.2 — Add the Required Variables

Add each of the following variables one by one:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `mysql://qwai_user:PASSWORD@HOST:3306/qwai` | From Phase 2, Step 2.4 |
| `JWT_SECRET` | A long random string (32+ characters) | Used to sign admin session cookies |
| `ADMIN_PASSWORD` | Your chosen admin panel password | Used to log into `/admin` |
| `NODE_ENV` | `production` | Enables production optimizations |

**Generating a strong `JWT_SECRET`:** You can generate one by running this in any terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> **Security note:** Never commit these values to your GitHub repository. Always set them exclusively through Coolify's environment variable panel.

### Step 4.3 — Save the Variables

Click **Save** after adding all variables. Coolify encrypts these values at rest.

---

## Phase 5 — Deploy the Application

### Step 5.1 — Trigger the First Deployment

Go back to the application overview and click **Deploy**. Coolify will:

1. Pull the code from your GitHub repository
2. Build the Docker image using the `Dockerfile`
3. Start the container with the environment variables you set
4. Expose the application on port `3000`

The build typically takes 2–4 minutes. You can watch the build logs in real time by clicking **Logs** in the application panel.

### Step 5.2 — Verify the Build Succeeded

Once the deployment completes, the status indicator should turn **green** (Running). Click the temporary URL Coolify assigned to preview the site.

If the build fails, click **Logs** and scroll to the bottom to find the error. Common issues are covered in the Troubleshooting section at the end of this guide.

---

## Phase 6 — Run the Database Migration

The database tables do not exist yet. You need to run the migration once after the first successful deployment.

### Step 6.1 — Open the Terminal in Coolify

In your application panel, click the **Terminal** tab (or **Exec** button). This opens a shell inside the running container.

### Step 6.2 — Run the Migration Command

Inside the container terminal, run:

```bash
pnpm db:push
```

This command generates and applies the database schema, creating the `articles`, `admin_sessions`, and `users` tables. You should see output confirming the tables were created.

### Step 6.3 — Seed the Initial Articles (Optional)

If you want to pre-populate the database with the initial articles (including the LinkedIn QWAI series), run:

```bash
npx tsx scripts/seed-articles.mts
```

This inserts 6 articles. You can skip this step and add articles manually through the admin panel instead.

---

## Phase 7 — Configure Your Domain

### Step 7.1 — Add the Domain in Coolify

In your application settings, click the **Domains** tab and add:

```
qw.ai
www.qw.ai
```

Coolify will show you the IP address or CNAME target you need to point your DNS to.

### Step 7.2 — Update Your DNS Records

Log into your domain registrar (where you registered `qw.ai`) and add the following DNS records:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | Your Coolify server IP | 300 |
| `A` | `www` | Your Coolify server IP | 300 |

DNS propagation typically takes 5–30 minutes, though it can take up to 48 hours in rare cases.

### Step 7.3 — Enable SSL/TLS

Once DNS has propagated, go back to Coolify's **Domains** tab for your application and click **Generate SSL Certificate**. Coolify uses Let's Encrypt to issue a free certificate automatically.

After the certificate is issued, your site will be accessible at `https://qw.ai` with a valid HTTPS connection.

---

## Phase 8 — Enable Auto-Deploy on Git Push

To make the site automatically redeploy whenever you push new code to GitHub:

1. In your application settings, click the **Webhooks** or **Git** tab
2. Enable **Auto Deploy on Push**
3. Copy the webhook URL Coolify provides
4. In your GitHub repository, go to **Settings → Webhooks → Add webhook**
5. Paste the Coolify webhook URL and set the content type to `application/json`
6. Select **Just the push event**
7. Click **Add webhook**

From this point forward, every `git push` to the `main` branch will automatically trigger a new deployment on Coolify.

---

## Accessing the Admin Panel

Once the site is live, you can manage articles at:

```
https://qw.ai/admin
```

Enter the password you set as `ADMIN_PASSWORD` in Phase 4. From the dashboard you can:

- Create new articles with the rich HTML editor
- Publish or unpublish articles instantly
- Mark articles as featured (they appear on the homepage)
- Edit or delete any existing article

---

## Troubleshooting

The table below covers the most common deployment issues and their solutions.

| Symptom | Likely Cause | Solution |
|---|---|---|
| Build fails with `pnpm install` error | Node.js version mismatch | Verify the Dockerfile uses `node:22-alpine` |
| App starts but shows blank page | Missing `DATABASE_URL` | Check environment variables are saved and redeploy |
| Database connection refused | Wrong host in `DATABASE_URL` | Use the internal Coolify network hostname, not `localhost` |
| Admin login fails | Wrong `ADMIN_PASSWORD` | Check the variable in Coolify and redeploy |
| Articles not loading | Migration not run | Run `pnpm db:push` in the container terminal |
| SSL certificate fails | DNS not propagated yet | Wait 30 minutes and retry |
| `git push` rejected | Wrong remote URL | Run `git remote -v` to verify the remote URL |

---

## Keeping the Site Updated

After the initial deployment, updating the site is a two-step process:

**To update content only** (add/edit articles): Log into `/admin` and manage articles directly — no code changes or redeployment needed.

**To update the site design or features**: Make changes locally, commit, and push to GitHub. If auto-deploy is enabled, Coolify will redeploy automatically within 1–2 minutes.

```bash
# Example: push a design update
git add .
git commit -m "Update homepage hero section"
git push origin main
# Coolify auto-deploys within ~2 minutes
```

---

## Summary Checklist

Use this checklist to track your progress through the deployment:

- [ ] GitHub repository created and code pushed
- [ ] MySQL database provisioned in Coolify
- [ ] Application created in Coolify with Dockerfile build pack
- [ ] All environment variables set (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`, `NODE_ENV`)
- [ ] First deployment successful (green status)
- [ ] `pnpm db:push` run inside the container
- [ ] DNS records pointing to Coolify server IP
- [ ] SSL certificate issued
- [ ] Admin panel accessible at `https://qw.ai/admin`
- [ ] Auto-deploy webhook configured in GitHub
