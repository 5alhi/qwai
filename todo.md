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
- [x] Social sharing buttons on article detail pages (LinkedIn, X/Twitter, Copy Link)
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
- [x] Logo mark v2: Q as outer shell, ψ rotated with stem aligning to Q tail, fork as internal wave (SVG + PNG + transparent variants)
- [x] Horizontal logo banner generated
- [x] Hero banner image (neural network + quantum computer collision) generated
- [x] Careers page with "express interest" form
- [x] Investor Relations page with vision and "express interest" form
- [x] Press / Media Kit page (/press) with logo downloads, brand colours, typography, company description
- [x] Article cover images generated for all 6 seed articles
- [ ] Quantum/AI image library for future articles

## Logo v10 Lock-in (Official Mark)
- [x] Generate new OG/Twitter social banner (1200x630) with v10 logo
- [x] Generate new Press Kit horizontal banner with v10 logo + QWAI text
- [x] Update OG/Twitter image tags in index.html to new banner
- [x] Update Press page banner and remove old SVG references
- [x] Favicon.ico updated to v10 icon (16/32/48px multi-size)

## Bug Fixes
- [x] Fix React error #310 crash on article pages (useState hook moved before conditional returns)
- [x] Remove all em-dashes from the entire codebase and replace with appropriate punctuation

## Content Seeding
- [x] Seed Article #3: The Way of the QWAI - The Classical Capex Cliff (with cover image)
- [x] Generate QWAI Feasibility Matrix infographic for Article #3
- [x] Generate shared cover image for Foundational Papers category
- [x] Generate individual cover images for all 20 foundational papers
- [x] Seed 20 foundational quantum computing papers as articles in the database
- [x] Update Articles page to display Foundational Papers and The Way of the QWAI categories

## Production Seed
- [x] Add admin-triggered seedArticles tRPC procedure (safe to run multiple times)
- [x] Add Seed Articles button in Admin panel

## Article #3 Table Fix
- [x] Replace feasibility matrix table in Article #3 with clean version from user's HTML paste (styled with cyan headers, bold QWAI values, alternating rows)

## Article #3 LinkedIn Update
- [x] Update Article #3 content with final LinkedIn-published version (The Physics of the P and L)
- [x] Update LinkedIn URL to https://www.linkedin.com/pulse/classical-capex-cliff-samer-salhi-ik4nf
- [x] Update seedData.ts to match final version

## Tagline, Banner, Email & Admin Logo
- [x] Update tagline to "Quantum Wave .Collapse. Artificial Intelligence" across site (hero, meta, OG tags, footer)
- [x] Fix missing v10 logo in admin portal header (replaced psi symbol with v10 icon)
- [x] Update JSON-LD sameAs to include LinkedIn company page
- [x] Generate LinkedIn hero banner (1584x396) with v10 logo, tagline, qw.ai address
- [x] Upload LinkedIn banner to CDN
- [x] Email addresses in footer: info, press, careers, investors @qw.ai
- [x] Add direct email link to Careers page (careers@qw.ai)
- [x] Add direct email link to Investors page (investors@qw.ai)

## Hero Tagline Layout
- [x] Three-line hero tagline: Quantum Wave / .Collapse. / Artificial Intelligence, center-justified, smaller text, bright cyan dots
