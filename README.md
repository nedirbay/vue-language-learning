# NewsWire — advanced Vue 3 news app

A polished, production-quality news reader built with **Vue 3 + TypeScript**, **Element Plus**, **Tailwind CSS**, **Pinia**, and **Vue Router**.

The app ships with a rich mock data layer so it runs offline out of the box. The mock service is intentionally shaped like a real REST client so you can swap it for a live API by editing a single file (`src/services/newsApi.ts`).

## Features

- Curated home feed with featured **hero carousel**, latest grid, and a **trending** sidebar
- 8 category sections (`World`, `Business`, `Technology`, `Sports`, `Entertainment`, `Health`, `Science`, `General`)
- **Full-text search** with debounced URL-synced query parameter
- **Infinite scroll** powered by `IntersectionObserver`
- **Article reader** with author bio, related stories, share, save, and print
- **Bookmarks** persisted in `localStorage`, with filter and bulk clear
- **Settings** for theme (light / system / dark), density, font scale, image visibility, and page size
- **Dark mode** synced across Element Plus and Tailwind CSS via the `class` strategy
- Accessible, keyboard-friendly Element Plus components with auto-imported icons
- Skeleton loaders, empty states, and error messaging throughout
- Responsive layout (mobile drawer, sticky header, sticky sidebar)
- TypeScript strict mode + path aliases (`@/...`)

## Tech stack

| Concern | Library |
| --- | --- |
| Framework | Vue 3 + `<script setup>` + TypeScript |
| Build tool | Vite |
| UI components | Element Plus (auto-imported) |
| Styling | Tailwind CSS 3 + custom CSS variables for theming |
| State | Pinia |
| Routing | Vue Router (hash mode) |
| Utilities | VueUse, dayjs |
| Auto-imports | `unplugin-auto-import`, `unplugin-vue-components` |

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # type-check + production build
pnpm preview      # preview the built bundle
```

## Project structure

```
src/
├─ components/        # Header, Sidebar, ArticleCard, HeroCarousel, …
├─ composables/       # useFormatDate, useInfiniteScroll
├─ data/              # mock article fixtures
├─ layouts/           # AppLayout (shell)
├─ router/            # routes + lazy-loaded views
├─ services/          # newsApi.ts — swap this for your real backend
├─ stores/            # Pinia stores: news, bookmarks, settings
├─ styles/            # main.scss + Element Plus theme overrides
├─ types/             # Article + auto-import .d.ts files
└─ views/             # HomeView, CategoryView, SearchView, ArticleView,
                      #  BookmarksView, SettingsView, NotFoundView
```

## Swapping in a real news API

`src/services/newsApi.ts` exposes a small set of typed functions:

```ts
fetchArticles(query: ArticleQuery): Promise<PaginatedArticles>
fetchTrending(limit?: number):     Promise<Article[]>
fetchFeatured():                   Promise<Article[]>
fetchArticleBySlug(slug: string):  Promise<Article | null>
fetchRelated(article, limit?):     Promise<Article[]>
```

To switch to a real backend (e.g. NewsAPI.org, GNews, the Guardian, Spaceflight News):

1. Replace each function body with `axios.get(...)` (or `fetch`) calls.
2. Map the upstream response into the `Article` shape defined in `src/types/article.ts`.
3. Move any API key into a `VITE_NEWS_API_KEY` env variable.

The Pinia store, components, and views require no changes.

## Theming

- Brand color and shadows live as CSS custom properties in `src/styles/main.scss` (`--app-accent`, `--app-surface`, …) and are toggled by the `.dark` class on `<html>`.
- Element Plus primary / success / warning / danger / info colors are configured in `src/styles/element-vars.scss`.
- Tailwind extends the palette (`brand.*`) and the font stack (Inter + Lora) in `tailwind.config.js`.

## Settings persistence

User preferences (theme, density, font scale, image toggle, page size) and bookmarks are stored under `vue-news-app:settings:v1` and `vue-news-app:bookmarks:v1` in `localStorage`.

## License

MIT
