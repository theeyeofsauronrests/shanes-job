# DESIGN.md - Shane's Job List

This design direction is based on the requested DefSimple design reference:

`https://github.com/theeyeofsauronrests/design-md-treasure-chest/blob/main/DefSimple-design.md`

## Positioning

Shane's Job List should feel like a small operational tool for defense technology roles. It should be direct, useful, and serious without pretending to be an official corporate property.

## Visual Direction

Use:

- Black and near-black foundations
- Bone, sand, and steel neutrals
- Amber focus/accent treatment
- Signal red for primary apply actions
- Compact technical labels
- Dense but readable cards
- Hard grid structure with practical 4px or 8px radii
- High-contrast imagery with subtle technical overlays

Avoid:

- Patriotic cliche
- Camouflage or tactical cosplay
- Glossy sci-fi styling
- One-note purple branding
- Soft startup minimalism
- Official Lyntris, Accelint, Vitesse, or third-party protected brand assets unless explicitly approved

## Tokens

```css
:root {
  --ds-blackout: #050505;
  --ds-carbon: #111111;
  --ds-graphite: #1b1c1d;
  --ds-steel: #3c4147;
  --ds-gunmetal: #687078;
  --ds-bone: #e6e0d2;
  --ds-white: #ffffff;
  --ds-sand: #b9a98b;
  --ds-khaki: #8f8064;
  --ds-dust: #d0c7b8;
  --ds-signal-red: #ff3b30;
  --ds-warning-amber: #ffb020;
  --ds-target-green: #6ee778;
  --ds-command-blue: #4da3ff;
  --ds-infra-violet: #8b5cf6;
}
```

## Typography

- Display/headings: condensed sans stack
- Body: Inter or system sans
- Data labels: monospace
- Keep letter spacing at `0`
- Use uppercase labels sparingly

## Components

### Header

- Show `Shane's Job List` as the primary heading.
- Include a short product-trio label.
- Keep the header compact enough that the carousel and disclaimer appear early.

### Hero Carousel

- Use the existing committed `/hero1.png`, `/hero2.png`, and `/hero3.png`.
- Carousel controls must be keyboard accessible.
- Disable auto-advance for reduced-motion users.
- Use the imagery as context, not navigation.

### Disclaimer

- Must appear near the top.
- Must state the site is unofficial and that linked ATS pages are the source of truth.
- Footer copy cannot be the only disclaimer.

### Job Cards

- Show title, location, company, discipline, optional department, and apply link.
- Use compact cards with clear scan order.
- Apply button uses signal red.
- Discipline chip uses target green, but text must also identify the discipline.

### Footer

- Include Shane's profile image, LinkedIn, and email.
- Reinforce that the site is unofficial.

## Accessibility

- Minimum body contrast: 4.5:1
- Visible focus styles
- No color-only status
- Reduced motion support
- Descriptive alt text and accessible link names
