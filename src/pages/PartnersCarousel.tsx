import React, { useEffect, useMemo, useState } from "react";
import { getImageUrl, getPartners } from "../utils/services";
import { getLang, t } from "../utils/i18n";
import bakuElectronicsLogo from "../assets/partners/baku-electronics.svg";
import kontaktHomeLogo from "../assets/partners/kontakt-home.svg";
import bravoLogo from "../assets/partners/bravo.svg";
import rahatLogo from "../assets/partners/rahat-market.svg";
import arazLogo from "../assets/partners/araz.svg";
import optimalLogo from "../assets/partners/optimal.svg";
import irshadLogo from "../assets/partners/irshad.svg";
import kapitalLogo from "../assets/partners/kapital-bank.svg";
import abbLogo from "../assets/partners/abb.svg";

const fallbackPartners = [
  { id: "baku", name: "Baku Electronics", logoUrl: bakuElectronicsLogo, sortOrder: 1 },
  { id: "kontakt", name: "Kontakt Home", logoUrl: kontaktHomeLogo, sortOrder: 2 },
  { id: "bravo", name: "Bravo", logoUrl: bravoLogo, sortOrder: 3 },
  { id: "rahat", name: "Rahat Market", logoUrl: rahatLogo, sortOrder: 4 },
  { id: "araz", name: "Araz", logoUrl: arazLogo, sortOrder: 5 },
  { id: "optimal", name: "Optimal", logoUrl: optimalLogo, sortOrder: 6 },
  { id: "irshad", name: "İrşad", logoUrl: irshadLogo, sortOrder: 7 },
  { id: "kapital", name: "Kapital Bank", logoUrl: kapitalLogo, sortOrder: 8 },
  { id: "abb", name: "ABB", logoUrl: abbLogo, sortOrder: 9 },
];

const localLogoMap: Record<string, string> = {
  "baku electronics": bakuElectronicsLogo,
  "kontakt home": kontaktHomeLogo,
  bravo: bravoLogo,
  "rahat market": rahatLogo,
  araz: arazLogo,
  optimal: optimalLogo,
  irshad: irshadLogo,
  "irşad": irshadLogo,
  "kapital bank": kapitalLogo,
  abb: abbLogo,
};

const logoFor = (partner: any) => {
  const raw = String(partner.logoUrl || "").trim();
  if (raw.startsWith("/assets/") || raw.startsWith("/src/") || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
  const remote = getImageUrl(raw);
  if (remote) return remote;
  return localLogoMap[String(partner.name || "").trim().toLowerCase()] || bakuElectronicsLogo;
};

const PartnersCarousel = () => {
  const [partners, setPartners] = useState<any[]>(fallbackPartners);
  const [lang, setLang] = useState(getLang());

  useEffect(() => {
    getPartners(true)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length) setPartners(res.data);
      })
      .catch(() => null);
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  const sortedPartners = useMemo(() => [...partners].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)), [partners]);
  const items = [...sortedPartners, ...sortedPartners, ...sortedPartners, ...sortedPartners];

  return (
    <section id="partners" className="overflow-hidden bg-[#f7f7f7] py-12 dark:bg-slate-900">
      <div className="container mx-auto mb-8 px-4 text-center">
        <h2 className="font-serif text-4xl text-slate-900 dark:text-white md:text-5xl">{t("partners", lang)}</h2>
      </div>
      <div className="relative w-full overflow-hidden py-2">
        <div className="absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-[#f7f7f7] to-transparent dark:from-slate-900 md:w-40" />
        <div className="absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-[#f7f7f7] to-transparent dark:from-slate-900 md:w-40" />
        <div className="partner-track partner-track-reverse flex w-max gap-5 px-5">
          {items.map((partner, index) => {
            const logo = logoFor(partner);
            const card = (
              <div className="group flex h-24 w-60 shrink-0 items-center justify-center rounded-[1.8rem] border border-slate-100 bg-white px-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:rotate-[0.5deg] hover:border-[#C5A059]/40 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 md:h-28 md:w-64">
                <img src={logo} alt={`${partner.name} logo`} loading="lazy" className="max-h-16 max-w-48 object-contain transition duration-500 group-hover:scale-105" />
              </div>
            );
            return partner.websiteUrl ? <a href={partner.websiteUrl} target="_blank" rel="noreferrer" key={`${partner.id}-${index}`}>{card}</a> : <div key={`${partner.id}-${index}`}>{card}</div>;
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
