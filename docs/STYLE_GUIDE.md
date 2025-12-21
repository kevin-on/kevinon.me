# Style Guide

This style guide documents the design tokens and conventions used in this website. The design system is inspired by [VitePress's default theme](https://vitepress.dev/guide/extending-default-theme) and implemented with Tailwind CSS v4.

All tokens are defined in `app/globals.css` and automatically adapt to light/dark mode via `prefers-color-scheme`.

---

## Color Tokens

### Text Colors

Use semantic text colors instead of hardcoded values like `text-gray-500`.

| Tailwind Class | CSS Variable | Usage |
|----------------|--------------|-------|
| `text-foreground` | `--color-foreground` | Primary text (headings, body copy) |
| `text-foreground-2` | `--color-foreground-2` | Secondary text (descriptions, paragraphs) |
| `text-foreground-3` | `--color-foreground-3` | Tertiary text (dates, captions, muted labels) |

**Light Mode Values:**
- `foreground`: `rgba(60, 60, 67)` — near black
- `foreground-2`: `rgba(60, 60, 67, 0.78)` — 78% opacity
- `foreground-3`: `rgba(60, 60, 67, 0.56)` — 56% opacity

**Dark Mode Values:**
- `foreground`: `rgba(255, 255, 245, 0.86)` — warm white
- `foreground-2`: `rgba(235, 235, 245, 0.6)` — 60% opacity
- `foreground-3`: `rgba(235, 235, 245, 0.38)` — 38% opacity

**Examples:**
```tsx
<h1 className="text-foreground">Main Heading</h1>
<p className="text-foreground-2">Description paragraph</p>
<span className="text-foreground-3">Published on Jan 1, 2025</span>
```

---

### Brand Colors

Use brand colors for interactive elements like links and buttons.

| Tailwind Class | CSS Variable | Usage |
|----------------|--------------|-------|
| `text-brand` | `--color-brand` | Primary brand color (links, active states) |
| `text-brand-2` | `--color-brand-2` | Hover state for brand elements |
| `text-brand-3` | `--color-brand-3` | Pressed/active state |
| `bg-brand-soft` | `--color-brand-soft` | Soft background highlight |

**Values:**
- `brand`: `#646cff` — purple-blue
- `brand-2`: `#747bff` — lighter purple-blue (hover)
- `brand-3`: `#535bf2` — darker purple-blue (active)
- `brand-soft`: `rgba(100, 108, 255, 0.14)` — subtle highlight

**Examples:**
```tsx
// Link with hover effect
<a className="text-foreground-3 hover:text-brand">GitHub</a>

// Interactive heading
<h3 className="group-hover:text-brand">Post Title</h3>

// Highlighted badge
<span className="bg-brand-soft text-brand px-2 py-1 rounded">New</span>
```

---

### Background Colors

| Tailwind Class | CSS Variable | Usage |
|----------------|--------------|-------|
| `bg-background` | `--color-background` | Main page background |
| `bg-background-alt` | `--color-background-alt` | Alternate sections, sidebar |
| `bg-background-elv` | `--color-background-elv` | Elevated surfaces (modals, dropdowns, tooltips) |
| `bg-background-soft` | `--color-background-soft` | Subtle highlights, code blocks |

**Light Mode Values:**
- `background`: `#ffffff`
- `background-alt`: `#f6f6f7`
- `background-elv`: `#ffffff`
- `background-soft`: `#f6f6f7`

**Dark Mode Values:**
- `background`: `#1b1b1f`
- `background-alt`: `#161618`
- `background-elv`: `#202127`
- `background-soft`: `#202127`

**Examples:**
```tsx
// Alternate background section
<section className="bg-background-alt py-8">...</section>

// Modal/dropdown
<div className="bg-background-elv shadow-lg rounded-lg">...</div>

// Code block background
<pre className="bg-background-soft p-4 rounded">...</pre>
```

---

### Divider Color

| Tailwind Class | CSS Variable | Usage |
|----------------|--------------|-------|
| `border-divider` | `--color-divider` | Borders, separators, horizontal rules |

**Examples:**
```tsx
<div className="border-b border-divider pb-4">...</div>
<hr className="border-divider" />
```

---

## Typography

### Font Families

| Tailwind Class | Font | Usage |
|----------------|------|-------|
| `font-sans` | Inter | All UI text (default) |
| `font-mono` | System monospace | Code, technical content |

The body uses `font-sans` by default (set in `globals.css`).

**Example:**
```tsx
<code className="font-mono text-sm">const x = 1</code>
```

---

## Common Patterns

### Links

Standard link pattern with muted default and brand hover:

```tsx
<a className="text-foreground-3 hover:text-brand">Link Text</a>
```

### Interactive Cards/List Items

Use group hover for parent-child hover effects:

```tsx
<Link href="/post" className="block group">
  <h3 className="text-foreground group-hover:text-brand">Title</h3>
  <p className="text-foreground-2">Description</p>
  <span className="text-foreground-3">Date</span>
</Link>
```

### Metadata/Captions

Use `text-foreground-3` with `text-sm`:

```tsx
<p className="text-sm text-foreground-3">January 1, 2025</p>
```

### Section Headers

```tsx
<h2 className="text-xl font-bold text-foreground">Section Title</h2>
```

---

## Prose/Article Content

For markdown/MDX content, use the Tailwind Typography plugin:

```tsx
<div className="prose prose-neutral dark:prose-invert">
  <Post />
</div>
```

The prose styles inherit VitePress colors via CSS variable overrides in `globals.css`.

---

## Quick Reference

### Do ✅

```tsx
// Use semantic color tokens
<p className="text-foreground-2">Description</p>
<a className="text-foreground-3 hover:text-brand">Link</a>
<div className="bg-background-soft">Highlighted area</div>
<div className="border-b border-divider">Separated section</div>
```

### Don't ❌

```tsx
// Avoid hardcoded gray values
<p className="text-gray-600">Description</p>
<a className="text-gray-500 hover:text-blue-500">Link</a>
<div className="bg-gray-100">Highlighted area</div>
<div className="border-b border-gray-200">Separated section</div>
```

---

## Dark Mode

Dark mode is automatic via `prefers-color-scheme: dark`. All color tokens switch values automatically — no manual dark mode classes required.

If explicit dark mode overrides are needed, use Tailwind's dark variant:

```tsx
<div className="bg-background dark:bg-background-alt">...</div>
```

---

## File Reference

- **`app/globals.css`** — All CSS variables and Tailwind theme tokens
- **`app/layout.tsx`** — Font loading (Inter, Fira Code)

