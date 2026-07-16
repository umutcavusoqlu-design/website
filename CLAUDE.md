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
| `contact.html` | Contact form + info cards |
| `kvkk.html` | Privacy policy / KVKK disclosure |
| `kullanim-sartlari.html` | Terms of use |
| `404.html` | Not-found page |

All pages share `css/style.css` and `js/main.js`, loaded at the bottom of `<body>`.

**Note:** There is no `services.html` page currently in the project.

## Running / Previewing

Open any `.html` file directly in a browser, or serve the directory with any static server:

```
npx serve .
# or
python -m http.server 8080
```

No compilation, bundling, or installation step required.

## Architecture

### Language switcher (currently non-functional)

The header includes a TR/EN flag dropdown, but it is **visual only** — there is no `js/lang.js` file, no `data-en`/`data-tr` attributes, and no JS wired up to switch languages. All visible text is hardcoded in Turkish. If bilingual support is implemented in the future, this section should be rewritten to document the real mechanism.

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
