import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { extractList, fetchProducts, normalizeProduct } from "../utils/services";
import { getLang, localized, t } from "../utils/i18n";

const priceOf = (p: any) => Number(p?.sizeOptions?.[0]?.price ?? p?.price ?? 0);
const oldPriceOf = (p: any) => Number(p?.sizeOptions?.[0]?.oldPrice ?? p?.oldPrice ?? 0);
const createdTime = (p: any) => {
  const raw = p?.createdAt || p?.updatedAt || p?.createdDate || p?.date;
  const parsed = raw ? Date.parse(raw) : Number.NaN;
  if (Number.isFinite(parsed)) return parsed;
  return Number(p?.id || 0);
};

const PAGE_SIZE = 4;

const DiscountedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [lang, setLang] = useState(getLang());
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(extractList(res.data).map(normalizeProduct)))
      .catch(() => setProducts([]));
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  const discounted = useMemo(() => {
    return products
      .filter((p) => Boolean(p.isDiscount) || oldPriceOf(p) > priceOf(p) || Number(p.discountPercent || 0) > 0)
      .sort((a, b) => createdTime(b) - createdTime(a))
      .map((p) => ({ ...p, name: localized(p, "name", lang, p.name), description: localized(p, "description", lang, p.description) }));
  }, [products, lang]);

  useEffect(() => {
    setPage(1);
  }, [discounted.length]);

  if (!discounted.length) return null;

  const totalPages = Math.max(1, Math.ceil(discounted.length / PAGE_SIZE));
  const paged = discounted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section id="discounts" className="bg-white py-12 dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col items-center justify-center gap-4 text-center">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-slate-900 dark:text-white md:text-5xl">{t("discounts", lang)}</h2>
            <div className="mx-auto mt-4 h-[2px] w-16 rounded-full bg-[#C5A059]" />
          </div>
          <a href="#shop" className="rounded-2xl bg-black px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#C5A059] hover:text-black dark:bg-white dark:text-black">
            {t("viewCatalog", lang)}
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paged.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  );
};

export default DiscountedProducts;
