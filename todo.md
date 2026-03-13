# QW.AI Website TODO

## Completed
- [x] Basic homepage layout with quantum futurism design
- [x] Navigation menu with quantum wave symbol
- [x] Hero section with quantum wave background
- [x] Features section with glassmorphism cards
- [x] Articles listing page
- [x] Article detail page
- [x] Dark theme with electric cyan/magenta accents
- [x] Quantum glow effects and animations
- [x] Space Grotesk typography
- [x] Coolify deployment configuration (Dockerfile, docker-compose)
- [x] GitHub Actions CI/CD workflow
- [x] Full-stack upgrade (db, server, user)
- [x] Database schema for articles + admin_sessions tables
- [x] tRPC API for articles CRUD (public + admin-protected)
- [x] Admin authentication system (password-based, 7-day session cookie)
- [x] Admin panel for article management (list, publish, feature, delete)
- [x] Admin article editor (create/edit with HTML, preview mode)
- [x] QWAI Philosophy page with six pillars and quantum computing facts
- [x] Legal disclaimer page with full legal text
- [x] Disclaimer bar in footer on every page
- [x] SiteNav shared component with mobile menu
- [x] SiteFooter shared component with disclaimer
- [x] Restored homepage with live articles from DB, six pillars, LinkedIn CTA
- [x] Articles page with search + category filters (live from DB)
- [x] Article detail page fetches from DB by slug
- [x] Seeded 6 articles (2 QWAI LinkedIn series + 4 quantum topics)
- [x] All 6 tests passing (auth, articles, admin check)
- [x] ADMIN_PASSWORD secret configured via environment variable

## In Progress
- [x] Auto-seed articles on startup so admin panel always has content by default

## Pending / Future
- [ ] Push to GitHub repository
- [ ] Configure Coolify deployment
- [ ] Add more articles via admin panel
- [ ] Add contact/newsletter section
- [ ] Social sharing buttons on article detail pages
- [x] Update all domain references to https://qw.ai
- [x] Update HTML meta tags, title, description for qw.ai
- [x] Add Open Graph / Twitter Card meta tags for qw.ai
- [x] Add canonical URL tags pointing to qw.ai
- [x] Create/update robots.txt and sitemap.xml for qw.ai
- [x] Update CORS and cookie settings for qw.ai domain

## Analytics & SEO Features
- [x] Database schema: pageViews and newsletterSubscribers tables
- [x] Backend: track page views via tRPC mutation
- [x] Backend: newsletter subscribe/unsubscribe procedures
- [x] Admin analytics dashboard with charts (page views, top articles, referrers, devices, countries)
- [x] Dynamic per-article SEO meta tags and Article JSON-LD structured data
- [x] RSS feed at /feed.xml (auto-updated when articles published)
- [x] LinkedIn share prompt in admin article editor
- [x] Newsletter signup section on homepage

## Legitimacy & Visual Identity
- [x] Logo mark (Q+ψ) icon generated and integrated into navbar/favicon
- [x] Horizontal logo banner generated
- [ ] Hero banner image (neural network + quantum computer collision) generated
- [x] Careers page with "express interest" form
- [x] Investor Relations page with vision and "express interest" form
- [ ] Press / Media section in footer
- [x] Article cover images generated for all 6 seed articles
- [ ] Quantum/AI image library for future articles
