import React, { useEffect, useState } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LANGUAGES, getLang, setLang } from "../utils/i18n";

const PageShellControls = () => {
  const [lang, setLanguageState] = useState(getLang());
  const [languageOpen, setLanguageOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("perde_theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("perde_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handler = (event: any) => setLanguageState(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  const setLanguage = (value: string) => {
    setLanguageState(value);
    setLang(value);
    setLanguageOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setLanguageOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-3 text-xs font-black text-white transition hover:bg-[#C5A059] hover:text-black"
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
              className="absolute right-0 top-12 z-20 w-24 rounded-2xl bg-white p-1 text-slate-900 shadow-xl"
            >
              {LANGUAGES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-black ${lang === item ? "bg-black text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => setDarkMode((prev) => !prev)}
        className="rounded-2xl bg-white/10 p-3 text-white transition hover:bg-[#C5A059] hover:text-black"
        aria-label="Tema dəyiş"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
};

export default PageShellControls;
