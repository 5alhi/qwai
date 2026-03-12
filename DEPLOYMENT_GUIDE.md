# Deployment Guide for Quantum Wave AI Website

This guide provides step-by-step instructions for deploying the Quantum Wave AI website to Coolify and configuring it for the qw.ai domain.

## Prerequisites

- GitHub account with repository access
- Coolify instance running (self-hosted or managed)
- Docker support enabled on your Coolify server
- Domain registrar access (for qw.ai domain)
- SSH access to your server (if self-hosted Coolify)

## Step 1: Prepare GitHub Repository

### 1.1 Create GitHub Repository

```bash
# Initialize git if not already done
cd /home/ubuntu/qw-ai-website
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Quantum Wave AI website"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/qw-ai-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.2 Configure GitHub Secrets (for CI/CD)

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `COOLIFY_WEBHOOK`: Your Coolify webhook URL (obtained from Coolify)

## Step 2: Set Up Coolify

### 2.1 Access Coolify Dashboard

1. Open your Coolify instance (typically `https://your-coolify-domain.com`)
2. Log in with your credentials
3. Navigate to **Projects** or **Applications**

### 2.2 Create New Application

1. Click **Create Application** or **New Project**
2. Select **Docker** as the build method
3. Choose **GitHub** as the source
4. Authenticate with GitHub and select your repository (`qw-ai-website`)

### 2.3 Configure Build Settings

In the Coolify application settings:

**General Settings:**
- Application Name: `Quantum Wave AI`
- Description: `Futuristic website for Quantum Wave Artificial Intelligence`

**Build Configuration:**
- Build Command: `pnpm run build`
- Start Command: `pnpm start`
- Dockerfile: `./Dockerfile`
- Port: `3000`

**Environment Variables:**
```
NODE_ENV=production
```

### 2.4 Configure Deployment

1. **Auto-deploy on push**: Enable automatic deployment when code is pushed to main branch
2. **Deployment strategy**: Select rolling deployment for zero-downtime updates
3. **Resource limits**: Set appropriate CPU and memory limits for your server

### 2.5 Enable SSL/TLS

1. In Coolify, navigate to your application settings
2. Go to **SSL/TLS** section
3. Enable **Let's Encrypt** for automatic certificate generation
4. Coolify will handle certificate renewal automatically

## Step 3: Configure Domain

### 3.1 Add Custom Domain in Coolify

1. In your application settings, go to **Domains**
2. Click **Add Domain**
3. Enter: `qw.ai`
4. Enable SSL/TLS for this domain
5. Save the configuration

### 3.2 Update DNS Records

At your domain registrar (where you registered qw.ai):

1. Log in to your domain registrar account
2. Find DNS management section
3. Add or update DNS records:

**Option A: Using A Record (if you have a static IP)**
```
Type: A
Name: @
Value: YOUR_SERVER_IP_ADDRESS
TTL: 3600
```

**Option B: Using CNAME Record (if using Coolify's provided domain)**
```
Type: CNAME
Name: @
Value: your-coolify-instance.com
TTL: 3600
```

**Option C: Using NS Records (if using Coolify's DNS)**
- Follow Coolify's instructions for nameserver configuration

### 3.3 Verify DNS Configuration

```bash
# Check DNS propagation
nslookup qw.ai
dig qw.ai

# Should return your server's IP address
```

DNS propagation can take 24-48 hours. You can check status at:
- https://www.whatsmydns.net/
- https://dnschecker.org/

## Step 4: Deploy Application

### 4.1 Trigger Initial Deployment

1. In Coolify dashboard, click **Deploy** button
2. Monitor the deployment logs
3. Wait for deployment to complete (typically 5-10 minutes)

### 4.2 Verify Deployment

```bash
# Check if application is running
curl http://localhost:3000

# Check from your domain (after DNS propagation)
curl https://qw.ai

# Should return HTML content of the website
```

### 4.3 Monitor Application

1. In Coolify dashboard, view **Logs** for any errors
2. Check **Health Status** to ensure application is running
3. Monitor **Resource Usage** (CPU, Memory)

## Step 5: Continuous Deployment

### 5.1 GitHub Actions Workflow

The `.github/workflows/deploy.yml` file is configured to:

1. Run on every push to `main` branch
2. Install dependencies
3. Run TypeScript checks
4. Build the application
5. Trigger Coolify deployment via webhook

### 5.2 Update Workflow

To enable automatic Coolify deployment:

1. In Coolify, go to your application settings
2. Find **Webhooks** section
3. Copy the webhook URL
4. Add it as a GitHub secret: `COOLIFY_WEBHOOK`

Now, every push to `main` will automatically trigger deployment!

## Step 6: Post-Deployment Verification

### 6.1 Test Website

1. Visit `https://qw.ai` in your browser
2. Verify all pages load correctly:
   - Homepage (`/`)
   - Articles page (`/articles`)
   - Individual article (`/articles/quantum-computing-breakthrough`)
3. Test navigation and links
4. Check responsive design on mobile

### 6.2 Performance Check

```bash
# Check page load time
curl -w "Time: %{time_total}s\n" https://qw.ai

# Check SSL certificate
openssl s_client -connect qw.ai:443
```

### 6.3 SEO Verification

1. Check meta tags are present
2. Verify Open Graph tags for social sharing
3. Test with Google Search Console
4. Submit sitemap to search engines

## Step 7: Maintenance

### 7.1 Regular Updates

To update content or code:

```bash
# Make changes locally
# Update articles, sections, or code

# Commit and push
git add .
git commit -m "Update: Description of changes"
git push origin main

# Coolify will automatically deploy
```

### 7.2 Monitoring

1. **Monitor logs**: Check Coolify logs for errors
2. **Monitor performance**: Track CPU, memory, and response times
3. **Monitor uptime**: Set up monitoring alerts
4. **Monitor SSL**: Ensure certificates are renewing automatically

### 7.3 Backup

1. Ensure your GitHub repository is your backup
2. Consider backing up database if added later
3. Keep local copies of important files

## Troubleshooting

### Application Won't Deploy

1. Check build logs in Coolify for errors
2. Verify all dependencies are in `package.json`
3. Ensure `Dockerfile` is correct
4. Check available disk space on server

### Domain Not Working

1. Verify DNS records are correct: `nslookup qw.ai`
2. Wait for DNS propagation (up to 48 hours)
3. Check SSL certificate status in Coolify
4. Verify firewall allows port 443 (HTTPS)

### Slow Performance

1. Check server resource usage in Coolify
2. Verify images are optimized (WebP format)
3. Check browser cache settings
4. Monitor network requests in browser DevTools

### SSL Certificate Issues

1. Ensure domain DNS is pointing to server
2. Check certificate renewal logs in Coolify
3. Verify port 80 (HTTP) is accessible for Let's Encrypt validation
4. Contact Coolify support if issues persist

## Advanced Configuration

### 7.1 Custom Environment Variables

Add environment variables in Coolify:

1. Go to application settings
2. Add to **Environment Variables**:
```
CUSTOM_VAR=value
ANOTHER_VAR=another_value
```

### 7.2 Database Integration (Future)

If adding a database:

1. Create database service in Coolify
2. Add connection string to environment variables
3. Update application code to use database
4. Run migrations during deployment

### 7.3 Scaling

For high traffic:

1. Enable **Horizontal Scaling** in Coolify
2. Configure load balancer
3. Set up database replication
4. Monitor performance metrics

## Support and Resources

- **Coolify Documentation**: https://docs.coolify.io
- **Docker Documentation**: https://docs.docker.com
- **GitHub Actions**: https://docs.github.com/en/actions
- **Let's Encrypt**: https://letsencrypt.org

## Checklist

- [ ] GitHub repository created and pushed
- [ ] Coolify application created
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Domain added to Coolify
- [ ] DNS records updated
- [ ] DNS propagation verified
- [ ] Initial deployment successful
- [ ] Website accessible at qw.ai
- [ ] SSL certificate active
- [ ] All pages tested
- [ ] GitHub Actions workflow enabled
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

**Deployment Complete!** Your Quantum Wave AI website is now live at qw.ai.

For questions or issues, refer to the README.md or Coolify documentation.
