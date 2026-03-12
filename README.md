# Quantum Wave AI (qw.ai) - Website

A futuristic, high-performance website for Quantum Wave Artificial Intelligence featuring quantum computing and AI aesthetics with dark backgrounds and bright quantum-inspired colors.

## Design Philosophy

**Quantum Futurism with Premium Startup Aesthetic**

The website combines quantum computing symbolism with AI sophistication. Key design elements include:

- **Dark Backgrounds**: Deep charcoal to black (`#0a0e27` to `#000000`)
- **Electric Accents**: Cyan (`#00d9ff`), Magenta (`#ff00ff`), Quantum Blue (`#0080ff`)
- **Typography**: Space Grotesk for bold headings, Inter for body text, IBM Plex Mono for code
- **Effects**: Glassmorphism cards, quantum glow effects, smooth animations
- **Symbolism**: Quantum wave function (ψ), particle grids, wave visualizations

## Technology Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Routing**: Wouter (lightweight client-side routing)
- **UI Components**: shadcn/ui with Radix UI
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Deployment**: Docker + Coolify

## Project Structure

```
client/
  public/              # Static configuration files (favicon, robots.txt)
  src/
    pages/            # Page components
      Home.tsx        # Hero, features, CTA sections
      Articles.tsx    # Article listing with grid
      ArticleDetail.tsx # Individual article display
    components/       # Reusable UI components
    contexts/         # React contexts (theme management)
    lib/              # Utility functions
    index.css         # Global styles and design tokens
    App.tsx           # Main app with routing
    main.tsx          # React entry point
server/
  index.ts            # Express server for production
Dockerfile            # Container configuration for Coolify
coolify.json          # Coolify deployment config
package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# The site will be available at http://localhost:3000
```

### Build for Production

```bash
# Build the application
pnpm run build

# Preview the production build locally
pnpm run preview

# Start production server
pnpm start
```

## Easily Updatable Content

### Adding/Updating Articles

Articles are stored in `client/src/pages/Articles.tsx` in the `articles` array and in `client/src/pages/ArticleDetail.tsx` in the `articleDatabase` object.

**To add a new article:**

1. Open `client/src/pages/Articles.tsx`
2. Add a new object to the `articles` array:

```typescript
{
  slug: "unique-article-slug",
  title: "Article Title",
  excerpt: "Short description of the article",
  date: "2026-03-12",
  author: "Author Name",
  category: "Category Name",
  image: "https://cdn-url-to-image.webp",
}
```

3. Open `client/src/pages/ArticleDetail.tsx`
4. Add the corresponding entry to the `articleDatabase` object:

```typescript
"unique-article-slug": {
  title: "Article Title",
  author: "Author Name",
  date: "2026-03-12",
  category: "Category Name",
  image: "https://cdn-url-to-image.webp",
  excerpt: "Short description",
  content: `
    <h2>Section Title</h2>
    <p>Article content in HTML format...</p>
    <ul>
      <li>List item</li>
    </ul>
  `,
}
```

### Updating Homepage Sections

The homepage is in `client/src/pages/Home.tsx`. You can easily modify:

- **Hero Section**: Update title, subtitle, CTA buttons
- **Features Section**: Modify feature cards (title, description, icon)
- **CTA Section**: Change call-to-action text and buttons
- **Navigation**: Update nav links and branding
- **Footer**: Modify footer links and content

### Updating Design Colors

Global design tokens are in `client/src/index.css`:

- **Background Colors**: Update `:root` and `.dark` CSS variables
- **Accent Colors**: Modify `--accent`, `--primary`, `--secondary`
- **Typography**: Update font families in `@layer base`
- **Effects**: Modify glow and animation definitions in `@layer components`

### Updating Navigation and Branding

The navigation bar appears in all pages. To update:

1. **Logo/Brand**: Edit the quantum wave symbol (ψ) and "qw.ai" text in navigation
2. **Nav Links**: Modify the Link components in the nav section
3. **Branding**: Update colors, fonts, and spacing as needed

## Deployment

### Coolify Deployment

This project is configured for deployment on Coolify using Docker.

**Prerequisites:**
- Coolify instance running
- GitHub repository with this code
- Docker support enabled on Coolify

**Steps:**

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/qw-ai-website.git
   git push -u origin main
   ```

2. **In Coolify**:
   - Create a new application
   - Select "Docker" as the build method
   - Connect your GitHub repository
   - Set the build command: `pnpm run build`
   - Set the start command: `pnpm start`
   - Configure environment variables if needed
   - Deploy

3. **Custom Domain**:
   - In Coolify, add your custom domain (qw.ai)
   - Configure DNS records to point to your Coolify instance
   - Enable SSL/TLS certificate

### Environment Variables

For production deployment, you may need to set:

```env
NODE_ENV=production
PORT=3000
```

## Features

### Current Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark theme with quantum aesthetics
- ✅ Hero section with background images
- ✅ Feature cards with hover effects
- ✅ Article listing page
- ✅ Individual article pages with full content
- ✅ Smooth animations and transitions
- ✅ Glassmorphism effects
- ✅ Quantum glow effects
- ✅ SEO-friendly structure
- ✅ Fast performance (Vite + React)

### Easily Expandable

The website is designed to be easily extended:

- **Add Pages**: Create new files in `client/src/pages/` and add routes to `App.tsx`
- **Add Components**: Create reusable components in `client/src/components/`
- **Add Features**: Extend with new sections, forms, or interactive elements
- **Styling**: Use Tailwind CSS utilities and design tokens

## Performance

- **Build Size**: Optimized with Vite and tree-shaking
- **Load Time**: Fast initial load with code splitting
- **Images**: Optimized WebP format with CDN delivery
- **Caching**: Configured for optimal browser caching

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## SEO

The website includes:

- Semantic HTML structure
- Meta tags and descriptions
- Open Graph tags for social sharing
- Mobile-friendly viewport configuration
- Fast page load times

## Customization Guide

### Colors

Edit the OKLCH color values in `client/src/index.css`:

```css
:root {
  --primary: oklch(0.55 0.3 262);      /* Quantum Blue */
  --accent: oklch(0.6 0.25 262);       /* Electric Cyan */
  --background: oklch(0.08 0.01 262);  /* Deep charcoal */
}
```

### Typography

Update font families in `client/index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;700&display=swap" rel="stylesheet" />
```

Then update `client/src/index.css`:

```css
h1, h2, h3 {
  font-family: 'Your Font', sans-serif;
}
```

### Images

Replace background images by updating the URLs in page components:

```typescript
backgroundImage: "url('https://your-cdn-url/image.webp')"
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### Development Server Issues

```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart dev server
pnpm run dev
```

### TypeScript Errors

```bash
# Check for type errors
pnpm run check

# Fix common issues
pnpm run format
```

## License

MIT License - feel free to use this project for your purposes.

## Support

For questions or issues, please refer to:

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Version History

- **v1.0.0** (2026-03-12): Initial release with hero, features, articles, and deployment configuration

---

**Quantum Wave AI - Harnessing the power of quantum computing and AI to solve tomorrow's challenges today.**
