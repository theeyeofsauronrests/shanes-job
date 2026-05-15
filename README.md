# Lyntris Jobs

An unofficial job board for exploring open positions across legacy Accelint and Vitesse Systems during the Lyntris transition.

**⚠️ IMPORTANT: This is a personal side project by Shane Quinlan. It is NOT an official product of Lyntris, Accelint, or Vitesse Systems.**

## What is this?

Lyntris Jobs is a simple, static web application that aggregates job listings from Accelint and Vitesse Systems to help candidates explore opportunities during the company transition to Lyntris.

**Key features:**

- 🔍 Search and filter jobs by role, location, and company
- 🎨 Clean interface with Lyntris-inspired design
- 📱 Mobile-responsive layout
- 🚀 Fast static site with no backend required
- 🔒 No tracking, no analytics, no data collection

## Live Site

Visit the live site at: https://beta-lyntris-jobs.vercel.app/

## Running Locally

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/theeyeofsauronrests/beta-lyntris-jobs.git
cd beta-lyntris-jobs

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Available Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm test              # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Check code quality
npm run jobs:import   # Import jobs from CSV
```

## How It Works

### Data Source

Job listings are maintained manually in a CSV file and imported into the application:

- **Accelint jobs**: Sourced from the public [Rippling job board](https://ats.rippling.com/accelintjobboardtest/jobs)
- **Vitesse jobs**: Manually entered from available sources (ADP requires credentials)

### Updating Job Data

To update job listings:

1. Edit `data/jobs.csv` with current job information
2. Run the import script:
   ```bash
   npm run jobs:import
   ```
3. Verify the changes:
   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```
4. Commit and push:
   ```bash
   git add data/jobs.csv public/jobs.json
   git commit -m "Update job listings"
   git push
   ```

The site will automatically redeploy with updated job data.

**CSV format:**

```csv
title,location,legacyCompany,applyUrl,sourceSystem
"Software Engineer","San Diego, CA",Accelint,https://example.com/apply,Rippling
"Systems Engineer","Chantilly, VA",Vitesse,https://example.com/apply2,ADP
```

See [data/README.md](data/README.md) for complete CSV format specification and validation rules.

## Project Structure

```text
beta-lyntris-jobs/
├── src/                    # React application source
│   ├── components/         # React components
│   │   ├── Disclaimer.tsx  # Unofficial status disclaimer
│   │   ├── Footer.tsx      # Footer with profile and contact
│   │   ├── HeroCarousel.tsx# Homepage carousel
│   │   └── JobsList.tsx    # Job listing and search
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/                 # Static assets
│   ├── jobs.json           # Generated job data (from CSV)
│   ├── hero1.png           # Carousel image 1 (tank)
│   ├── hero2.png           # Carousel image 2 (controller)
│   ├── hero3.png           # Carousel image 3 (fighter)
│   └── shane.png           # Profile image
├── data/
│   ├── jobs.csv            # Manual job data entry
│   └── README.md           # CSV import guide
├── scripts/
│   └── import-jobs.ts      # CSV to JSON import script
├── tests/                  # Test files
├── docs/                   # Documentation
│   ├── PRD.md              # Product requirements
│   ├── DESIGN.md           # Design system
│   ├── WORKFLOW.md         # Development workflow
│   └── DEPLOYMENT.md       # Deployment guide
└── README.md               # This file
```

## Assets

### Hero Carousel Images

The homepage features a rotating carousel with three images:

- `public/hero1.png` - Tank image
- `public/hero2.png` - Controller image
- `public/hero3.png` - Fighter aircraft image

These images auto-advance every 5 seconds and support keyboard navigation.

### Profile Image

The footer includes Shane Quinlan's profile image (`public/shane.png`) with contact information:

- **LinkedIn**: [Shane Quinlan](https://www.linkedin.com/in/shane-quinlan-58848363/)
- **Email**: <shane.quinlan@hypergiant.com>

## Tech Stack

- **Framework**: [Vite](https://vite.dev) 8.0
- **UI Library**: [React](https://react.dev) 19.2
- **Language**: [TypeScript](https://www.typescriptlang.org) 6.0
- **Testing**: [Vitest](https://vitest.dev) 4.1 + [Playwright](https://playwright.dev) 1.60
- **Styling**: Plain CSS with [Lyntris Brand Standards](docs/DESIGN.md)
- **Deployment**: Static site (GitHub Pages, Netlify, Vercel, etc.)

## Design System

The application follows Lyntris Brand Standards:

- **Colors**: Black (#000000), Ultra Violet (#7863F7), Gray scale
- **Typography**: Space Grotesk (headings), Inter (body), Space Mono (monospace)
- **Geometry**: Square, 0px border-radius, clean lines

See [docs/DESIGN.md](docs/DESIGN.md) for complete design guidelines.

## Documentation

- **[PRD.md](docs/PRD.md)** - Product requirements and acceptance criteria
- **[DESIGN.md](docs/DESIGN.md)** - Design system and brand guidelines
- **[WORKFLOW.md](docs/WORKFLOW.md)** - Development workflow
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide for GitHub Pages, Netlify, Vercel
- **[data/README.md](data/README.md)** - CSV import guide

## Deployment

The application is a static site that can be deployed to any static hosting service.

**Quick deployment:**

```bash
npm run build  # Creates dist/ directory
```

Upload `dist/` to your hosting service, or use automated deployment:

- **GitHub Pages**: Automated via `.github/workflows/deploy.yml`
- **Netlify/Vercel**: Auto-deploy on push to main

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

This is a personal project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m "Add my feature"`)
6. Push to the branch (`git push origin feature/my-feature`)
7. Open a Pull Request

### Development Workflow

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for the complete development workflow.

**Quick workflow:**

1. Create issue-based branch
2. Make changes with tests
3. Run verification: `npm run build && npm test && npm run lint`
4. Create PR
5. Merge after review

## Privacy & Security

- No user tracking or analytics
- No cookies or local storage
- No data collection
- No environment variables required
- No secrets or API keys
- All data is public job listings
- External links open with `rel="noopener noreferrer"`

## License

Licensed under the Apache License, Version 2.0.

See [LICENSE](LICENSE) for details.

## Disclaimer

**This project is an unofficial side project and is not affiliated with, endorsed by, or sponsored by Lyntris, Accelint, or Vitesse Systems.**

The job listings displayed on this site are sourced from publicly available information and manual data entry. For official job postings and to apply, please visit the official company career pages or use the "Apply" links provided for each job listing.

## Contact

**Shane Quinlan**

- Director, AI Product Management at Lyntris
- LinkedIn: [shane-quinlan-58848363](https://www.linkedin.com/in/shane-quinlan-58848363/)
- Email: <shane.quinlan@hypergiant.com>

For issues or suggestions, please [open an issue](https://github.com/theeyeofsauronrests/beta-lyntris-jobs/issues) on GitHub.

---

Built with ❤️ by Shane Quinlan
