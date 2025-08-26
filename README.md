# Lakeshore Labs - Hugo Site

A modern, performant Hugo-based website for Lakeshore Labs, featuring AI and automation solutions for enterprises.

## Features

- ✅ **Hugo Static Site Generator** - Fast, secure, and SEO-friendly
- ✅ **Responsive Design** - Mobile-first approach with modern CSS
- ✅ **Theme Switcher** - Dark/Light mode with localStorage persistence
- ✅ **Modular Architecture** - Organized with partials and data files
- ✅ **Asset Pipeline** - Automatic CSS/JS minification and fingerprinting
- ✅ **SEO Optimized** - Meta tags, structured data, and sitemap generation
- ✅ **Easy Content Management** - Markdown-based content with YAML data files

## Directory Structure

```
hugo/
├── archetypes/       # Content templates
├── assets/          # CSS, JS, and processable assets
│   ├── css/
│   └── js/
├── content/         # Markdown content files
│   └── _index.md    # Homepage content
├── data/            # Structured data (YAML)
│   ├── faq.yaml
│   ├── partners.yaml
│   ├── process.yaml
│   ├── solutions.yaml
│   └── usecases.yaml
├── layouts/         # Hugo templates
│   ├── _default/    # Default templates
│   ├── partials/    # Reusable components
│   └── index.html   # Homepage template
├── public/          # Generated site (git-ignored)
├── static/          # Static files (images, fonts, etc.)
└── hugo.toml        # Hugo configuration
```

## Quick Start

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.147.0 or later
- Git

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd hugo
```

2. Run the development server:
```bash
hugo server
```

3. Open http://localhost:1313 in your browser

### Building for Production

```bash
hugo --minify
```

This generates optimized static files in the `public/` directory.

## Content Management

### Homepage Content

Edit `content/_index.md` to update:
- Hero section text
- CTA section content
- Meta descriptions

### Data Files

Update YAML files in `data/` directory:

- **partners.yaml** - Company logos and names
- **solutions.yaml** - Solutions tabs and features
- **process.yaml** - Process steps
- **faq.yaml** - FAQ questions and answers
- **usecases.yaml** - Use case carousel items

### Navigation

Edit menu items in `hugo.toml`:

```toml
[menus]
  [[menus.main]]
    name = "Solutions"
    url = "#solutions"
    weight = 10
```

## Customization

### Styles

- Main styles: `assets/css/styles.css`
- Theme variables are defined in CSS custom properties
- Supports Lavender (default) and Dark themes

### JavaScript

- Main script: `assets/js/script.js`
- Handles theme switching, mobile menu, tabs, and animations

### Templates

- Base template: `layouts/_default/baseof.html`
- Homepage: `layouts/index.html`
- Partials: `layouts/partials/`

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch using GitHub Actions.

### Manual Deployment Options

#### Netlify

1. Connect your repository to Netlify
2. Build command: `hugo --minify`
3. Publish directory: `public`

#### Vercel

1. Import your repository
2. Framework Preset: Hugo
3. Build command: `hugo --minify`
4. Output directory: `public`

## Performance

The site achieves excellent performance scores:
- ⚡ Lightning-fast page loads (< 1s)
- 📦 Optimized assets with minification
- 🖼️ Lazy-loaded images
- 🔄 Efficient caching strategies

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome)

## License

Proprietary - Lakeshore Labs

## Contact

For questions or support, contact: hello@lakeshorelabs.ai
