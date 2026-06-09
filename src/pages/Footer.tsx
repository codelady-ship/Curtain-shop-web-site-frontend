import { useEffect, useState } from "react";
import { Instagram, Facebook, Phone, Mail, MapPin, Music2, ChevronUp } from "lucide-react";
import { categories, categoryLabel, getLang, t } from "../utils/i18n";

const Footer = () => {
  const goldColor = "#C5A059";
  const [lang, setLang] = useState(getLang());

  useEffect(() => {
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 84;
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-zinc-900 bg-black pt-10 pb-5 text-white" id="footer">
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-800 bg-black shadow-2xl transition-all hover:border-[#C5A059]"
        aria-label="Yuxarı qalx"
      >
        <ChevronUp size={24} style={{ color: goldColor }} className="transition-transform group-hover:-translate-y-1" />
      </button>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div className="flex flex-col items-center space-y-4 sm:items-start">
            <h2 className="font-serif text-sm font-bold uppercase tracking-[0.2em]">{t("social", lang)}</h2>
            <div className="flex gap-4">
              {[
                { icon: <Instagram size={18} />, link: "https://www.instagram.com/pro.perde?igsh=NmEyY3loMXhra2Zv&utm_source=qr" },
                { icon: <Facebook size={18} />, link: "https://www.facebook.com/share/1DzVFVwJpN/?mibextid=wwXIfr" },
                { icon: <Music2 size={18} />, link: "https://www.tiktok.com/@properde.az?_r=1&_t=ZS-96LwM7fK2lD" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-all hover:border-[#C5A059] hover:bg-zinc-900"
                  style={{ color: goldColor }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="mb-5 text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: goldColor }}>{t("info", lang)}</h4>
            <ul className="space-y-3 text-center text-sm font-medium text-zinc-400 sm:text-left">
              <li><button onClick={() => scrollToSection("about")} className="transition-colors hover:text-white">{t("about", lang)}</button></li>
              <li><button onClick={() => scrollToSection("promos")} className="transition-colors hover:text-white">{t("campaign", lang)}</button></li>
              <li><button onClick={() => scrollToSection("about")} className="transition-colors hover:text-white">{t("warranty", lang)}</button></li>
              <li><button onClick={() => scrollToSection("about")} className="transition-colors hover:text-white">{t("returnRules", lang)}</button></li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="mb-5 text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: goldColor }}>{t("catalog", lang)}</h4>
            <ul className="space-y-3 text-center text-sm font-medium text-zinc-400 sm:text-left">
              {categories.filter((item) => item !== "Hamısı").slice(0, 6).map((item) => (
                <li key={item}><button onClick={() => scrollToSection("shop")} className="hover:text-white">{categoryLabel(item, lang)}</button></li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="mb-5 text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: goldColor }}>{t("contact", lang)}</h4>
            <ul className="space-y-4 text-[13px] text-zinc-400">
              <li className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <MapPin size={18} style={{ color: goldColor }} />
                <a href="https://www.google.com/maps?q=Bakı+Nizami+rayonu+B.Nuriyev+322" target="_blank" rel="noopener noreferrer" className="whitespace-pre-line text-center hover:text-white sm:text-left">
                  {t("address", lang)}
                </a>
              </li>
              <li className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <Phone size={18} style={{ color: goldColor }} />
                <a href="https://wa.me/994992900055?text=Salam%20məhsullar%20haqqında%20məlumat%20almaq%20istəyirəm" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-white">099 290 00 55</a>
              </li>
              <li className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <Mail size={18} style={{ color: goldColor }} />
                <a href="mailto:info@perde.az" className="hover:text-white">info@perde.az</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-zinc-900 pt-6 md:flex-row">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600 md:text-left">
            © 2026 <span className="text-zinc-400">PERDE.AZ</span>. {t("rights", lang)}
          </p>
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700">
            <a href="#" className="hover:text-zinc-400">{t("privacy", lang)}</a>
            <a href="#" className="hover:text-zinc-400">{t("terms", lang)}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
