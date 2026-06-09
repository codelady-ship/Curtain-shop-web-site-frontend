import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import AllModels from "../components/AllModels";
import SEO from "../components/SEO";
import { getAllProducts } from "../utils/services";
import { extractList, normalizeProduct } from "../utils/productMapper";
import {
  categories,
  categoryLabel,
  getLang,
  localized,
  roomLabel,
  roomTypes,
  t,
} from "../utils/i18n";

type ShopProps = { compactHome?: boolean };

const normalizeText = (value: any) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c");

const CATEGORY_ALIASES: Record<string, string[]> = {
  Hamısı: ["Hamısı", "ALL", ""],
  "Dəst Pərdələr": [
    "Dəst pərdələr",
    "Dəst Pərdələr",
    "CURTAINS",
    "SET_CURTAINS",
  ],
  Fonluqlar: ["Fonluqlar", "BACKGROUNDS", "BACKDROPS"],
  Günəşliklər: ["Günəşliklər", "SUNSHADES"],
  Tüllər: ["Tüllər", "TULLES"],
  Jalüzlər: ["Jalüzlər", "BLINDS"],
  Kornizlər: ["Kornizlər", "CORNICES"],
  Aksesuarlar: ["Aksesuarlar", "ACCESSORIES"],
  Pastellər: ["Pastellər", "Pasteller", "PASTELS"],
};

const getPrice = (product: any) =>
  Number(product?.sizeOptions?.[0]?.price ?? product?.price ?? 0);
const getOldPrice = (product: any) =>
  Number(product?.sizeOptions?.[0]?.oldPrice ?? product?.oldPrice ?? 0);

const categoryMatches = (productCategory: any, selectedCategory: string) => {
  if (!selectedCategory || selectedCategory === "Hamısı") return true;
  const aliases = CATEGORY_ALIASES[selectedCategory] || [selectedCategory];
  const productCategoryText = normalizeText(productCategory);
  return aliases.some((alias) => normalizeText(alias) === productCategoryText);
};

const Shop = ({ compactHome = false }: ShopProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState(getLang());
  const initialCategory =
    searchParams.get("category") || searchParams.get("cat") || "Hamısı";

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [room, setRoom] = useState(searchParams.get("room") || "");
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const categoryParam =
      searchParams.get("category") || searchParams.get("cat");
    setCategory(categoryParam || "Hamısı");
    setSearchTerm(searchParams.get("search") || "");
    setRoom(searchParams.get("room") || "");
  }, [searchParams]);

  useEffect(() => {
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts(0, 500);
        const products = extractList(res.data).map(normalizeProduct);
        setDbProducts(products);
      } catch (err) {
        console.error("Məlumat gəlmədi:", err);
        setDbProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const updateParams = (next: Record<string, string>) => {
    const params: Record<string, string> = {};
    if (next.category && next.category !== "Hamısı")
      params.category = next.category;
    if (next.search?.trim()) params.search = next.search.trim();
    if (next.room?.trim()) params.room = next.room.trim();
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    let result = dbProducts.map((p) => ({
      ...p,
      name: localized(p, "name", lang, p.name),
      description: localized(p, "description", lang, p.description),
    }));

    if (searchTerm.trim()) {
      const search = normalizeText(searchTerm);
      result = result.filter(
        (p) =>
          normalizeText(p.name).includes(search) ||
          normalizeText(p.description).includes(search) ||
          normalizeText(p.category).includes(search) ||
          normalizeText(p.room).includes(search) ||
          normalizeText(p.roomType).includes(search) ||
          normalizeText(p.partType).includes(search),
      );
    }

    if (category !== "Hamısı")
      result = result.filter((p) => categoryMatches(p.category, category));
    if (room)
      result = result.filter(
        (p) => normalizeText(p.room || p.roomType) === normalizeText(room),
      );

    if (sortBy === "cheap") result.sort((a, b) => getPrice(a) - getPrice(b));
    if (sortBy === "expensive")
      result.sort((a, b) => getPrice(b) - getPrice(a));
    if (sortBy === "discount")
      result = result.filter(
        (p) =>
          getOldPrice(p) > getPrice(p) ||
          p.isDiscount ||
          Number(p.discountPercent || 0) > 0,
      );
    if (sortBy === "newest")
      result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

    return result;
  }, [dbProducts, searchTerm, category, room, sortBy, lang]);

  if (loading) {
    return (
      <div className="pt-40 text-center text-2xl font-black text-[#0A1128] dark:text-white">
        {t("loadingCatalog", lang)}
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Perde.az kataloq"
        description="Pərdə, tül, jalüz, günəşlik, korniz və aksesuar məhsullarını kateqoriya, otaq tipi, axtarış və endirim filtirləri ilə seçin."
        path="/products"
      />
      <section
        className={`bg-[#f9f9f9] pb-16 dark:bg-slate-950 ${compactHome ? "pt-14" : "min-h-screen pt-28"}`}
        id="shop"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 flex flex-col items-center justify-center gap-4 text-center"
          >
            <div className="mx-auto">
              <h2 className="font-serif text-4xl leading-tight text-slate-900 dark:text-white md:text-5xl">
                {t("catalog", lang)}
              </h2>
              <div className="mx-auto mt-4 h-[2px] w-16 rounded-full bg-[#C5A059]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateParams({ category: cat, search: searchTerm, room })
                }
                className={`shrink-0 rounded-2xl border px-5 py-3 text-xs font-black transition ${category === cat ? "border-[#C5A059] bg-[#C5A059] text-black" : "border-slate-200 bg-white text-slate-600 hover:border-[#C5A059] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"}`}
              >
                {categoryLabel(cat, lang)}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="mb-10 grid grid-cols-1 gap-3 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800 md:grid-cols-[1fr_220px_220px]"
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]"
                size={18}
              />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateParams({ category, search: e.target.value, room });
                }}
                placeholder={t("searchPlaceholder", lang)}
                className="w-full rounded-2xl bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold outline-none transition focus:ring-2 focus:ring-[#C5A059]/30 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <select
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                updateParams({
                  category,
                  search: searchTerm,
                  room: e.target.value,
                });
              }}
              className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold outline-none dark:bg-slate-800 dark:text-white"
            >
              <option value="">{t("roomType", lang)}</option>
              {roomTypes.map((item) => (
                <option key={item} value={item}>
                  {roomLabel(item, lang)}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold outline-none dark:bg-slate-800 dark:text-white"
            >
              <option value="newest">{t("newest", lang)}</option>
              <option value="cheap">{t("priceAsc", lang)}</option>
              <option value="expensive">{t("priceDesc", lang)}</option>
              <option value="discount">{t("discounted", lang)}</option>
            </select>
          </motion.div>

          <AllModels
            isAdmin={false}
            products={filteredProducts}
            showSearch={false}
            pageSize={8}
          />
        </div>
      </section>
    </>
  );
};

export default Shop;
