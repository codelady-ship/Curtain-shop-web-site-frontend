import React from "react";
import { Helmet } from "react-helmet-async";

// Public URL of the deployed site, used for canonical and Open Graph links.
// Defaults to the GitHub Pages demo; set VITE_SITE_URL when the site moves to its own domain.
const SITE_URL = String(import.meta.env.VITE_SITE_URL || "https://codelady-ship.github.io/Curtain-shop-web-site-frontend").replace(/\/+$/, "");

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

const SEO = ({
  title = "Perde.az | Pərdə, tül və jalüz kataloqu",
  description = "Perde.az — pərdə, tül, jalüz, günəşlik və aksesuar modelləri üçün onlayn kataloq: rəng və ölçü seçimi, endirimli məhsullar, səbət və sifariş müraciəti.",
  path = "/",
  image = "/og-image.jpg",
  noindex = false,
}: SEOProps) => {
  // GitHub Pages serves each route from a folder and redirects /products to /products/,
  // so the Pages build uses the trailing-slash URL (the same one sitemap.xml lists).
  const pagesPath = import.meta.env.MODE === "pages" && path !== "/" && !path.endsWith("/") ? `${path}/` : path;
  const canonical = `${SITE_URL}${pagesPath}`;
  const imageUrl = /^https?:\/\//.test(image) ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <html lang="az" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default SEO;
