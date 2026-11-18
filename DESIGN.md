# DESIGN.md: Blog Details Page

Design system for the eParivartan blog article page. Use it to build any new article or similar editorial page so it matches the existing pattern. The theme is **light only**. Do not add dark mode.

Reference file: `blog-details.html` (single file, vanilla HTML, CSS and JS).

---

## 1. Principles

- Quiet interface, the content carries the page: white cards on a light grey ground, one accent colour.
- Editorial and airy: generous padding, a comfortable reading measure and a consistent vertical rhythm.
- Soft shapes: 3–8px radii, almost no shadows. Depth comes from white on grey.
- Navigation stays visible: the Sections menu is sticky for the whole article.

---

## 2. Design tokens

Define these on `:root` and always reference the variables, never raw hex.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Page background (pure white) |
| `--card` | `#ffffff` | Surfaces, fills |
| `--ink` | `#14151a` | Headings, strong text |
| `--body` | `#454854` | Body copy |
| `--meta` | `#767a88` | Meta row, secondary text |
| `--line` | `#e6e8ef` | Dividers, borders |
| `--soft` | `#f4f5fa` | Pull-quote background, active TOC fill |
| `--accent` | `#85BD56` | Active menu indicator, focus ring, logo green |
| `--accent-text` | `#75BF46` | Active menu text, hover |
| `--accent-bg` | `rgba(133, 189, 86, 0.1)` | Active menu item soft background |
| `--pink` | `#d9487d` | Category badge |
| `--amber` | `#e0a43a` | Category colour (spare) |
| `--blue` | `#4a9be0` | Category colour (spare) |
| `--orange` | `#e06a3f` | Category colour (spare) |
| `--teal` | `#2fa5b8` | Hero background |

Set `color-scheme: light` on `:root`.

---

## 3. Typography

Fonts: **Satoshi** (300, 400, 500, 700, 900) and **Inter** (sans-serif fallback stack `Satoshi, 'Inter', sans-serif`), matching the rest of the eParivartan website.

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| H1 | Satoshi | `clamp(28px, 3.8vw, 42px)` | 500 | line-height 1.25 |
| H3 (section heading) | Satoshi | 20px | 700 | margin `32px 0 12px` |
| Body | Satoshi | 17px | 400 | line-height 29.75px, colour rgb(20, 21, 26) |
| Lead paragraph | Satoshi | 17px | 400 | line-height 29.75px, colour rgb(20, 21, 26) |
| Pull-quote | Satoshi | 16px | 500 (italic) | line-height 1.7, colour `--ink` |
| Meta row | Satoshi | 12px | 500 | colour `--meta` |
| Category badge | Satoshi | 10px | 700 | uppercase, letter-spacing .06em |
| Menu title | Satoshi | 17px | 700 | |
| Menu link | Satoshi | 14px | 500 (600 active) | line-height 1.5 |
| Content link | Satoshi | 17px | 500 | colour `#599632`, underline offset 3.5px, visited remains `#599632` |
| Signature | Satoshi | 20px (16px subtitle) | 600 (400 subtitle) | line-height 1.4 / 1.5 |

Keep body line length under about 80 characters. The main column is already within that range.

---

## 4. Layout

- Container: `max-width: 1320px`, centred, matching the rest of the site sections (`.blogs-insights-container` and `.cta-container`).
- Grid: `grid-template-columns: minmax(0, 1fr) 280px; gap: clamp(32px, 4vw, 56px); align-items: start`.
- Left: article content (clean, sitting directly on pure white background). Right: `<aside>` holding the Sections sticky menu.
- **Sticky sidebar:** the sticky rule lives on `aside`, not on the card inside it:

```css
aside{position:sticky;top:calc(env(safe-area-inset-top,0px) + 120px);align-self:start}
```

- Below 900px: one column, `aside{position:static}`, and the menu drops below the article.

---

## 5. Components

### Card
Seamless white background; no card border or outer grey container box. Content flows naturally on the white page ground.

### Category badge
Logo green pill (`var(--accent)`, `#85BD56`), white text, 4px radius, `padding: 6px 12px`, uppercase 11px Satoshi bold.

### Meta row
Flex row with 12px text. Items are separated by a 1px `--line` left border and 12px padding. Order: avatar and "By {name}", date, read time. The avatar is a 22px circle in `--accent` with white initials.

### Hero
`aspect-ratio: 16/8.5`, 8px radius, teal background. A light-and-navy strip sits on the left, a crimson circle sits on the right, and a white Poppins statement is overlaid bottom-left. Swap in a real photo when one exists (rounded 8px, same ratio).

### Pull-quote
`--soft` background, 4px radius, `padding: 28px 32px`, italic text. A large decorative `”` (150px Poppins, `--meta`, opacity .22) is positioned top-right. Use it for one memorable line per article.

### Tile grid
Two columns, 14px gap, 380px high. One tall tile spans both rows and two tiles stack beside it. Each tile has an 8px radius, a gradient fill, a white 17px/600 title and a 12px caption bottom-left. It collapses to one column on mobile.

### Sections menu (sticky sidebar)
- A `<nav class="card toc" aria-label="Sections">` containing an `<ol>` of in-page links.
- The list has a 2px `--line` left rule. The active link gets a 2px `--accent` left border, `--accent` text and weight 600.
- Each link points to a heading `id` on the article (`#intro`, `#redesign`, …).
- A scroll-spy script sets `aria-current="true"` on the link of the last heading whose top is within 140px of the viewport top.

### Signature
Italic name after a 1px `--line` top border, with `padding-top: 20px`.

---

## 6. Interaction and motion

- Smooth anchor scrolling is on, and it is switched off under `prefers-reduced-motion: reduce`.
- Headings use `scroll-margin-top: 24px` so jumps don't hide them.
- Hover on menu links changes the colour to `--accent`. No other decorative motion.

---

## 7. Accessibility

- Visible keyboard focus: `outline: 2px solid var(--accent); outline-offset: 2px`.
- Landmarks: `<main>`, `<aside>`, `<nav aria-label="Sections">`, `<article>`.
- Active menu state is exposed through `aria-current`.
- `--meta` (#767a88) is the lightest text colour, so don't go lighter.
- Hero uses `role="img"` with an `aria-label`.

---

## 8. Using the pattern for a new article

1. Copy `blog-details.html`.
2. Update the `<title>`, badge, H1, author, date and read time.
3. Replace the article body. Use a lead paragraph, then `<h3 id="…">` sections.
4. Replace the `.toc` list with one link per `h3` and make each `href` match its `id`. The first item targets the lead paragraph (`id="intro"`).
5. Optionally add one `<blockquote>` and one `.grid` of tiles.
6. Don't add new colours: use the tokens above.

### Do
- Use `--card` on `--bg` for every surface.
- Keep one accent colour (`--accent`).
- Use sentence-style headings that name the section.

### Don't
- Add dark mode, extra shadows or gradients outside the hero and tiles.
- Add sidebar widgets. The sidebar holds the Sections menu only.
- Use remote images or scripts other than Google Fonts if the page will be published as an artifact.

---

## 9. Starter CSS

```css
:root{
  --bg:#f6f7fb;--card:#fff;--ink:#14151a;--body:#454854;--meta:#767a88;
  --line:#e6e8ef;--soft:#f4f5fa;--accent:#3b4bff;--pink:#d9487d;--teal:#2fa5b8;
  color-scheme:light;
}
body{margin:0;background:var(--bg);color:var(--body);font:400 15px/1.75 Roboto,system-ui,sans-serif}
h1,h2,h3,h4{font-family:Poppins,system-ui,sans-serif;color:var(--ink)}
.wrap{max-width:1180px;margin:0 auto;padding:24px 16px;display:grid;
  grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
.card{background:var(--card);border-radius:8px;padding:28px}
aside{position:sticky;top:calc(env(safe-area-inset-top,0px) + 24px);align-self:start}
@media (max-width:900px){.wrap{grid-template-columns:1fr}aside{position:static}}
```
