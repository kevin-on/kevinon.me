# Style Guide

This guide documents the semantic design tokens used by the site. Colors are defined once in `app/globals.css` with `light-dark()`, exposed to Tailwind CSS v4, and selected by `color-scheme`.

Use role-based tokens instead of palette utilities such as `text-gray-500`, `text-green-600`, or `text-red-500`. A component should not need a `dark:` color override.

The `docs` directory is excluded from Tailwind source detection, so class names in documentation examples do not generate production utilities.

---

## Color Tokens

### Text

| Tailwind class | CSS variable | Usage |
| --- | --- | --- |
| `text-foreground` | `--color-foreground` | Headings, body copy, and primary UI text |
| `text-foreground-muted` | `--color-foreground-muted` | Descriptions, secondary labels, and inactive navigation |
| `text-foreground-subtle` | `--color-foreground-subtle` | Dates, captions, eyebrows, and low-emphasis metadata |

| Token | Light | Dark |
| --- | --- | --- |
| `foreground` | `#27241f` | `rgba(255, 255, 245, 0.86)` |
| `foreground-muted` | `rgba(39, 36, 31, 0.76)` | `rgba(235, 235, 245, 0.60)` |
| `foreground-subtle` | `rgba(39, 36, 31, 0.65)` | `rgba(235, 235, 245, 0.52)` |

All three text levels meet WCAG AA contrast for normal text on the site's current background surfaces. Prefer the strongest level that matches the information hierarchy; do not reduce opacity locally to create another text tier.

```tsx
<h1 className="text-foreground">Main heading</h1>
<p className="text-foreground-muted">Description</p>
<span className="text-foreground-subtle">July 13, 2026</span>
```

### Accent

Use `accent` for links, the current location, selected controls, focus outlines, and interactive emphasis.

| Tailwind class | Usage |
| --- | --- |
| `text-accent` | Links, active text, and selected icons |
| `bg-accent` | Compact selected controls such as checkboxes |
| `outline-accent` | Keyboard focus rings |

| Mode | Value | Contrast on page background |
| --- | --- | --- |
| Light | `#205ea6` | `6.33:1` |
| Dark | `#747bff` | `4.92:1` |

The accent itself does not change shade on hover or focus. Express interaction with underline, background, movement, or another non-color cue. This keeps the text contrast stable and avoids component-level `dark:` shade selection.

```tsx
<a className="text-foreground-subtle hover:text-accent">GitHub</a>
<a className="focus-visible:outline-2 focus-visible:outline-accent">Post</a>
```

### Backgrounds and Dividers

| Tailwind class | CSS variable | Usage |
| --- | --- | --- |
| `bg-background` | `--color-background` | Main page canvas |
| `bg-background-elevated` | `--color-background-elevated` | Menus, popovers, and elevated controls |
| `bg-background-soft` | `--color-background-soft` | Code blocks and subtle hover surfaces |
| `border-divider` | `--color-divider` | Separators, table rules, and quiet component borders |

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#fefbf5` | `#1b1b1f` |
| `background-elevated` | `#fffefb` | `#202127` |
| `background-soft` | `#f5efe5` | `#202127` |
| `divider` | `#e5dcce` | `rgba(82, 82, 89, 0.32)` |

`divider` is intentionally quiet. Do not use it as the only visual boundary for a control whose shape must be perceivable.

### Status and Content Accents

| Tailwind class / variable | Light | Dark | Usage |
| --- | --- | --- | --- |
| `text-positive` | `#16794b` | `#5fca8c` | Success feedback and positive deltas |
| `text-negative` | `#b42318` | `#ff7b72` | Negative deltas and error-like feedback |
| `--color-math-accent` | `rgb(155 63 91)` | `rgb(242 154 179)` | Highlighted terms inside rendered equations |

These are semantic roles, not general-purpose green, red, or pink palette entries. Do not use `positive` and `negative` as the sole way to communicate a state; retain text or icon cues such as `+`, `−`, or a checkmark.

---

## Typography

| Tailwind class | Font | Usage |
| --- | --- | --- |
| `font-sans` | IBM Plex Sans | Body and UI text |
| `font-display` | PP Neue Montreal | Headings and display text |
| `font-mono` | Fira Code | Code and technical content |

The body uses `font-sans` by default. Headings use `font-display`, and markdown content uses the sans-serif base with a wider line height.

---

## Common Patterns

### Links

```tsx
<a className="text-foreground-subtle transition-colors hover:text-accent">
  Link text
</a>
```

Prose links are accent-colored and underlined by default. Hover keeps the
underline while reinforcing the same accessible accent color.

### Interactive Cards

```tsx
<Link href="/post" className="group block">
  <h3 className="text-foreground group-hover:text-accent">Title</h3>
  <p className="text-foreground-muted">Description</p>
  <span className="text-foreground-subtle">Date</span>
</Link>
```

### Surfaces

```tsx
<div className="border border-divider bg-background-elevated shadow-lg">
  Popover
</div>
<pre className="bg-background-soft">Code</pre>
```

---

## Prose and MDX

Use the Tailwind Typography plugin for article content:

```tsx
<div className="prose prose-neutral dark:prose-invert">
  <Post />
</div>
```

`app/globals.css` maps all Typography plugin colors to the semantic tokens. The KaTeX `\accent{}` macro resolves through `--color-math-accent` instead of embedding theme-specific colors in the renderer.

---

## Theme Modes

The theme toggle offers `System`, `Light`, and `Dark`:

- `System` follows `prefers-color-scheme`.
- Explicit choices are stored under `theme-preference` in `localStorage`.
- `data-theme` on `<html>` contains the effective theme.
- `data-theme-choice` contains the user's selected preference.
- The initialization script in `app/layout.tsx` applies the theme before hydration.

Components use the same semantic color class in both themes. Reserve Tailwind's `dark:` variant for genuine layout or non-token differences, not for choosing another palette shade.

---

## File Reference

- `app/globals.css` — Semantic color foundations, Tailwind aliases, and prose mappings
- `app/components/ThemeToggle.tsx` — Theme menu and persisted preference
- `app/layout.tsx` — Theme initialization and font loading
- `mdx-components.tsx` — KaTeX integration and the math accent macro
