# Agent Guidelines

## CSS

- Mobile-first: base rules target narrow screens. Put desktop-only changes in `@media (min-width: 48em)` at the end of the component file.
- Use logical properties for flow-relative layout: `margin-inline`, `padding-block`, `border-block-start`, `border-inline-end`, logical corner radii, `inset-inline`, etc.
- Use physical properties only when tied to the viewport, an image, or a light source (`background-position`, `box-shadow`).
- Use `inline-size`/`block-size` instead of `width`/`height` when the size should follow writing mode.
- Prefer `start`/`end` alignment. Use `float: inline-start`/`inline-end` when floating.
- Use `max-inline-size` rather than fixed widths.
- Do not add CSS comments unless behavior is unusual or unexpected.
