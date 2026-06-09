import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Moon, Search, ShoppingBag, Sun, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContest";
import logo from "../assets/home/logo.jpg";
import { LANGUAGES, categories, categoryLabel, getLang, setLang, t } from "../utils/i18n";

const WHATSAPP_URL = "https://wa.me/994992900055?text=Salam%2C%20Perde.az%20%C3%BCzr%C9%99%20m%C9%99lumat%20almaq%20ist%C9%99yir%C9%99m";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lang, setLanguageState] = useState(getLang());
  const [darkMode, setDarkMode] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("perde_theme") === "dark");
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("perde_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (location.pathname === "/" && location.state?.targetId) {
      const targetId = location.state.targetId;
      setTimeout(() => scrollToId(targetId), 140);
    }
  }, [location]);

  const setLanguage = (value: string) => {
    setLanguageState(value);
    setLang(value);
    setLanguageOpen(false);
  };

  const scrollToId = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 132;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const goToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setCatalogOpen(false);
    setLanguageOpen(false);
    if (location.pathname !== "/") navigate("/", { state: { targetId: id } });
    else scrollToId(id);
  };

  const goHome = () => {
    setIsMobileMenuOpen(false);
    setCatalogOpen(false);
    setLanguageOpen(false);
    if (location.pathname !== "/") navigate("/", { state: { targetId: "home" } });
    else scrollToId("home");
  };

  const goToCategory = (category: string) => {
    setCatalogOpen(false);
    setIsMobileMenuOpen(false);
    setLanguageOpen(false);
    const params = category === "Hamısı" ? "" : `?category=${encodeURIComponent(category)}`;
    navigate(`/${params}`, { state: { targetId: "shop" } });
    setTimeout(() => scrollToId("shop"), 120);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/?search=${encodeURIComponent(q)}` : "/", { state: { targetId: "shop" } });
    setTimeout(() => scrollToId("shop"), 120);
    setIsMobileMenuOpen(false);
  };

  const topLinks = [
    { name: t("campaign", lang), id: "promos" },
    { name: t("about", lang), id: "about" },
    { name: t("customers", lang), id: "customers" },
    { name: t("contact", lang), id: "footer" },
  ];

  return (
    <nav className="fixed top-0 z-[1000] w-full shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="bg-black text-white">
        <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6">
          <button type="button" onClick={goHome} className="flex shrink-0 items-center gap-3 text-left" aria-label="Perde.az ana səhifə">
            <span className="flex h-12 w-20 items-center justify-center overflow-hidden rounded-2xl bg-black p-1.5 ring-1 ring-white/10 md:h-14 md:w-24">
              <img src={logo} alt="Perde.az logo" className="h-full w-full object-contain" />
            </span>
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {topLinks.map((link) => (
              <button key={link.id} onClick={() => goToSection(link.id)} className="rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-[0.28em] text-[#C5A059] transition hover:bg-white/5 hover:text-white">
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setDarkMode((prev) => !prev)} className="rounded-2xl bg-white/10 p-3 text-white" aria-label="Tema dəyiş">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="rounded-2xl bg-white/10 p-3 text-white" onClick={() => setIsMobileMenuOpen(true)} aria-label="Menyu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-black/5 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 lg:block">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-3 px-4 lg:px-6">
          <div className="relative">
            <button
              onClick={() => setCatalogOpen((prev) => !prev)}
              className="rounded-2xl bg-[#C5A059] px-6 py-4 text-xs font-black uppercase tracking-[0.26em] text-black shadow-sm transition hover:bg-[#d8b669]"
            >
              {t("catalog", lang)}
            </button>
            <AnimatePresence>
              {catalogOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute left-0 top-16 w-[560px] rounded-[28px] border border-slate-100 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <button key={category} onClick={() => goToCategory(category)} className="rounded-2xl border border-slate-100 px-4 py-3 text-left text-xs font-black text-slate-700 transition hover:border-[#C5A059] hover:bg-[#C5A059]/10 dark:border-slate-700 dark:text-slate-100">
                        {categoryLabel(category, lang)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="rounded-2xl bg-black px-5 py-4 text-xs font-black text-[#C5A059] shadow-sm transition hover:bg-[#C5A059] hover:text-black dark:bg-white dark:text-black">
            099 290 00 55
          </a>

          <form onSubmit={submitSearch} className="search-shell relative ml-auto min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-5 top-1/2 text-[#C5A059]" size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("searchPlaceholder", lang)}
              className="w-full rounded-[1.35rem] border border-slate-100 bg-slate-50 py-4 pl-14 pr-5 text-sm font-semibold outline-none transition focus:border-[#C5A059]/60 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </form>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-4 text-xs font-black text-slate-900 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              aria-label="Dil seçimi"
            >
              {lang} <ChevronDown size={14} className={`transition ${languageOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {languageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-14 z-20 w-28 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  {LANGUAGES.map((item) => (
                    <button key={item} onClick={() => setLanguage(item)} className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-black ${lang === item ? "bg-black text-white dark:bg-white dark:text-black" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setDarkMode((prev) => !prev)} className="rounded-2xl bg-slate-100 p-4 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => navigate("/basket")} className="relative rounded-2xl bg-black p-4 text-white transition hover:bg-[#C5A059] hover:text-black dark:bg-white dark:text-black" aria-label="Səbət">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C5A059] px-1 text-[10px] font-black text-black">{totalItems}</span>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[10001] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="absolute right-0 top-0 flex h-screen w-[88%] max-w-[390px] flex-col overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-950">
              <div className="mb-8 flex items-center justify-between">
                <button type="button" onClick={goHome} className="flex h-14 w-24 items-center justify-center rounded-xl bg-black p-2"><img src={logo} alt="Perde.az" className="h-full w-full object-contain" /></button>
                <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-900"><X /></button>
              </div>

              <form onSubmit={submitSearch} className="search-shell relative mb-5">
                <Search className="pointer-events-none absolute left-4 top-1/2 text-[#C5A059]" size={16} />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t("searchPlaceholder", lang)} className="w-full rounded-2xl bg-slate-100 py-4 pl-11 pr-4 font-bold outline-none dark:bg-slate-900 dark:text-white" />
              </form>

              <div className="mb-5 flex items-center gap-2">
                <div className="relative flex-1">
                  <button type="button" onClick={() => setLanguageOpen((prev) => !prev)} className="flex w-full items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-xs font-black dark:bg-slate-900 dark:text-white">
                    {lang} <ChevronDown size={14} className={languageOpen ? "rotate-180" : ""} />
                  </button>
                  <AnimatePresence>
                    {languageOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 right-0 top-12 z-20 rounded-2xl bg-white p-1 shadow-xl dark:bg-slate-900">
                        {LANGUAGES.map((item) => <button key={item} onClick={() => setLanguage(item)} className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-black ${lang === item ? "bg-black text-white dark:bg-white dark:text-black" : "text-slate-500"}`}>{item}</button>)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={() => setDarkMode((prev) => !prev)} className="rounded-2xl bg-slate-100 p-3 text-slate-900 dark:bg-slate-900 dark:text-white" aria-label="Tema dəyiş">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={() => navigate("/basket")} className="relative rounded-2xl bg-black p-3 text-white" aria-label="Səbət">
                  <ShoppingBag size={18} />
                  {totalItems > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C5A059] px-1 text-[10px] font-black text-black">{totalItems}</span>}
                </button>
              </div>

              <div className="mb-3 grid gap-2">
                <button onClick={() => goToSection("promos")} className="rounded-2xl bg-[#C5A059] px-4 py-4 text-left text-sm font-black uppercase tracking-wider text-black">{t("campaign", lang)}</button>
                <button onClick={() => goToSection("shop")} className="rounded-2xl bg-slate-50 px-4 py-4 text-left text-sm font-black uppercase tracking-wider text-slate-800 dark:bg-slate-900 dark:text-white">{t("catalog", lang)}</button>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-2">
                {categories.map((category) => <button key={category} onClick={() => goToCategory(category)} className="rounded-2xl border border-slate-100 px-3 py-3 text-left text-xs font-black dark:border-slate-800 dark:text-slate-100">{categoryLabel(category, lang)}</button>)}
              </div>
              <div className="flex flex-col gap-2">
                {topLinks.map((link) => <button key={link.id} onClick={() => goToSection(link.id)} className="rounded-2xl bg-slate-50 px-4 py-4 text-left text-sm font-black uppercase tracking-wider text-slate-800 dark:bg-slate-900 dark:text-white">{link.name}</button>)}
              </div>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-6 rounded-2xl bg-emerald-600 px-5 py-4 text-center text-sm font-black text-white">099 290 00 55</a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
