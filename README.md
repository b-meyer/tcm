# TCM Primer

A reader for a Traditional Chinese Medicine primer — fourteen cross-linked topic essays plus a navigation home page, rendered as a single-page app.

VitePress-style chrome (sidebar nav, scroll-spy outline, prev/next, Cmd+K search) built directly on Vite + Vue 3 — no VitePress, no static-site generator.

## Stack

- **Build:** Vite+ (Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt under the `vp` CLI)
- **Framework:** Vue 3 + Vue Router (manual route map; no file-based routing plugin)
- **Markdown:** `unplugin-vue-markdown` transforms `.md` files into Vue SFCs at build time
- **Markdown extras:** `markdown-it-anchor` (heading IDs), a custom kebab-case slugifier (`src/scripts/utils.ts`), a cross-link rewriter for `.md` → `/Route` and a `<div class="table-wrap">` wrapper for prose tables (`src/scripts/markdown.ts`)
- **Search:** `fuzzysort` + a Reka UI dialog, opened via the header button or `⌘K` / `Ctrl+K`
- **Styles:** Tailwind 4 + `@tailwindcss/typography`. Theme tokens (primary + gray + black + white + transparent) live in `src/styles/main.css`
- **Runtime:** TypeScript 6, Node 22.12+, pnpm 11

## Getting started

```bash
vp install        # install dependencies
vp dev            # dev server (HMR on .md changes)
vp build          # production build (15 code-split route chunks)
vp check          # format + lint + type check
vp check --fix    # apply formatter fixes
```

## Project layout

```
src/
  components/
    App.vue            root: skip-link + AppHeader + RouterView + AppFooter + SearchModal
    AppHeader.vue      sticky top bar: brand, mobile-nav Dialog trigger, SearchTrigger
    AppFooter.vue
    PageLayout.vue     auto-injected per page: 3-column grid (sidebar | prose+inline prev/next | outline); provides the article ref to PageNav
    AppNav.vue
    PageNav.vue        right-side TOC with IntersectionObserver scroll-spy (injects the article ref)
    SearchModal.vue    Cmd+K dialog (Reka DialogRoot/Portal/Overlay/Content)
    SearchTrigger.vue  header search button with ⌘K / Ctrl K hint
  pages/               Markdown content, one file per route
    index.md           home (table of contents + Three Treasures + Five Branches + pinyin glossary + 5-vs-6 Zang reconciliation)
    YinYang.md, WuXing.md, Qi.md, ... (14 topics)
    NotFound.md        rendered by the catch-all route (`/:pathMatch(.*)*`); not in the sidebar
  scripts/
    main.ts            Vite entry — registers PageLayout globally, mounts app to #app
    router.ts          routes + sidebar manifest + nav helpers (single source of truth)
    search.ts          fuzzysort index + useSearch() composable (Cmd+K UI state, module-scoped singleton, returns refs)
    markdown.ts        mdLinkRewriter (.md → SPA route) + mdTableWrapper (.table-wrap div)
    utils.ts           slugify (shared by markdown-it-anchor, the link rewriter, and the search index) + prefersReducedMotion
  styles/
    main.css           entry: imports tailwindcss + @plugin '@tailwindcss/typography' + the three split files below
    theme.css          @theme color tokens (`--color-*: initial` palette wipe + custom primary/gray/red/orange/.../magenta scales)
    components.css     rules assigned to the components layer via `@import './components.css' layer(components)` in main.css (e.g. `.prose .table-wrap`)
    utilities.css      @utility nav-link / outline-link / eyebrow
shims.d.ts             TS shims for *.vue and *.md modules (repo root, included via tsconfig)
```

## How content is wired

1. **Markdown files** live in `src/pages/*.md` — one file per route. Filename (Pinyin PascalCase) is the URL slug: `YinYang.md` → `/YinYang`. The home page is `index.md` → `/`.
2. **`src/scripts/router.ts`** is the single source of truth for which pages exist and how they're grouped. The exported `sidebar` array maps slug → title in canonical reading order. Routes are derived from `flatOrder` via `import.meta.glob('../pages/*.md')`.
3. **Cross-links** between `.md` files use the natural form `[Display](OtherFile.md)`. At build time, `mdLinkRewriter` (in `src/scripts/markdown.ts`) rewrites them to SPA routes (`/OtherFile`). Hashes are preserved: `[Display](OtherFile.md#sub-heading)` → `/OtherFile#sub-heading`. As a special case, `index.md` rewrites to `/` (not `/index`) so links to home-page anchors work.
4. **Every page** is auto-wrapped in `PageLayout` (configured in `vite.config.ts` via `Markdown({ wrapperComponent: 'PageLayout' })`). The layout supplies sidebar nav, the prose container, the right-side outline, and an inline prev/next nav below the article.
5. **Heading IDs** are kebab-cased by the shared `slugify` helper in `src/scripts/utils.ts` so URL fragments are predictable: `## Reading the Taijitu` → `id="reading-the-taijitu"`. The search index uses the same function, guaranteeing that result links land on the right anchor.
6. **Search.** All search logic lives in `src/scripts/search.ts`. On module load it parses every page's raw markdown into one entry per H1/H2/H3 section, strips to plaintext, and pre-prepares the heading + body strings for `fuzzysort`. The same file owns the modal's open / query / selectedIndex state and exposes a `results` computed (body matches are penalized so heading hits rank first) via `useSearch()`. `SearchModal.vue` (Reka `DialogRoot`) is mounted globally in `App.vue`; the `⌘K` / `Ctrl+K` shortcut is bound on `window` from there.

## Adding a new topic

1. Create `src/pages/NewTopic.md` starting with `# Title` (the H1).
2. Add an entry to the appropriate group in `src/scripts/router.ts`:
   ```ts
   { slug: 'NewTopic', title: 'Display Title' },
   ```
3. Cross-link to/from existing files with `[X](NewTopic.md)`.

Route, sidebar entry, page outline, prev/next, and search index are picked up automatically. A `.md` file without a sidebar entry won't get a route.

## Authoring conventions

- **Filenames:** Pinyin PascalCase (`YinYang.md`, not `yin-yang.md`). The filename is the URL slug verbatim.
- **Cross-links:** always use the `[Display](File.md)` form. Never hardcode `/File` in source markdown — the rewriter is what makes it refactor-safe. For links to the home page, use `[Display](index.md)` or `[Display](index.md#anchor)`.
- **Headings:** first line is the page's `# H1`. The right-side outline shows `h2` and `h3` only.
- **No frontmatter required.** Titles come from the sidebar manifest; the on-page H1 stands alone.
- **No code highlighting wired up** (Shiki etc.) — the TCM content has none.
