import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://perde.az";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

const SEO = ({
  title = "Perde.az — Pərdə, karniz və ev tekstili modelləri",
  description = "Perde.az pərdə, tül, jalüz, karniz və aksesuar modelləri üçün onlayn kataloq, endirimlər və ölçü xidməti təqdim edir.",
  path = "/",
  image = "/og-image.jpg",
}: SEOProps) => {
  const canonical = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <html lang="az" />
      <title>{title}</title>
      <meta name="description" content={description} />
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
