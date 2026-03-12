# qw.ai — Quantum Wave Artificial Intelligence

**Quantum Wave AI (QWAI)** is a conceptual framework exploring the convergence of quantum wave mechanics and artificial neural networks — where both systems reach their limits, and something new emerges.

> **Disclaimer:** QWAI is a theoretical concept in early ideation stages. It does not represent a commercially available product, service, or technology. All content is speculative and intended for intellectual exploration only.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS 4 |
| Backend | Express 4 + tRPC 11 |
| Database | MySQL (via Drizzle ORM) |
| Auth | Password-based admin sessions (JWT-signed cookies) |
| Deployment | Docker + Coolify |

---

## Local Development

### Prerequisites

- Node.js 22+
- pnpm 10+
- MySQL database (local or cloud)

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_ORG/qw-ai-website.git
cd qw-ai-website

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, and ADMIN_PASSWORD

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The site will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Secret for session cookie signing | Yes |
| `ADMIN_PASSWORD` | Password for the admin panel | Yes |

Example `.env`:
```
DATABASE_URL=mysql://user:password@localhost:3306/qwai
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=your-secure-password
```

---

## Admin Panel

The admin panel is accessible at `/admin`. Use the `ADMIN_PASSWORD` environment variable to log in. Sessions last 7 days.

### Managing Articles

Once logged in at `/admin`, you can:

1. **Create a new article** — Click "New Article" button
2. **Edit an existing article** — Click the pencil icon next to any article
3. **Publish/unpublish** — Toggle the eye icon to control public visibility
4. **Feature an article** — Toggle the star icon to show it on the homepage
5. **Delete an article** — Click the trash icon (irreversible)

### Article Content Format

Article content is written in **HTML**. Supported tags:

```html
<h2>Section Heading</h2>
<h3>Sub-heading</h3>
<p>Paragraph with <strong>bold</strong> and <em>italic</em>.</p>
<blockquote>A notable quote or callout.</blockquote>
<ul><li>List item</li></ul>
<ol><li>Numbered item</li></ol>
<a href="https://...">Link text</a>
```

### Article Fields

| Field | Description |
|---|---|
| Title | Article headline |
| URL Slug | URL path (auto-generated from title, editable) |
| Excerpt | Short summary shown in listings |
| Content | Full article body in HTML |
| Author | Author name |
| Category | One of the predefined categories |
| Cover Image URL | CDN URL for the article header image |
| LinkedIn URL | Optional link to original LinkedIn post |
| Published | Whether the article is visible to the public |
| Featured | Whether the article appears on the homepage |

---

## Site Structure

```
/                    → Homepage: hero, six pillars, featured articles
/philosophy          → The Way of QWAI — full philosophy page
/articles            → Article listing with search and category filters
/articles/:slug      → Individual article detail page
/legal               → Full legal disclaimer
/admin               → Admin login
/admin/dashboard     → Article management dashboard
/admin/articles/new  → Create new article
/admin/articles/:id/edit → Edit existing article
```

---

## Deployment with Coolify

### Prerequisites

- A Coolify instance running on your server
- A MySQL database (can be provisioned via Coolify)
- A GitHub repository containing this code

### Steps

**1. Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_ORG/qw-ai-website.git
git push -u origin main
```

**2. Create a new application in Coolify**
- Source: GitHub repository
- Build pack: Dockerfile
- Port: `3000`

**3. Set environment variables in Coolify**
```
DATABASE_URL=mysql://user:password@host:3306/qwai
JWT_SECRET=<generate a strong random string>
ADMIN_PASSWORD=<your chosen admin password>
```

**4. Deploy**
- Click "Deploy" in Coolify
- The Dockerfile will build and start the application

**5. Initialize the database** (first deploy only)
```bash
pnpm db:push
```

### Docker Build

```bash
# Build locally
docker build -t qw-ai-website .

# Run locally
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://..." \
  -e JWT_SECRET="..." \
  -e ADMIN_PASSWORD="..." \
  qw-ai-website
```

---

## Design System

The site uses a **Quantum Futurism** design language:

| Token | Value | Usage |
|---|---|---|
| Primary | `oklch(0.55 0.3 262)` | Quantum blue |
| Accent | `oklch(0.65 0.25 262)` | Electric cyan |
| Background | `oklch(0.08 0.01 262)` | Deep charcoal |
| Heading font | Space Grotesk | Bold, futuristic |
| Body font | Inter | Clean, readable |

CSS variables are defined in `client/src/index.css`. The `glow-cyan`, `glow-magenta`, and `glass` utility classes are available throughout the application.

---

## Seeding Articles

To bulk-import articles, edit `scripts/seed-articles.mts` and run:

```bash
npx tsx scripts/seed-articles.mts
```

---

## Testing

```bash
pnpm test
```

Tests cover admin authentication, article API, and session management.

---

## License

© 2025 Quantum Wave AI (qw.ai). All rights reserved.
