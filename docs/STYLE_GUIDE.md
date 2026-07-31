# Style Guide

This guide defines the site's styling contract. The system takes its semantic-token and article-content approach from the VitePress default theme, while preserving this site's warmer canvas, typography, and brand colors.

The comparison baseline is the live [VitePress “What is VitePress?” page](https://vitepress.dev/guide/what-is-vitepress) and default theme at `2.0.0-alpha.18`, reviewed on July 13, 2026. Match its role-based styling principles rather than copying its complete palette or page layout.

First-party page colors are defined once in `app/globals.css` with `light-dark()`, exposed to Tailwind CSS v4, and selected by `color-scheme`. Components should not need a `dark:` color override. The cross-origin Giscus iframe is the documented exception and has mirrored theme files under `public/giscus/`.

The `docs` directory is excluded from Tailwind source detection, so class names in documentation examples do not generate production utilities.

---

## Color Tokens

Use semantic roles instead of palette utilities such as `text-gray-500`, `text-blue-600`, or `border-zinc-700`.

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

All three text levels meet WCAG AA contrast for normal text on the current page surfaces. Prefer the strongest level that matches the hierarchy; do not lower opacity locally to create another text tier.

### Accent and Interaction

The accent family separates a persistent brand state from transient interaction states.

| Tailwind class | Light | Dark | Usage |
| --- | --- | --- | --- |
| `text-accent` / `bg-accent` | `#205ea6` | `#747bff` | Links at rest, active items, selected icons, compact selected controls |
| `text-accent-hover` | `#174f91` | `#a8b1ff` | Hovered or keyboard-focused interactive text |
| `bg-accent-soft` | `rgba(32, 94, 166, 0.12)` | `rgba(116, 123, 255, 0.16)` | Selected rows and quiet brand-tinted surfaces |
| `outline-accent` | `#205ea6` | `#747bff` | Keyboard focus rings |

`accent` has a contrast ratio of `6.33:1` in light mode and `4.92:1` in dark mode on the page background. `accent-hover` increases that contrast to `7.93:1` and `8.50:1`, respectively.

Interaction states follow these rules:

| Element | Rest | Hover | Keyboard focus | Selected/current |
| --- | --- | --- | --- | --- |
| Prose link | Accent + underline | `accent-hover` + underline | Accent + visible accent outline | N/A |
| Muted UI link | Muted or subtle text | `accent-hover` | `accent-hover` + visible accent outline | Accent when applicable |
| Utility icon/control | `border` on the page canvas + subtle text | Soft surface + `accent-hover` text | Visible accent outline | Soft surface + foreground text |
| Local table-of-contents link | Subtle text | Muted text | Visible accent outline | Accent text |

Never remove focus outlines without supplying an equally visible replacement. Color must not be the only state cue for focus or selection.

```tsx
<a className="text-foreground-subtle transition-colors hover:text-accent-hover focus-visible:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
  GitHub
</a>
```

### Surfaces and Boundaries

VitePress distinguishes several surface levels. This site keeps page, recessed, and soft roles with its own warm/cool palette, while borders and shadows provide elevation when needed.

| Tailwind class | CSS variable | Usage |
| --- | --- | --- |
| `bg-background` | `--color-background` | Main page canvas |
| `bg-background-alt` | `--color-background-alt` | Recessed regions and code blocks |
| `bg-background-soft` | `--color-background-soft` | Hover states, selected-neutral rows, and table zebra rows |
| `border-divider` | `--color-divider` | Section separators, table rules, and quiet structural lines |
| `border-border` | `--color-border` | Stronger quiet outlines for controls and inline code |

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#fefbf5` | `#1b1b1f` |
| `background-alt` | `#f8f3ea` | `#161618` |
| `background-soft` | `#f5efe5` | `#202127` |
| `divider` | `#e5dcce` | `rgba(82, 82, 89, 0.32)` |
| `border` | `#cfc3b2` | `#3c3f44` |

Use `divider` for separation and `border` when a shape needs more definition. `border` is deliberately quiet and is not a standalone 3:1 state cue; pair it with a clear icon, fill, shadow, or focus outline when the boundary is essential.

```tsx
<div className="border border-border bg-background shadow-lg">
  Popover
</div>
<pre className="bg-background-alt">Code</pre>
```

### Status and Content Accents

| Tailwind class / variable | Light | Dark | Usage |
| --- | --- | --- | --- |
| `text-positive` | `#16794b` | `#5fca8c` | Success feedback and positive deltas |
| `text-negative` | `#b42318` | `#ff7b72` | Negative deltas and error-like feedback |
| `--color-math-accent` | `rgb(155 63 91)` | `rgb(242 154 179)` | Highlighted terms inside rendered equations |

These are semantic roles, not general-purpose green, red, or pink palette entries. Retain text or icon cues such as `+`, `−`, or a checkmark. Add status-specific soft or border tokens only when a real component requires them.

---

## Typography

| Tailwind class | Font | Usage |
| --- | --- | --- |
| `font-sans` | IBM Plex Sans | Body and UI text |
| `font-display` | PP Neue Montreal | Headings and display text |
| `font-mono` | Fira Code | Code and technical content |

Loaded PP Neue Montreal upright weights are `100`, `400`, `500`, and `700`. Use `700` for H1/H2 and `500` for H3–H6; do not request an upright `600`, which would be synthesized by the browser. Strong text inside headings inherits the heading weight. IBM Plex Sans includes `400`, `500`, `600`, and `700`, so `font-semibold` is valid for body/UI labels.

---

## Prose and MDX

`prose` is the Tailwind Typography scope applied to rendered MDX. It supplies the baseline element selectors; `app/globals.css` owns this site's colors, spacing, and element presentation.

```tsx
<div className="prose max-w-none">
  <Post />
</div>
```

Do not add `prose-neutral dark:prose-invert`. Both modes already resolve through the same semantic variables, so the extra palette and inversion classes are redundant.

Wrap embedded UI that must opt out of article element styling in `not-prose`; all site-owned prose selectors honor that boundary.

### Article Element Rules

| Element | Site rule |
| --- | --- |
| Body | `17px` base size, `1.7` line height, IBM Plex Sans |
| H1 | `30px/36px`, weight `700` |
| H2 | `24px/32px`, weight `700`, top divider, generous section spacing |
| H3 | `20px/28px`, weight `500` |
| H4 | `18px/24px`, weight `500` |
| H5 | `17px/24px`, weight `500` |
| H6 | `16px/24px`, weight `500`, muted text |
| Paragraph | `0.9em` block margins |
| Link | Accent and underline; distinct hover color; visible focus outline |
| Blockquote | Muted upright text with a `2px` divider rail; no decorative quote marks |
| Inline code | Mono text on a subtle fill with a quiet `border` |
| Code block | Focusable recessed `background-alt`, `8px` radius, horizontal overflow |
| Table | Semantic table inside a labelled focusable scroll container; bordered cells, soft header and zebra rows |
| Lists | `1rem` block rhythm, no extra item inset, compact nested and loose-item spacing |
| Media | `1rem` vertical rhythm |

The KaTeX `\accent{}` macro resolves through `--color-math-accent` instead of embedding theme-specific colors in the renderer.

Code fences currently render as uniformly colored code blocks. Syntax highlighting and a copy button require a separate renderer/component change and are not part of this styling layer.

---

## Common Patterns

### Interactive Cards

```tsx
<Link
  href="/post"
  className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-accent"
>
  <h3 className="text-foreground transition-colors group-hover:text-accent-hover group-focus-visible:text-accent-hover">
    Title
  </h3>
  <p className="text-foreground-muted">Description</p>
  <span className="text-foreground-subtle">Date</span>
</Link>
```

### Selected Menu Row

```tsx
<button
  aria-pressed="true"
  className="bg-accent-soft text-foreground focus-visible:outline-2 focus-visible:outline-accent"
>
  <CheckIcon className="text-accent" />
  System
</button>
```

---

## VitePress Alignment

Aligned behaviors:

- Semantic foreground, background, divider, border, brand, hover, and soft-surface roles.
- A distinct link hover color and visible keyboard focus treatment.
- Recessed code surfaces, explicit article heading rhythm, technical blockquotes, and structured tables.
- Light and dark themes resolved through role tokens rather than component-level palette swaps.

Intentional differences:

- The site keeps its warm paper-like light background and existing blue/purple accent identity.
- PP Neue Montreal and IBM Plex Sans replace VitePress's Inter-first font stack.
- Article text is slightly larger and the reading column remains blog-oriented.
- The full VitePress palette is not copied. New tokens are added only when a component has a concrete semantic need.
- Syntax highlighting, code-group chrome, custom containers, and copy controls are renderer/component features and remain separate follow-up work.

---

## Theme Modes

The theme toggle offers `System`, `Light`, and `Dark`:

- `System` follows `prefers-color-scheme`.
- Explicit choices are stored under `theme-preference` in `localStorage`.
- `data-theme` on `<html>` contains the effective theme.
- `data-theme-choice` contains the user's selected preference.
- The initialization script in `app/layout.tsx` applies the theme before hydration.

Reserve Tailwind's `dark:` variant for genuine layout or non-token differences, not for selecting another palette shade.

### Embedded Giscus Theme

Giscus renders in a cross-origin iframe and cannot consume `app/globals.css`. `public/giscus/light.css` and `public/giscus/dark.css` therefore mirror relevant page, text, accent, surface, and boundary roles manually while retaining GitHub-specific syntax and status roles. Review both files whenever a foundation token changes; exact control colors may differ where Giscus needs a distinct accessible foreground/background pair.

---

## File Reference

- `app/globals.css` — Semantic color foundations, Tailwind aliases, and prose styling
- `app/components/ThemeToggle.tsx` — Theme menu and persisted preference
- `app/layout.tsx` — Theme initialization and font loading
- `app/blog/[slug]/page.tsx` — Article prose scope
- `mdx-components.tsx` — KaTeX integration and the math accent macro
- `content/markdown-test.mdx` — Visual regression fixture for article elements
- `public/giscus/light.css`, `public/giscus/dark.css` — Mirrored iframe themes
