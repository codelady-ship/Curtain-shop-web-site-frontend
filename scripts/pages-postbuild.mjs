// Runs after `vite build --mode pages` (see package.json "build:pages").
// GitHub Pages has no SPA rewrites, so:
//  - 404.html = index.html keeps client-side routing working for unknown URLs;
//  - each route also gets its own index.html copy so it answers with HTTP 200
//    (good for crawlers and link previews), with its own canonical/og:url; and
//  - sitemap.xml lists the indexable routes with the live Pages URL.
// Route URLs end with "/" because GitHub Pages redirects /products to /products/ (it is a folder).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SITE_URL = "https://codelady-ship.github.io/Curtain-shop-web-site-frontend";
const dist = "dist";
const products = JSON.parse(readFileSync("src/store/productData.json", "utf8"));

// Indexable routes (listed in sitemap.xml) and app-only routes that just need a 200.
const routes = ["/", "/products", ...products.map((p) => `/product/${p.id}`)];
const appOnlyRoutes = ["/basket", "/admin"];
const NOINDEX = '<meta data-static-seo name="robots" content="noindex" />';

// "/" stays "/", "/products" becomes "/products/".
const pageUrl = (route) => `${SITE_URL}${route === "/" ? "/" : `${route}/`}`;

const index = join(dist, "index.html");
const html = readFileSync(index, "utf8");
copyFileSync(index, join(dist, "404.html"));

for (const route of [...routes.slice(1), ...appOnlyRoutes]) {
  const target = join(dist, route, "index.html");
  const url = pageUrl(route);
  const noindex = appOnlyRoutes.includes(route);
  mkdirSync(dirname(target), { recursive: true });
  // The React <SEO> component replaces these tags at runtime; this is for non-JS crawlers.
  let page = html
    .replace(/(<link data-static-seo rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta data-static-seo property="og:url" content=")[^"]*"/, `$1${url}"`);
  // Basket and admin: keep crawlers out even without JavaScript (React adds the same tag at runtime).
  if (noindex) page = page.replace("</head>", `    ${NOINDEX}
  </head>`);
  writeFileSync(target, page);
}

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((route) => `  <url>\n    <loc>${pageUrl(route)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join("\n");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

console.log(`pages-postbuild: 404.html, ${routes.length - 1 + appOnlyRoutes.length} route copies, sitemap.xml (${routes.length} URLs)`);
