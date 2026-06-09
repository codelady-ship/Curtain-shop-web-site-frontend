import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/CartContest";
import { Trash2, Minus, Plus, ShoppingBag, Heart, ChevronRight, ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LeadModal from "../components/LeadModal";
import { buildLeadSelectionPayload, extractList, fetchProducts, getImageUrl, normalizeProduct, resolveWishlistProducts, submitLead } from "../utils/services";
import { categoryLabel, getLang, localized, t } from "../utils/i18n";
import PageShellControls from "../components/PageShellControls";

const BasketAndFavorite = () => {
  const { cartItems, totalItems, wishlist, removeFromCart, updateQuantity, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const [lang, setLang] = useState(getLang());
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  useEffect(() => {
    fetchProducts()
      .then((res) => setDbProducts(extractList(res.data).map(normalizeProduct)))
      .catch((err) => console.error("Məhsullar yüklənmədi:", err));
  }, []);

  const wishlistProducts = useMemo(() => {
    return resolveWishlistProducts(wishlist, dbProducts).map((p: any) => ({ ...p, name: localized(p, "name", lang, p.name), description: localized(p, "description", lang, p.description) }));
  }, [wishlist, dbProducts, lang]);

  const localizedCartItems = useMemo(() => cartItems.map((item: any) => ({ ...item, name: localized(item, "name", lang, item.name), description: localized(item, "description", lang, item.description) })), [cartItems, lang]);

  const handleCheckout = () => {
    if (cartItems.length > 0) setIsLeadModalOpen(true);
  };

  const subtotal = useMemo(() => buildLeadSelectionPayload({ cartItems, wishlist, products: dbProducts }).totalAmount, [cartItems, wishlist, dbProducts]);

  const handleConfirmOrder = async (data: any) => {
    const selectionPayload = buildLeadSelectionPayload({ cartItems, wishlist, products: dbProducts });
    await submitLead({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      source: "ORDER",
      referrer: new URLSearchParams(window.location.search).get("ref") || "WEB",
      ...selectionPayload,
      image: data.image,
    });
    setIsSuccess(true);
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
            <span className="font-serif text-sm lowercase italic text-[#C5A059]">{t("mySelections", lang)}</span>
          </nav>

          <div className="flex items-center gap-3">
            <PageShellControls />
            <div className="group relative cursor-pointer" onClick={() => navigate("/basket")}>
              <ShoppingBag size={22} className="text-[#C5A059] transition-transform group-hover:scale-110" />
              {totalItems > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-black shadow-lg">{totalItems}</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-12 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <h1 className="font-serif text-3xl italic text-slate-900 dark:text-white md:text-4xl">{t("mySelections", lang)}</h1>
            <div className="mx-auto mt-2 h-[1px] w-12 bg-[#C5A059]" />
          </motion.div>

          <div className="grid grid-cols-1 items-start gap-8 xl:gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <div className="flex items-center justify-between rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-50 p-2 text-red-500 dark:bg-red-500/10"><Heart size={20} fill="currentColor" /></div>
                  <h2 className="font-serif text-xl text-slate-800 dark:text-white">{t("wishlist", lang)}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-slate-800 dark:text-slate-300">{wishlistProducts.length} {t("productCount", lang)}</span>
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1 no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {wishlistProducts.length > 0 ? wishlistProducts.map((product: any) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={product.id}
                      className="group flex items-center gap-4 rounded-[2rem] border border-gray-50 bg-white p-4 shadow-sm transition-all hover:border-[#C5A059]/30 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-800">
                        <img src={getImageUrl(product.imageUrl || product.image || "") || "/placeholder.jpg"} loading="lazy" className="h-full w-full object-cover" alt={product.name} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-serif text-sm leading-tight text-slate-800 dark:text-white">{product.name}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{categoryLabel(product.category, lang)}</p>
                        <button onClick={() => navigate(`/product/${product.id}`)} className="block pt-1 text-[9px] font-black uppercase tracking-tighter text-[#C5A059] hover:underline">{t("details", lang)}</button>
                      </div>
                      <button onClick={() => toggleWishlist(product.id)} className="rounded-full p-3 text-red-400 transition-colors hover:bg-red-50"><Trash2 size={18} /></button>
                    </motion.div>
                  )) : (
                    <div className="rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
                      <Heart size={40} className="mx-auto mb-4 text-gray-100 dark:text-slate-800" />
                      <p className="font-serif italic text-gray-400">{t("emptyWishlist", lang)}</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-7">
              <div className="flex items-center justify-between rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/10 p-2 text-[#C5A059]"><ShoppingCart size={20} /></div>
                  <h2 className="font-serif text-xl">{t("basket", lang)}</h2>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase">{totalItems} {t("item", lang)}</span>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {localizedCartItems.length > 0 ? (
                    <>
                      <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2 no-scrollbar">
                        {localizedCartItems.map((item: any) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            key={`${item.id}-${item.selectedColor?.colorName || item.selectedColor?.name || "default"}-${item.selectedSize?.sizeValue || item.selectedSize?.size}`}
                            className="flex flex-col gap-4 rounded-[2.5rem] border border-gray-50 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:gap-6"
                          >
                            <div className="h-36 w-28 flex-shrink-0 overflow-hidden rounded-[1.8rem] border border-gray-100 dark:border-slate-800">
                              <img src={getImageUrl(item.selectedColor?.mainImage || item.selectedColor?.imageUrl || item.imageUrl || item.image || "") || "/placeholder.jpg"} loading="lazy" className="h-full w-full object-cover" alt={item.name} />
                            </div>

                            <div className="flex-1 space-y-2">
                              <h3 className="font-serif text-lg leading-tight text-slate-900 dark:text-white">{item.name}</h3>
                              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {item.selectedColor?.colorName || item.selectedColor?.name || "Standart"} • {item.selectedSize?.sizeValue || item.selectedSize?.size || "Standart"} sm
                              </p>
                              <button onClick={() => navigate(`/product/${item.id}`)} className="block pt-1 text-[9px] font-black uppercase tracking-tighter text-[#C5A059] hover:underline">{t("details", lang)}</button>
                              <div className="flex w-fit items-center rounded-xl border border-gray-100 bg-gray-50 px-2 py-1 dark:border-slate-800 dark:bg-slate-800">
                                <button onClick={() => updateQuantity(item.id, item.selectedColor?.colorName || item.selectedColor?.name || "Standart", item.selectedSize?.sizeValue || item.selectedSize?.size || "Standart", item.quantity - 1)} className="p-1.5 text-slate-400 hover:text-[#C5A059]"><Minus size={14} strokeWidth={3} /></button>
                                <span className="w-10 text-center text-sm font-black text-slate-900 dark:text-white">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.selectedColor?.colorName || item.selectedColor?.name || "Standart", item.selectedSize?.sizeValue || item.selectedSize?.size || "Standart", item.quantity + 1)} className="p-1.5 text-slate-400 hover:text-[#C5A059]"><Plus size={14} strokeWidth={3} /></button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 sm:h-36 sm:flex-col sm:items-end sm:py-2">
                              <button onClick={() => removeFromCart(item.id, item.selectedColor?.colorName || item.selectedColor?.name || "Standart", item.selectedSize?.sizeValue || item.selectedSize?.size || "Standart")} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={20} /></button>
                              <p className="text-xl font-black text-slate-900 dark:text-white">{((item.selectedSize?.price || item.price || 0) * item.quantity).toFixed(2)} ₼</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div layout className="space-y-6 rounded-[3rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col gap-4 border-b border-gray-50 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t("totalAmount", lang)}</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white">{subtotal.toFixed(2)} <span className="ml-1 text-2xl italic text-[#C5A059]">₼</span></h3>
                          </div>
                          <div className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-black uppercase text-green-500 dark:bg-green-500/10">{t("readyForPayment", lang)}</div>
                        </div>
                        <button onClick={handleCheckout} className="group flex w-full items-center justify-center gap-3 rounded-[2rem] bg-black py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-[#C5A059] hover:text-black">
                          {t("confirmOrder", lang)} <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-6 rounded-[3rem] border border-gray-50 bg-white p-20 text-center dark:border-slate-800 dark:bg-slate-900">
                      <ShoppingBag size={40} className="text-gray-200 dark:text-slate-800" />
                      <p className="font-serif text-xl italic text-slate-900 dark:text-white">{t("emptyCart", lang)}</p>
                      <button onClick={() => navigate("/products")} className="rounded-2xl bg-black px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#C5A059] hover:text-black">{t("startShopping", lang)}</button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isLeadModalOpen && (
          <LeadModal isOpen={isLeadModalOpen} onClose={() => { setIsLeadModalOpen(false); setIsSuccess(false); }} onConfirm={handleConfirmOrder} isSuccess={isSuccess} />
        )}
      </AnimatePresence>

      <footer className="mt-auto border-t border-white/5 bg-black py-6 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-serif text-3xl italic text-[#C5A059]">Perde.az</h3>
          <p className="mt-1 text-[8px] uppercase italic tracking-[0.5em] text-gray-600">By Premium Tekstil</p>
          <p className="mt-8 text-[7px] uppercase tracking-[0.3em] text-gray-800">© 2026 PERDE.AZ. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default BasketAndFavorite;
