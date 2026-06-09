import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContest";
import { ArrowLeft, ChevronRight, ShoppingBag, Heart, Plus, Minus, Star, Share2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductById, getAllProducts } from "../utils/services";
import ProductCard from "../components/ProductCard";
import { categoryLabel, getLang, localized, t } from "../utils/i18n";
import PageShellControls from "../components/PageShellControls";

const getProductsArray = (data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || "";

const getImageUrl = (image: string) => {
  if (!image || typeof image !== "string") return "";
  const trimmed = image.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;
  const withoutLeadingSlash = trimmed.replace(/^\/+/, "");
  const normalizedPath = withoutLeadingSlash.startsWith("uploads/") ? `/${withoutLeadingSlash}` : `/uploads/${withoutLeadingSlash}`;
  return `${BACKEND_ORIGIN}${normalizedPath}`;
};

const normalizeProduct = (raw: any) => {
  if (!raw) return null;

  const rawColors = Array.isArray(raw.colors) ? raw.colors : [];
  const colors = rawColors.map((c: any) => {
    const mainImage = c.mainImage || c.imageUrl || c.image || raw.imageUrl || raw.mainImage || "";
    return {
      ...c,
      name: c.name || c.colorName || "Standart",
      colorName: c.colorName || c.name || "Standart",
      code: c.code || c.colorCode || "#d1d5db",
      mainImage: getImageUrl(mainImage),
      imageUrl: getImageUrl(mainImage),
      images: Array.isArray(c.images) ? c.images.map(getImageUrl).filter(Boolean) : mainImage ? [getImageUrl(mainImage)] : [],
    };
  });

  const rawSizes = Array.isArray(raw.sizeOptions)
    ? raw.sizeOptions
    : Array.isArray(raw.sizes)
      ? raw.sizes
      : Array.isArray(raw.productSizes)
        ? raw.productSizes
        : [];

  const sizeOptions = rawSizes.length
    ? rawSizes.map((s: any) => ({
      ...s,
      size: s.size || s.sizeValue || s.value || "Standart",
      sizeValue: s.sizeValue || s.size || s.value || "Standart",
      price: Number(s.price ?? raw.price ?? 0),
      oldPrice: s.oldPrice ?? raw.oldPrice ?? null,
    }))
    : [{ size: "Standart", sizeValue: "Standart", price: Number(raw.price || 0), oldPrice: raw.oldPrice || null }];

  const imageUrl = getImageUrl(raw.imageUrl || raw.mainImage || raw.image || colors?.[0]?.mainImage || "");

  return { ...raw, colors, sizeOptions, imageUrl, image: imageUrl };
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { totalItems, addToCart, toggleWishlist, wishlist } = useCart();

  const [lang, setLang] = useState(getLang());
  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setImageLoaded(false);
        const res = await getProductById(id);
        const normalizedProduct = normalizeProduct(res.data);

        if (!normalizedProduct) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const firstColor = normalizedProduct.colors?.[0] || null;
        const firstSize = normalizedProduct.sizeOptions?.[0] || null;
        const firstImage = normalizedProduct.imageUrl || firstColor?.mainImage || firstColor?.images?.[0] || "";

        setProduct(normalizedProduct);
        setSelectedColor(firstColor);
        setSelectedSize(firstSize);
        setActiveImage(firstImage);

        const allRes = await getAllProducts(0, 100);
        const allProducts = getProductsArray(allRes.data).map(normalizeProduct).filter(Boolean);
        setSimilar(allProducts.filter((p: any) => String(p.category) === String(normalizedProduct.category) && String(p.id) !== String(id)));
        setPage(0);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Məhsul yüklənərkən xəta:", error);
        setProduct(null);
        setSimilar([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const productName = product ? localized(product, "name", lang, product.name) : "";
  const productDescription = product ? localized(product, "description", lang, product.description || product.desc || product.detail || product.details || product.productInfo || "") : "";
  const localizedSimilar = useMemo(() => similar.map((p) => ({ ...p, name: localized(p, "name", lang, p.name), description: localized(p, "description", lang, p.description) })), [similar, lang]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#FBFBFA] dark:bg-slate-950 dark:text-white">
        <Loader2 className="animate-spin text-[#C5A059]" size={40} />
        <p className="font-serif text-xl italic">{t("productLoading", lang)}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FBFBFA] font-serif text-2xl italic dark:bg-slate-950 dark:text-white">
        {t("productNotFound", lang)}
      </div>
    );
  }

  const totalPages = Math.ceil(localizedSimilar.length / 4);
  const currentPrice = selectedSize?.price ?? product.price ?? 0;
  const currentOldPrice = selectedSize?.oldPrice ?? product.oldPrice ?? null;

  const handleShare = async () => {
    const shareData = {
      title: productName,
      text: `${productName} - Perde.az`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopyMessage(t("copied", lang));
        setTimeout(() => setCopyMessage(""), 1800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, name: productName, description: productDescription, selectedColor, selectedSize, quantity });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFA] dark:bg-slate-950">
      <header className="sticky top-0 z-50 flex h-20 items-center bg-black text-white shadow-2xl">
        <div className="container mx-auto flex items-center justify-between px-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 transition-all hover:text-white">
            <ArrowLeft size={16} /> {t("back", lang)}
          </button>

          <nav className="hidden items-center gap-3 text-[11px] font-black uppercase tracking-widest md:flex">
            <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[#C5A059]">{t("home", lang)}</span>
            <ChevronRight size={12} className="text-gray-700" />
            <span onClick={() => navigate(`/?category=${encodeURIComponent(product.category)}`)} className="cursor-pointer hover:text-[#C5A059]">
              {categoryLabel(product.category, lang)}
            </span>
            <ChevronRight size={12} className="text-gray-700" />
            <span className="font-serif text-sm lowercase italic text-[#C5A059]">{productName}</span>
          </nav>

          <div className="flex items-center gap-3">
            <PageShellControls />
            <div className="group relative cursor-pointer" onClick={() => navigate("/basket")}>
              <ShoppingBag size={22} className="text-[#C5A059] transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-black shadow-lg">{totalItems}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 lg:col-span-6">
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:min-h-[500px]">
              {activeImage ? (
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  src={activeImage}
                  className="max-h-[600px] w-full rounded-2xl object-contain"
                  alt={productName}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="font-serif italic text-gray-400">{t("noImage", lang)}</div>
              )}

              <button onClick={() => toggleWishlist(product.id)} className="absolute top-6 right-6 z-10 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-90 dark:bg-slate-800/90">
                <Heart size={20} fill={wishlist.includes(product.id) ? "#ef4444" : "none"} className={wishlist.includes(product.id) ? "text-red-500" : "text-gray-400"} />
              </button>
            </div>

            {selectedColor?.images?.length > 0 && (
              <div className="mt-6 flex justify-center gap-4 overflow-x-auto pb-2">
                <AnimatePresence mode="wait">
                  {selectedColor.images.map((img: string, idx: number) => (
                    <motion.button
                      type="button"
                      key={`${img}-${idx}`}
                      onClick={() => { setActiveImage(img); setImageLoaded(false); }}
                      className={`relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${activeImage === img ? "scale-105 border-[#C5A059]" : "border-gray-100 dark:border-slate-800"}`}
                    >
                      <img src={img} loading="lazy" className="h-full w-full object-cover" alt="thumb" />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-8 lg:col-span-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="#C5A059" className="text-[#C5A059]" />)}
                </div>
                <h1 className="font-serif text-4xl leading-tight text-slate-900 dark:text-white md:text-5xl">{productName}</h1>
                <p className="mt-4 whitespace-pre-line border-l-4 border-[#C5A059] pl-4 font-serif text-base italic text-slate-500 dark:text-slate-300 md:text-lg">
                  {productDescription}
                </p>
              </div>
              <div className="relative">
                <button onClick={handleShare} className="rounded-full bg-white p-3 shadow-sm transition-transform hover:scale-110 active:scale-95 dark:bg-slate-900">
                  <Share2 size={20} className="text-[#C5A059]" />
                </button>
                {copyMessage && <span className="absolute right-0 top-12 whitespace-nowrap rounded-xl bg-black px-3 py-2 text-[10px] font-bold text-white">{copyMessage}</span>}
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-slate-900 dark:text-white">{Number(currentPrice).toFixed(2)} ₼</span>
              {currentOldPrice && Number(currentOldPrice) > Number(currentPrice) && <span className="text-xl font-bold italic text-gray-300 line-through">{Number(currentOldPrice).toFixed(2)} ₼</span>}
            </div>

            {product.sizeOptions?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400">{t("size", lang)}:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((s: any, i: number) => (
                    <button key={i} onClick={() => setSelectedSize(s)} className={`rounded-2xl border-2 px-6 py-3 text-xs font-black transition-all ${selectedSize?.size === s.size ? "border-black bg-black text-white shadow-xl dark:border-[#C5A059] dark:bg-[#C5A059] dark:text-black" : "border-gray-100 bg-white text-gray-400 dark:border-slate-800 dark:bg-slate-900"}`}>
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400">{t("color", lang)}:<span className="ml-2 text-black dark:text-white">{selectedColor?.name}</span></p>
                <div className="flex gap-4">
                  {product.colors.map((c: any, i: number) => (
                    <button key={i} onClick={() => { setSelectedColor(c); setActiveImage(c.mainImage || c.images?.[0] || product.imageUrl); setImageLoaded(false); }} className={`h-10 w-10 rounded-full border-4 p-0.5 transition-all ${selectedColor?.name === c.name ? "scale-110 border-[#C5A059]" : "border-white dark:border-slate-800"}`}>
                      <div className="h-full w-full rounded-full" style={{ backgroundColor: c.code }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <div className="flex w-fit items-center rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-4 hover:text-[#C5A059]"><Minus size={18} /></button>
                <span className="w-12 text-center text-xl font-black text-slate-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="p-4 hover:text-[#C5A059]"><Plus size={18} /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 rounded-3xl bg-black py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:bg-[#C5A059] hover:text-black">
                {t("addToCart", lang)}
              </button>
            </div>
          </motion.div>
        </div>

        {localizedSimilar.length > 0 && (
          <section className="mt-28 md:mt-32">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="mb-12 text-center font-serif text-4xl italic uppercase text-slate-900 dark:text-white md:text-5xl">
              {t("similarProducts", lang)}
            </motion.h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {localizedSimilar.slice(page * 4, (page + 1) * 4).map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i)} className={`transition-all duration-500 ${page === i ? "h-3 w-10 rounded-full bg-black dark:bg-[#C5A059]" : "h-3 w-3 rounded-full bg-gray-200 hover:bg-gray-400 dark:bg-slate-700"}`} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="mt-auto border-t border-white/5 bg-black py-6 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-serif text-3xl italic text-[#C5A059]">Perde.az</h3>
          <p className="mt-1 text-[10px] uppercase italic tracking-[0.5em] text-gray-600">By Premium Tekstil</p>
          <p className="mt-8 text-[7px] uppercase tracking-[0.3em] text-gray-800">© 2026 PERDE.AZ. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
