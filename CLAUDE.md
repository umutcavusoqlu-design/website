# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static multi-page website for **RAU Metals**, an aluminum extrusion profiles manufacturer. No build system, package manager, or framework — plain HTML, CSS, and vanilla JavaScript served directly from the filesystem or any static host.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, products grid, production process steps, certifications |
| `production.html` | Production details |
| `quality.html` | Quality & certifications |
| `about.html` | Company info |
| `services.html` | Services |
| `contact.html` | Contact form + info cards |

All pages share `css/style.css`, `js/lang.js`, and `js/main.js` loaded at the bottom of `<body>`.

## Running / Previewing

Open any `.html` file directly in a browser, or serve the directory with any static server:

```
npx serve .
# or
python -m http.server 8080
```

No compilation, bundling, or installation step required.

## Architecture

### Bilingual content system (`js/lang.js`)

All user-visible strings are duplicated in HTML as `data-en` / `data-tr` attributes. `lang.js` reads the active language from `localStorage` (key: `rau-lang`, default `en`) and sets `element.textContent` from the matching attribute on `DOMContentLoaded`. To switch languages, call `switchLang('en')` or `switchLang('tr')`.

- Add new translatable text by putting both attributes on the element: `data-en="..." data-tr="..."`.
- For strings containing HTML tags (e.g. `<br>`), also add `data-html` so `innerHTML` is used instead of `textContent`.
- Input placeholders use `data-placeholder-en` / `data-placeholder-tr` instead.

### CSS design tokens (`css/style.css`)

All colors and the global transition duration are defined as CSS custom properties at `:root`:

```css
--navy        : #0d1b2e   /* header, footer, dark sections */
--navy-light  : #162540
--orange      : #1a6fff   /* accent / CTA — named "orange" for legacy reasons but is blue */
--orange-dark : #0f58e0
--light       : #f4f6f8
--gray        : #6b7280
--border      : #e2e8f0
--text        : #1e293b
--transition  : 0.3s ease
```

Page-specific styles are written as `<style>` blocks inside each HTML file's `<head>`.

### Scroll / animation system (`js/main.js`)

Elements with the `data-animate` attribute are observed by an `IntersectionObserver` (threshold 0.15). When they enter the viewport, the class `visible` is added, which CSS transitions use to fade/slide elements in. For browsers without `IntersectionObserver`, `visible` is added immediately.

### Header behavior (`js/main.js`)

The `<header id="main-header">` gains the class `scrolled` when `window.scrollY > 50`, allowing CSS to darken it on scroll. The active nav link is highlighted by matching `window.location.pathname` against each `<a href>` in `#nav-links`.

## Conventions

- The hamburger button (`#menu-toggle`) toggles `.open` on `#nav-links` for mobile.
- Buttons use utility classes: `btn btn-blue`, `btn btn-outline`, `btn btn-outline-blue`.
- Section intros use `.section-tag` (small blue uppercase label) above `.section-title`.
- Images live in `images/`. No image optimization pipeline — add files directly.
