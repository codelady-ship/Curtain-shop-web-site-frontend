# PERDE Frontend

React + Vite frontend for Perde.az with public pages and admin panel.

## Key updates in this package

- Admin login recovery form added: admin name, email, phone, reset channel, reset code and new password.
- Admin settings page updated: admin name, email, phone and latest reset code are managed from the panel.
- Campaign/advertisement lead form phone validation was corrected to accept Azerbaijani formats such as `0505224433`, `050 522 44 33`, `994505224433` and `+994505224433`.
- Vite build warning noise from known third-party annotations and large chunks was reduced through production build config.

## Build

```bash
npm install
npm run build
```

## Environment variables

Copy `.env.example`. Vite only reads variables that start with `VITE_`, at build time.

| Variable | Used for | Production value |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Axios base URL (`/api` is appended if missing). Unset = `/api`, proxied to `http://127.0.0.1:8080` by `npm start`. | `https://curtain-shop-api.onrender.com` |
| `VITE_BACKEND_ORIGIN` | Absolute URLs for images the API serves under `/uploads/...` | `https://curtain-shop-api.onrender.com` |
| `VITE_DEMO_FALLBACK` | `true` only in the GitHub Pages demo build (`.env.pages`). Lets public product pages show `src/store/productData.json` when the API cannot be reached. Never set it for the real site. | unset |

Which env file each command reads:

- `npm run build` (mode `production`): `.env`, `.env.local`, `.env.production`, `.env.production.local`
- `npm run build:pages` (mode `pages`): `.env`, `.env.local`, `.env.pages`, `.env.pages.local`

`*.local` files are git-ignored; put real URLs there.

## Deploy

The API is deployed separately (Spring Boot on Render + PostgreSQL on Neon); see "Deploy (Render + Neon)" in the backend repo `codelady-ship/Curtain-shop-web-site-backend`. Its CORS default already allows `https://codelady-ship.github.io` and `https://perde.az`.

### Real site build

```bash
# .env.production.local
VITE_API_BASE_URL=https://curtain-shop-api.onrender.com
VITE_BACKEND_ORIGIN=https://curtain-shop-api.onrender.com
```

```bash
npm ci
npm run build      # dist/ for nginx (nginx.conf) or any static host; no demo fallback
```

### GitHub Pages (https://codelady-ship.github.io/Curtain-shop-web-site-frontend/)

```bash
# .env.pages.local  (leave it out to get the products-only demo with no backend)
VITE_API_BASE_URL=https://curtain-shop-api.onrender.com
VITE_BACKEND_ORIGIN=https://curtain-shop-api.onrender.com
```

```bash
npm ci
npm run build:pages   # base /Curtain-shop-web-site-frontend/, copies index.html to 404.html for SPA routes
npx gh-pages -d dist  # publish dist/ to the gh-pages branch
```

With the API URL set, the Pages site shows the real data and only falls back to the demo products if the API cannot be reached at all (network error or a non-JSON reply). The first request after the free Render service has slept can take up to about a minute.
