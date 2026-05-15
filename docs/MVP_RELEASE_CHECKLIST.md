# MVP Release Checklist

Final verification checklist for Lyntris Jobs MVP release.

## Build & Test Verification

- [x] **Full build passes**: `npm run build` completes successfully
  - Output: 0.77 KB HTML, 8.55 KB CSS, 195.91 KB JS
  - All assets copied to dist/
- [x] **All tests pass**: 314 tests across 25 test files
  - Unit tests: 307 passing
  - E2E tests: 7 passing
- [x] **Lint check passes**: No ESLint errors or warnings
- [x] **TypeScript compilation**: No type errors

## Content Verification

### Disclaimer

- [x] **Disclaimer visible on page load**: Prominently displayed above job listings
- [x] **Disclaimer text correct**: "This is a side project — not an official product of Lyntris, Accelint, or Vitesse Systems"
- [x] **README disclaimer**: Repeated in README.md with ⚠️ icon
- [x] **Mobile responsive**: Disclaimer visible on mobile viewport

### Job Data

- [x] **Job count accurate**: 92 jobs displayed (40 Accelint + 52 Vitesse)
- [x] **Jobs loaded**: public/jobs.json contains valid data
- [x] **Last updated timestamp**: "Last updated: [timestamp]" displays correctly
- [x] **Apply links functional**: All links use https:// URLs
- [x] **Apply links target role-specific pages**: Each job has unique apply URL
- [x] **Apply links open in new tab**: `target="_blank" rel="noopener noreferrer"`

### Hero Carousel

- [x] **Carousel renders**: Three images display correctly
- [x] **Auto-advance works**: Slides change every 5 seconds
- [x] **Navigation controls**: Previous/Next buttons functional
- [x] **Keyboard accessible**: Arrow keys work, controls have ARIA labels
- [x] **Images load**: hero1.png (tank), hero2.png (controller), hero3.png (fighter)
- [x] **Mobile responsive**: Carousel adapts to mobile viewport

### Footer

- [x] **Profile image displays**: shane.png loads correctly
- [x] **Profile image accessible**: Alt text provided
- [x] **LinkedIn link functional**: Opens correct LinkedIn profile
- [x] **Email link functional**: Opens mail client
- [x] **Footer text correct**: "Hi! My name is Shane. I work at Lyntris as the Director, AI Product Management..."
- [x] **Mobile responsive**: Footer stacks correctly on mobile

### Search & Filter

- [x] **Search input renders**: Labeled "Search jobs" with searchbox role
- [x] **Search filters jobs**: Typing filters by role, location, and company
- [x] **Job count updates**: Count reflects filtered results
- [x] **Empty state**: Shows message when no jobs match filter
- [x] **Clear filter**: Clearing search shows all jobs again

## Brand Review

- [x] **No official brand claims**: Site clearly marked as unofficial
- [x] **Lyntris-inspired design**: Uses similar aesthetic without implying endorsement
- [x] **Color palette**: Black (#000000), Ultra Violet (#7863F7), Gray scale
- [x] **Typography**: Space Grotesk, Inter, Space Mono
- [x] **No protected assets**: All images provided by project author
- [x] **Disclaimer placement**: Multiple locations (page header, README, footer text)

## Documentation

- [x] **README.md**: Comprehensive public README
- [x] **docs/PRD.md**: Product requirements documented
- [x] **docs/DESIGN.md**: Design system documented
- [x] **docs/WORKFLOW.md**: Development workflow documented
- [x] **docs/DEPLOYMENT.md**: Deployment guide complete
- [x] **data/README.md**: CSV import guide complete
- [x] **License**: Apache 2.0 license included

## Deployment

- [x] **GitHub Actions workflow**: `.github/workflows/deploy.yml` configured
- [x] **Build output static**: No server-side runtime required
- [x] **No environment variables**: Application works without any env vars
- [x] **No secrets**: No API keys or credentials required
- [ ] **Site deployed**: GitHub Pages deployment pending (after merge to main)
- [ ] **Deployment URL added**: Update README with live site URL after deployment

## Known Limitations

### Data Freshness

- **Manual updates required**: Job data is not automatically refreshed
- **Update frequency**: Depends on manual CSV updates and imports
- **Stale data risk**: Jobs may be filled or removed without notification

### Data Sources

- **Accelint**: Sourced from public Rippling job board
  - Role-specific apply URLs available
  - Can be updated by viewing public listings
- **Vitesse**: Manually entered from available sources
  - ADP system requires credentials (scraping out of scope)
  - May not have role-specific apply URLs for all positions

### Features Not Included (Out of Scope for MVP)

- No applicant tracking or form submission
- No job alerts or notifications
- No saved searches or favorites
- No job details page (links directly to ATS)
- No analytics or usage tracking
- No A/B testing or experimentation
- No authentication or user accounts
- No backend API or database

### Browser Support

- Modern browsers only (Chrome, Firefox, Safari, Edge)
- No IE11 support
- Requires JavaScript enabled

### Image Optimization

- Hero carousel images are large PNGs (~11.5 MB total)
- Could be optimized to WebP format in future
- May impact initial load time on slow connections

### Accessibility

- Meets basic WCAG 2.1 AA standards
- Keyboard navigation supported
- Screen reader friendly
- Could be enhanced with:
  - Skip links
  - Focus management
  - Reduced motion preferences

## Release Tagging

After all verification steps pass:

```bash
# Tag the release
git tag -a v1.0.0 -m "MVP Release - Lyntris Jobs v1.0.0"

# Push the tag
git push origin v1.0.0
```

## Post-Release Steps

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"
   - Wait for deployment to complete

2. **Update README**:
   - Add live site URL to README.md
   - Commit and push update

3. **Announce**:
   - Share with stakeholders
   - Provide feedback channel (GitHub Issues)

4. **Monitor**:
   - Watch for GitHub Issues
   - Check GitHub Actions for deployment failures
   - Verify site loads correctly from deployment URL

## Success Criteria Summary

- [x] All 314 tests passing
- [x] Build produces static output
- [x] Documentation complete
- [x] Disclaimer prominently displayed
- [x] No official brand ambiguity
- [x] Known limitations documented
- [ ] Site deployed (pending)
- [ ] First release tagged (pending)

**Status**: Ready for deployment and release tagging.
