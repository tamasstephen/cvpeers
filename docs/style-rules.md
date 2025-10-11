# Style Rules

This document defines the shared styling rules and tokens used across the project. All components should use these tokens and utilities for consistency.

## Typography

- Font family: `Geist`, fallback to system sans
- Apply to all `body`, headings, inputs, and buttons

## Spacing Scale (4pt)

- `--space-0: 0`
- `--space-4: 4px`
- `--space-8: 8px`
- `--space-12: 12px`
- `--space-16: 16px`
- `--space-20: 20px`
- `--space-24: 24px`
- `--space-32: 32px`
- `--space-40: 40px`

Usage:

- Vertical stacks: `.v-stack.gap-8` or `.v-stack.gap-12`
- Horizontal adjacency: `.h-stack.gap-8` (wrap on small screens)

## Radius

- Max control radius: `--radius-8: 8px`
- Additional radii: `--radius-0: 0`, `--radius-4: 4px`

## Colors

- `--color-black: #1a1a1a`
- `--color-white: #ffffff`
- `--gray-200: #f0f0f0`
- `--gray-700: #333333`

## Control Height

- `--control-height: 40px`
- Buttons next to inputs should align to this height

## Buttons

Align to `docs/css-enhancements.md`.

- `.btn-filled`: black background (`#1a1a1a`), white text, hover to `#333333`, radius up to 8px
- `.btn-outlined`: transparent background, black text, 1px black border, hover background `#f0f0f0`, radius up to 8px
- Both use Geist font and have smooth hover transitions

## Dialogs (Angular Material MatDialog)

- Use default width `600px`, `max-width: 90vw`, with `panelClass: app-dialog`
- Dialog surface radius: `8px`
- Content padding: `16px`
- Actions padding: `12px 16px`, actions aligned to end, `gap: 8px`
- Structure classes: `.dialog-header`, `.dialog-content`, `.dialog-actions`

## Forms

- Default `MatFormField` appearance: `outline`
- Ensure every field has a visible `<mat-label>` (no placeholder-only fields)
- Use `.v-stack` for vertical form sections and `.h-stack` for rows of fields

## Utilities

- `.h-stack`: flex row, center aligned, default `gap: 8px`
- `.v-stack`: flex column, default `gap: 8px`
- `.gap-4`, `.gap-8`, `.gap-12`, `.gap-16`, `.gap-24`: override default gaps
- `.ml-4`, `.ml-8`, `.ml-12`, `.ml-16`: left margins for inline spacing when needed
- `.w-100`: width 100%

## Responsive

- Dialog padding reduces to `12px` on very small screens (< 360px)
- `.h-stack` may wrap on narrow screens; preserve `gap`

Adopt these rules for all new UI and migrate existing components progressively.
