# ProfessionalPortfolio

<!-- AUTO-MANAGED: project-description -->
## Overview

Professional portfolio website for Michael Barnett, SHRM-CP - Senior HR Business Partner & People Leader. Static HTML/CSS site deployed via GitHub Pages.

**Live Site:** https://mbarnett2011.github.io/ProfessionalPortfolio/

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: build-commands -->
## Build & Development Commands

```bash
# Local development - serve with Python
python -m http.server 8000

# Deploy - automatic via GitHub Actions on push to main
git push origin main
```

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
ProfessionalPortfolio/
├── index.html          # Main portfolio page
├── styles.css          # CSS styles (Inter font, responsive)
├── images/             # Headshot and assets
├── css/                # Legacy CSS folder
├── js/                 # JavaScript (minimal)
├── docs/               # Supporting documents
└── .github/workflows/  # GitHub Actions deployment
```

**Key Files:**
- `index.html` - Single-page portfolio with sections: Overview, Project Management, Talent Development, Collaboration, Systems Thinking
- `styles.css` - Modern design with CSS variables, sticky nav, card-based layout
- `.github/workflows/deploy.yml` - Auto-deploy to GitHub Pages on push

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Code Conventions

- **CSS**: CSS custom properties (variables) for colors, spacing, shadows
- **HTML**: Semantic HTML5 with BEM-style class naming
- **Fonts**: Inter from Google Fonts
- **Responsive**: Mobile-first with breakpoints at 720px, 800px, 900px

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: patterns -->
## Detected Patterns

- Card-based content sections with consistent styling
- Timeline component for experience history
- Hero section with contact CTAs
- Sticky navigation header with blur effect

<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
## Notes

Portfolio for job search - keep content updated with latest experience and achievements.

<!-- END MANUAL -->
