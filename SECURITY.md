# Security Policy

## Overview

Lyntris Jobs is a static web application with no backend, no database, and no user data collection. This document outlines the security posture and reporting process.

## Security Posture

### What We Don't Collect

- ❌ No user accounts or authentication
- ❌ No cookies or local storage
- ❌ No personal data collection
- ❌ No form submissions or user input processing
- ❌ No analytics or tracking
- ❌ No API keys or secrets
- ❌ No environment variables required

### What We Do

- ✅ Static site with no server-side processing
- ✅ All data is public job listings
- ✅ External links use `rel="noopener noreferrer"`
- ✅ HTTPS-only apply URLs
- ✅ No third-party scripts or tracking
- ✅ Content Security Policy friendly

### Dependencies

All dependencies are managed via npm and regularly updated:
- React 19.2 for UI
- TypeScript 6.0 for type safety
- Vite 8.0 for build tooling
- csv-parse for data import (build-time only)

Dependencies are reviewed for known vulnerabilities using:
```bash
npm audit
```

## Reporting a Vulnerability

If you discover a security vulnerability, please report it via:

**Email**: shane.quinlan@hypergiant.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and provide updates as we investigate.

## Security Best Practices for Users

### When Viewing the Site

- ✅ Verify you're on the official deployment URL
- ✅ Ensure the URL uses HTTPS
- ✅ Apply links open in a new tab - review before submitting applications
- ✅ No credentials or personal data should be entered on this site

### When Contributing

- ✅ Never commit secrets, API keys, or credentials
- ✅ Run `npm audit` before submitting PRs
- ✅ Follow the existing patterns for external links
- ✅ Ensure all apply URLs use HTTPS
- ✅ Test changes locally before submitting
- ✅ Run all tests: `npm run build && npm test && npm run lint`

## Disclosure Policy

- Vulnerabilities will be addressed as quickly as possible
- Security fixes will be released without delay
- CVEs will be requested for serious vulnerabilities
- Users will be notified via GitHub releases

## Out of Scope

The following are not considered security vulnerabilities:

- Missing security headers (site is static with no sensitive data)
- Clickjacking on external apply links (user intent)
- Information disclosure of public job listings (data is public)
- Social engineering attacks targeting job applicants
- Security issues on external job application sites
- Missing rate limiting (no API or backend)
- Missing CSRF protection (no state-changing operations)

## Security Features

### Static Architecture

The static nature of this application eliminates entire classes of vulnerabilities:
- No SQL injection (no database)
- No XSS in dynamic content (no user input)
- No SSRF (no server-side requests)
- No authentication bypass (no authentication)
- No session hijacking (no sessions)

### Content Security

All job data is:
- Validated at build time with Zod schemas
- Sourced from public job boards
- Manually reviewed during import
- Contains only public information

### External Links

All apply links:
- Must use HTTPS (enforced by validation)
- Open in new tabs with `rel="noopener noreferrer"`
- Point directly to official ATS systems
- Are not tracked or proxied

## Security Checklist for Maintainers

Before each release:

- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] All dependencies are up to date
- [ ] No credentials or secrets in code or config
- [ ] All tests passing
- [ ] Build produces static output only
- [ ] No console errors in browser
- [ ] All apply links use HTTPS
- [ ] CSV data validated before import

## Contact

For security concerns or questions:
- **Email**: shane.quinlan@hypergiant.com
- **GitHub Issues**: For non-security bugs and features only

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who report valid vulnerabilities.
