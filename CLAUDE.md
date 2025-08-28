# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with live reload
hugo server

# Build for production with minification
hugo --minify

# Build with custom base URL (for deployment)
hugo --minify --baseURL "https://example.com/"
```

## Architecture Overview

This is a multilingual Hugo static site generator project for lakeshorelabs.ai with the following structure:

### Core Technologies
- **Hugo Extended v0.147.0+** - Static site generator requiring the extended version for SCSS/SASS support
- **Vanilla JavaScript** - No framework dependencies for frontend interactivity
- **Custom CSS with glassmorphism** - Modern design system with dark/light theme support

### Directory Structure
- `content/` - Multilingual content organized by language code (en/, vi/, ar-OM/)
- `layouts/` - Hugo templates including partials for modular components
- `assets/` - Source CSS and JavaScript files processed by Hugo
- `static/` - Static assets served directly (fonts, images, vendor libraries)
- `data/` - Structured YAML data for dynamic sections (partners, solutions, FAQ, etc.)
- `i18n/` - Translation files for UI strings in each language

### Key Components
- **Language Support**: Three languages with RTL support for Arabic (ar-OM)
- **Homepage Sections**: Hero, Solutions, Process, Use Cases, Partners, FAQ, CTA
- **Blog System**: Multi-language blog with taxonomies (categories, tags)
- **Automation Wizard**: Interactive lead magnet tool at `/automation-wizard/`

### Deployment
- GitHub Actions workflow (`.github/workflows/hugo.yml`) for automatic deployment to GitHub Pages
- Builds on push to main branch with Hugo minification enabled
- Custom domain configured via CNAME in public directory

### Development Patterns
- Partials-based template architecture for reusability
- Data-driven content using YAML files in `data/` directory
- Responsive mobile-first design approach
- CSS fingerprinting for cache busting in production
- SVG-based favicons with adaptive colors for light/dark modes
- Never start the server, it's always running at port 1313
- Never implement features for other languages unless explicitly asked to
- When verifying/testing features, always prefer building and checking the output in the public directory instead of using the live server