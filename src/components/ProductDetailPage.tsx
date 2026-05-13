import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContest";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  Star,
  Share2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductById, getAllProducts } from "../utils/services";
import ProductCard from "../components/ProductCard";

const getProductsArray = (data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};


const getImageUrl = (image: string) => {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("data:") || image.startsWith("blob:")) return image;
  return `http://localhost:8080${image.startsWith("/") ? image : `/${image}`}`;
};

const normalizeProduct = (raw: any) => {
  if (!raw) return null;

  const rawColors = Array.isArray(raw.colors) ? raw.colors : [];

  const colors = rawColors.map((c: any) => {
    const mainImage =
      c.mainImage ||
      c.imageUrl ||
      c.image ||
      raw.imageUrl ||
      raw.mainImage ||
      "";

    return {
      ...c,
      name: c.name || c.colorName || "",
      code: c.code || c.colorCode || "#d1d5db",
      mainImage: getImageUrl(mainImage),
      imageUrl: getImageUrl(mainImage),
      images: Array.isArray(c.images) ? c.images.map(getImageUrl) : mainImage ? [getImageUrl(mainImage)] : [],
    };
  });

  const rawSizes = Array.isArray(raw.sizeOptions)
    ? raw.sizeOptions
    : Array.isArray(raw.sizes)
      ? raw.sizes
      : Array.isArray(raw.productSizes)
        ? raw.productSizes
        : [];

  const sizeOptions = rawSizes.map((s: any) => ({
    ...s,
    size: s.size || s.sizeValue || s.value || "",
    price: s.price ?? raw.price ?? 0,
    oldPrice: s.oldPrice ?? raw.oldPrice ?? null,
  }));

  return {
    ...raw,
    colors,
    sizeOptions,
    imageUrl: getImageUrl(raw.imageUrl || raw.mainImage || colors?.[0]?.mainImage || ""),
  };
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { totalItems, addToCart, toggleWishlist, wishlist } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

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
        const firstImage =
          normalizedProduct.imageUrl ||
          firstColor?.mainImage ||
          firstColor?.images?.[0] ||
          "";

        setProduct(normalizedProduct);
        setSelectedColor(firstColor);
        setSelectedSize(firstSize);
        setActiveImage(firstImage);

        const allRes = await getAllProducts(0, 100);

        const allProducts = getProductsArray(allRes.data)
          .map(normalizeProduct)
          .filter(Boolean);

        const filteredSimilar = allProducts.filter(
          (p: any) =>
            String(p.category) === String(normalizedProduct.category) &&
            Number(p.id) !== Number(id),
        );

        setSimilar(filteredSimilar);
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

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#FBFBFA]">
        <Loader2 className="animate-spin text-[#C5A059]" size={40} />
        <p className="font-serif italic text-xl">Məhsul yüklənir...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center font-serif italic text-2xl">
        Məhsul tapılmadı
      </div>
    );
  }

  const totalPages = Math.ceil(similar.length / 4);

  const currentPrice = selectedSize?.price ?? product.price ?? 0;
  const currentOldPrice = selectedSize?.oldPrice ?? product.oldPrice ?? null;

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `${product.name} - Properde Art Studio-da bəyəndiyim bu məhsula bax!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link kopyalandı!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      <header className="bg-black text-white h-20 flex items-center sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={16} /> GERİ
          </button>

          <nav className="hidden md:flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-[#C5A059]"
            >
              ANA SƏHİFƏ
            </span>

            <ChevronRight size={12} className="text-gray-700" />

            <span
onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)}
              className="cursor-pointer hover:text-[#C5A059]"
            >
              {product.category}
            </span>

            <ChevronRight size={12} className="text-gray-700" />

            <span className="text-[#C5A059] italic font-serif text-sm lowercase">
              {product.name}
            </span>
          </nav>

          <div
            className="relative cursor-pointer group"
            onClick={() => navigate("/basket")}
          >
            <ShoppingBag
              size={22}
              className="group-hover:scale-110 transition-transform text-[#C5A059]"
            />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center p-4 min-h-[400px]">
              {activeImage ? (
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  src={activeImage}
                  className="w-full max-h-[600px] object-contain rounded-2xl"
                  alt={product.name}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="text-gray-400 font-serif italic">
                  Şəkil yoxdur
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg z-10 hover:scale-110 transition-transform active:scale-90"
              >
                <Heart
                  size={20}
                  fill={wishlist.includes(product.id) ? "#ef4444" : "none"}
                  className={
                    wishlist.includes(product.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {selectedColor?.images?.length > 0 && (
              <div className="flex justify-center gap-4 mt-6">
                <AnimatePresence mode="wait">
                  {selectedColor.images.map((img: string, idx: number) => (
                    <motion.div
                      key={`${img}-${idx}`}
                      onClick={() => {
                        setActiveImage(img);
                        setImageLoaded(false);
                      }}
                      className={`relative w-20 h-28 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        activeImage === img
                          ? "border-[#C5A059] scale-105"
                          : "border-gray-100"
                      }`}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="thumb"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill="#C5A059"
                      className="text-[#C5A059]"
                    />
                  ))}
                </div>

                <h1 className="text-4xl font-serif italic text-slate-900 leading-tight">
                  {product.name}
                </h1>

                <p className="text-slate-500 font-serif italic text-lg mt-2 border-l-4 border-[#C5A059] pl-4">
                  {product.description}
                </p>
              </div>

              <button
                onClick={handleShare}
                className="p-3 bg-white rounded-full shadow-sm hover:scale-110 transition-transform active:scale-95 group"
              >
                <Share2
                  size={20}
                  className="text-[#C5A059] group-hover:text-black transition-colors"
                />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-slate-900">
                  {currentPrice} ₼
                </span>

                {currentOldPrice && (
                  <span className="text-xl line-through text-gray-300 font-bold italic">
                    {currentOldPrice} ₼
                  </span>
                )}
              </div>
            </div>

            {product.sizeOptions?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400">
                  Ölçülər:
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((s: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(s)}
                      className={`px-6 py-3 border-2 rounded-2xl font-black text-xs transition-all ${
                        selectedSize?.size === s.size
                          ? "bg-black border-black text-white shadow-xl"
                          : "bg-white border-gray-100 text-gray-400"
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[11px] font-black uppercase text-gray-400">
                  Rəng:
                  <span className="text-black ml-2">{selectedColor?.name}</span>
                </p>

                <div className="flex gap-4">
                  {product.colors.map((c: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedColor(c);
                        setActiveImage(
                          c.mainImage || c.images?.[0] || product.imageUrl,
                        );
                        setImageLoaded(false);
                      }}
                      className={`w-10 h-10 rounded-full border-4 p-0.5 transition-all ${
                        selectedColor?.name === c.name
                          ? "border-[#C5A059] scale-110"
                          : "border-white"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: c.code }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-4 hover:text-[#C5A059]"
                >
                  <Minus size={18} />
                </button>

                <span className="w-12 text-center font-black text-xl">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-4 hover:text-[#C5A059]"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-[#C5A059] transition-all shadow-2xl"
              >
                SƏBƏTƏ ƏLAVƏ ET
              </button>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-32">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl font-serif italic text-slate-900 uppercase text-center mb-12"
            >
              Koleksiyanın Digər Parçaları
            </motion.h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {similar.slice(page * 4, (page + 1) * 4).map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`transition-all duration-500 ${
                      page === i
                        ? "w-10 h-3 bg-black rounded-full"
                        : "w-3 h-3 bg-gray-200 rounded-full hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="bg-black text-white py-6 mt-auto border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-serif italic text-3xl text-[#C5A059]">
            Properde
          </h3>

          <p className="text-[10px] tracking-[0.5em] text-gray-600 uppercase mt-1 italic">
            By Premium Tekstil
          </p>

          <p className="mt-8 text-[7px] text-gray-800 tracking-[0.3em] uppercase">
            © 2026 PROPERDE ART STUDIO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
