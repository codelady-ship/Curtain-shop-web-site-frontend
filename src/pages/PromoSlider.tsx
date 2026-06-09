import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ruler,
  BadgePercent,
  Phone,
  User,
  Upload,
  Heart,
} from "lucide-react";
import {
  buildLeadSelectionPayload,
  extractList,
  fetchProducts,
  getBanners,
  getImageUrl,
  normalizeProduct,
  submitLead,
} from "../utils/services";
import { useCart } from "../components/CartContest";
import { formatBytes, MAX_UPLOAD_IMAGE_BYTES, optimizeImageFile } from "../utils/imageCompression";
import { getLang, localized, t } from "../utils/i18n";

type VisualType = "PROMO" | "MEASURE" | "VIRTUAL" | "IMAGE";

type Banner = {
  id?: number | string;
  titleAz?: string;
  titleRu?: string;
  titleEn?: string;
  descriptionAz?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  buttonTextAz?: string;
  buttonTextRu?: string;
  buttonTextEn?: string;
  linkUrl?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  placement?: string;
  active?: boolean;
  sortOrder?: number;
  visualType?: VisualType | string;
  defaultLocked?: boolean;
};

type CampaignFormState = {
  fullName: string;
  phone: string;
  image: File | null;
  imageLabel: string;
};

const fallbackBanners: Banner[] = [
  {
    id: "default-promo",
    titleAz: "İlk sifarişə endirim!",
    titleRu: "Скидка на первый заказ!",
    titleEn: "First order discount!",
    descriptionAz: "Nömrənizi yazın, promo kodunuz WhatsApp nömrənizə göndərilsin.",
    descriptionRu: "Введите номер, и промокод будет отправлен в WhatsApp.",
    descriptionEn: "Enter your number and receive the promo code on WhatsApp.",
    buttonTextAz: "Al",
    buttonTextRu: "Получить",
    buttonTextEn: "Get",
    linkUrl: "#promos",
    placement: "MAIN",
    active: true,
    sortOrder: 10,
    visualType: "PROMO",
    defaultLocked: true,
  },
  {
    id: "default-measure",
    titleAz: "Ölçü alımı pulsuz!",
    titleRu: "Бесплатный замер!",
    titleEn: "Free measurement!",
    descriptionAz: "Adınızı və nömrənizi yazın, komandamız ölçü alımı üçün sizinlə əlaqə saxlasın.",
    descriptionRu: "Оставьте имя и номер, наша команда свяжется с вами для замера.",
    descriptionEn: "Leave your name and phone number; our team will contact you for measurements.",
    buttonTextAz: "Müraciət et",
    buttonTextRu: "Оставить заявку",
    buttonTextEn: "Request now",
    linkUrl: "#promos",
    placement: "MAIN",
    active: true,
    sortOrder: 20,
    visualType: "MEASURE",
    defaultLocked: true,
  },
  {
    id: "default-virtual",
    titleAz: "Otağını virtual bəzə!",
    titleRu: "Виртуально украсьте комнату!",
    titleEn: "Decorate your room virtually!",
    descriptionAz: "Otağın şəklini, adınızı və nömrənizi göndərin, pərdənin necə duracağını WhatsApp-la görün.",
    descriptionRu: "Отправьте фото комнаты, имя и номер, чтобы получить визуализацию в WhatsApp.",
    descriptionEn: "Send a room photo, name and phone number to preview the curtain by WhatsApp.",
    buttonTextAz: "Müraciət et",
    buttonTextRu: "Оставить заявку",
    buttonTextEn: "Request now",
    linkUrl: "#promos",
    placement: "MAIN",
    active: true,
    sortOrder: 30,
    visualType: "VIRTUAL",
    defaultLocked: true,
  },
];

const hiddenBackendSeedTitles = new Set([
  "ilk sifarişə endirim!",
  "ölçü alımı pulsuz!",
  "otağını virtual bax",
  "otağını virtual bəzə!",
  "pərdə və ev tekstili kampaniyası",
  "pulsuz ölçü",
]);

const normalizeTitle = (value?: string) => String(value || "").trim().toLocaleLowerCase("az-AZ");
const phoneDigits = (value: string) => String(value || "").replace(/\D/g, "");
const isValidPhone = (value: string) => {
  const digits = phoneDigits(value);
  return /^(0\d{9}|994\d{9}|\d{9})$/.test(digits);
};

const blankForm = (): CampaignFormState => ({
  fullName: "",
  phone: "",
  image: null,
  imageLabel: "",
});

const mergeBanners = (items: Banner[] = []) => {
  const customItems = items
    .filter((item) => item?.active !== false)
    .filter((item) => !item.placement || String(item.placement).toUpperCase() === "MAIN")
    .filter((item) => !hiddenBackendSeedTitles.has(normalizeTitle(item.titleAz)))
    .sort((a, b) => Number(a.sortOrder ?? 100) - Number(b.sortOrder ?? 100) || Number(b.id || 0) - Number(a.id || 0));

  return [...fallbackBanners, ...customItems];
};

const leadSourceFor = (type: VisualType) => {
  if (type === "PROMO") return "PROMO";
  if (type === "VIRTUAL") return "VISUALIZATION";
  if (type === "MEASURE") return "MEASUREMENT";
  return "GENERAL";
};

const leadMessageFor = (type: VisualType, title: string) => {
  if (type === "PROMO") return `${title} — promo kod tələbi`;
  if (type === "VIRTUAL") return `${title} — vizualizasiya tələbi`;
  if (type === "MEASURE") return `${title} — ölçü alımı tələbi`;
  return title;
};

const cardShell = (type: VisualType, featured: boolean, hasImage: boolean) => {
  if (hasImage) return "bg-black text-white";
  if (type === "PROMO") return "bg-gradient-to-br from-[#7f0d12] via-[#B71F24] to-[#23070c] text-white";
  if (type === "VIRTUAL") return "bg-gradient-to-br from-[#070D24] via-[#0f1c42] to-[#020617] text-white";
  return featured
    ? "bg-gradient-to-br from-[#fff8ea] via-[#f4ead7] to-white text-[#0A1128]"
    : "bg-gradient-to-br from-white via-[#fbf7ef] to-[#f5eee1] text-[#0A1128]";
};

const accentClass = (type: VisualType, hasImage: boolean) => {
  if (hasImage) return "text-[#C5A059]";
  return type === "PROMO" ? "text-[#E7C463]" : "text-[#C5A059]";
};

const iconFor = (type: VisualType) => {
  if (type === "PROMO") return <BadgePercent size={19} />;
  if (type === "VIRTUAL") return <Camera size={19} />;
  return <Ruler size={19} />;
};

const resolveType = (banner: Banner, index: number): VisualType => {
  const explicit = String(banner.visualType || "").toUpperCase();
  if (["PROMO", "MEASURE", "VIRTUAL", "IMAGE"].includes(explicit)) return explicit as VisualType;

  const title = normalizeTitle(banner.titleAz);
  if (title.includes("endirim") || title.includes("promo")) return "PROMO";
  if (title.includes("virtual") || title.includes("vizual")) return "VIRTUAL";
  if (title.includes("ölç") || title.includes("olcu")) return "MEASURE";
  if (banner.desktopImageUrl || banner.mobileImageUrl) return "IMAGE";

  return index % 3 === 0 ? "PROMO" : index % 3 === 1 ? "MEASURE" : "VIRTUAL";
};

const PromoSlider = () => {
  const { wishlist } = useCart();
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lang, setLangState] = useState(getLang());
  const [forms, setForms] = useState<Record<string, CampaignFormState>>({});
  const [states, setStates] = useState<Record<string, "idle" | "loading" | "success" | "error">>({});
  const [cardMessages, setCardMessages] = useState<Record<string, string>>({});
  const [fileProcessing, setFileProcessing] = useState<Record<string, boolean>>({});
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const isPaused = isSliderHovered || isFormFocused;

  useEffect(() => {
    getBanners(true)
      .then((res) => {
        if (Array.isArray(res.data)) setBanners(mergeBanners(res.data));
      })
      .catch(() => setBanners(fallbackBanners));

    fetchProducts()
      .then((res) => setDbProducts(extractList(res.data).map(normalizeProduct)))
      .catch((err) => console.error("Məhsullar yüklənmədi:", err));

    const handler = (event: any) => setLangState(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  const wishlistPayload = useMemo(() => {
    return buildLeadSelectionPayload({ cartItems: [], wishlist, products: dbProducts });
  }, [wishlist, dbProducts]);

  const sliderItems = useMemo(() => {
    const source = banners.length ? banners : fallbackBanners;
    return source.filter((item) => item.active !== false).filter((item) => !item.placement || String(item.placement).toUpperCase() === "MAIN");
  }, [banners]);

  useEffect(() => {
    setActiveIndex(0);
  }, [sliderItems.length]);

  useEffect(() => {
    if (isPaused || sliderItems.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.max(sliderItems.length, 1));
    }, 5200);
    return () => window.clearInterval(id);
  }, [isPaused, sliderItems.length]);

  const getForm = (key: string) => forms[key] || blankForm();

  const updateForm = (key: string, patch: Partial<CampaignFormState>) => {
    setForms((prev) => ({ ...prev, [key]: { ...blankForm(), ...(prev[key] || {}), ...patch } }));
    setStates((prev) => ({ ...prev, [key]: "idle" }));
    setCardMessages((prev) => ({ ...prev, [key]: "" }));
  };

  const navigateTo = (href?: string) => {
    const target = href?.trim() || "#shop";
    if (target.startsWith("#")) {
      const el = document.querySelector(target);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      window.location.href = target;
    }
  };

  const prev = () => setActiveIndex((activeIndex - 1 + sliderItems.length) % Math.max(sliderItems.length, 1));
  const next = () => setActiveIndex((activeIndex + 1) % Math.max(sliderItems.length, 1));

  const handleCampaignFileChange = async (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      updateForm(key, { image: null, imageLabel: "" });
      return;
    }

    setFileProcessing((prev) => ({ ...prev, [key]: true }));
    setStates((prev) => ({ ...prev, [key]: "idle" }));
    setCardMessages((prev) => ({ ...prev, [key]: "" }));

    try {
      if (file.size > MAX_UPLOAD_IMAGE_BYTES) {
        throw new Error(`Şəkil maksimum ${formatBytes(MAX_UPLOAD_IMAGE_BYTES)} ola bilər.`);
      }
      const optimized = await optimizeImageFile(file, {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1200,
        initialQuality: 0.82,
      });
      updateForm(key, { image: optimized, imageLabel: `${optimized.name} (${formatBytes(optimized.size)})` });
    } catch (error: any) {
      updateForm(key, { image: null, imageLabel: "" });
      setStates((prev) => ({ ...prev, [key]: "error" }));
      setCardMessages((prev) => ({ ...prev, [key]: error?.message || "Şəkil yüklənə bilmədi." }));
      event.target.value = "";
    } finally {
      setFileProcessing((prev) => ({ ...prev, [key]: false }));
    }
  };

  const submitCampaignLead = async (event: React.FormEvent, banner: Banner, type: VisualType, index: number) => {
    event.preventDefault();
    const key = String(banner.id || index);
    const form = getForm(key);
    const phone = String(form.phone || "").trim();
    const fullName = String(form.fullName || "").trim();

    if ((type === "MEASURE" || type === "VIRTUAL") && !fullName) {
      setStates((prev) => ({ ...prev, [key]: "error" }));
      setCardMessages((prev) => ({ ...prev, [key]: t("requiredName", lang) }));
      return;
    }

    if (!isValidPhone(phone)) {
      setStates((prev) => ({ ...prev, [key]: "error" }));
      setCardMessages((prev) => ({ ...prev, [key]: t("validPhone", lang) }));
      return;
    }

    if (type === "VIRTUAL" && !form.image) {
      setStates((prev) => ({ ...prev, [key]: "error" }));
      setCardMessages((prev) => ({ ...prev, [key]: t("requiredPhoto", lang) }));
      return;
    }

    setStates((prev) => ({ ...prev, [key]: "loading" }));
    setCardMessages((prev) => ({ ...prev, [key]: "" }));
    try {
      const title = localized(banner, "title", lang, "Kampaniya");
      await submitLead({
        fullName: fullName || "Sayt ziyarətçisi",
        phone,
        source: leadSourceFor(type),
        referrer: "WEBSITE",
        message: leadMessageFor(type, title),
        promoCode: type === "PROMO" ? "PROMO_TƏLƏBİ" : undefined,
        requestedProducts: [],
        likedProducts: wishlistPayload.likedProducts,
        likedProductLinks: wishlistPayload.likedProductLinks,
        totalAmount: 0,
        image: type === "VIRTUAL" ? form.image : undefined,
      });
      setStates((prev) => ({ ...prev, [key]: "success" }));
      setForms((prev) => ({ ...prev, [key]: blankForm() }));
    } catch (error: any) {
      const backendMessage = error?.response?.data?.errors?.phone || error?.response?.data?.message || t("validPhone", lang);
      setStates((prev) => ({ ...prev, [key]: "error" }));
      setCardMessages((prev) => ({ ...prev, [key]: backendMessage }));
    }
  };

  const renderCampaignForm = (banner: Banner, type: VisualType, index: number, image: string) => {
    const key = String(banner.id || index);
    const form = getForm(key);
    const state = states[key] || "idle";
    const errorMessage = cardMessages[key] || t("validPhone", lang);
    const isDarkCard = Boolean(image) || type === "PROMO" || type === "VIRTUAL";
    const buttonText = localized(banner, "buttonText", lang, type === "PROMO" ? "Al" : "Müraciət et");
    return (
      <form
        onSubmit={(event) => submitCampaignLead(event, banner, type, index)}
        onFocusCapture={() => setIsFormFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFormFocused(false);
        }}
        className="mt-8 max-w-[600px]"
      >
        {(type === "MEASURE" || type === "VIRTUAL") && (
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-white/10">
            <User size={18} className="flex-shrink-0 text-slate-400" />
            <input
              value={form.fullName}
              onChange={(event) => updateForm(key, { fullName: event.target.value })}
              placeholder={t("fullName", lang)}
              className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#C5A059]">
            <Phone size={18} className="flex-shrink-0 text-slate-400" />
            <input
              value={form.phone}
              onChange={(event) => updateForm(key, { phone: event.target.value })}
              inputMode="tel"
              aria-invalid={state === "error"}
              placeholder="050 000 00 00"
              className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading" || Boolean(fileProcessing[key])}
            className={`inline-flex min-w-[138px] items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wider transition ${type === "PROMO" ? "bg-[#C5A059] text-black hover:bg-[#e2bf67]" : type === "VIRTUAL" ? "bg-[#C5A059] text-white hover:text-black" : "bg-[#070D24] text-white hover:bg-[#C5A059] hover:text-black"}`}
          >
            {state === "loading" ? <Loader2 size={18} className="animate-spin" /> : state === "success" ? <CheckCircle2 size={18} /> : null}
            {state === "success" ? "Göndərildi" : buttonText}
          </button>
        </div>

        {type === "VIRTUAL" && (
          <label className={`mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 text-xs font-black transition ${isDarkCard ? "bg-white/12 text-white ring-1 ring-white/15 hover:bg-white/18" : "bg-slate-50 text-slate-600 ring-1 ring-slate-100 hover:bg-slate-100"}`}>
            <span className="flex min-w-0 items-center gap-2">
              <Upload size={17} className="flex-shrink-0" />
              <span className="truncate">{fileProcessing[key] ? t("optimizingImage", lang) : form.imageLabel || t("uploadRoomPhoto", lang)}</span>
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={(event) => handleCampaignFileChange(event, key)} />
          </label>
        )}

        {Array.isArray(wishlistPayload.likedProducts) && wishlistPayload.likedProducts.length > 0 && (
          <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black ${isDarkCard ? "bg-white/12 text-white" : "bg-red-50 text-red-500"}`}>
            <Heart size={13} fill="currentColor" />
            {wishlistPayload.likedProducts.length} ürək qoyulan model müraciətə əlavə olunur
          </div>
        )}

        {state === "error" && (
          <p className={`mt-3 rounded-2xl px-4 py-3 text-xs font-black ${isDarkCard ? "bg-white/15 text-white ring-1 ring-white/15" : "bg-red-50 text-red-600"}`}>
            {errorMessage}
          </p>
        )}
      </form>
    );
  };

  const renderCampaignCard = (banner: Banner, index: number, featured = false) => {
    const key = String(banner.id || index);
    const image = getImageUrl(banner.desktopImageUrl || banner.mobileImageUrl || "");
    const mobileImage = getImageUrl(banner.mobileImageUrl || banner.desktopImageUrl || "") || image;
    const type = resolveType(banner, index);
    const title = localized(banner, "title", lang, "Perde.az");
    const description = localized(banner, "description", lang, "");
    const buttonText = localized(banner, "buttonText", lang, type === "PROMO" ? "Al" : "Müraciət et");
    const leadEnabled = type !== "IMAGE" && !image;
    const cardNumber = String((index % Math.max(sliderItems.length, 1)) + 1).padStart(2, "0");
    const cardTotal = String(sliderItems.length).padStart(2, "0");

    return (
      <article
        key={key}
        className={`group relative flex h-full min-h-[410px] flex-col overflow-hidden rounded-[2.4rem] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.16)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_35px_95px_rgba(15,23,42,0.24)] md:p-8 ${featured ? "lg:min-h-[500px]" : "lg:min-h-[500px]"} ${cardShell(type, featured, Boolean(image))}`}
      >
        {!image && (
          <>
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-[#C5A059]/20 blur-3xl" />
          </>
        )}
        {sliderItems.length >= 3 && (
          <div className={`absolute right-5 top-5 z-20 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] ${image || type === "PROMO" || type === "VIRTUAL" ? "bg-white/15 text-white ring-1 ring-white/20" : "bg-black text-[#C5A059]"}`}>
            {cardNumber}/{cardTotal}
          </div>
        )}
        {image && (
          <picture>
            <source media="(max-width: 640px)" srcSet={mobileImage} />
            <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" />
          </picture>
        )}
        {image && <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/50 to-black/18" />}

        <div className="relative z-10 flex h-full flex-col justify-center">
          <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${image || type === "PROMO" || type === "VIRTUAL" ? "bg-white/12 text-white" : "bg-[#C5A059]/15 text-[#C5A059]"}`}>
            {iconFor(type)}
          </div>

          <p className={`mb-4 text-[10px] font-black uppercase tracking-[0.36em] ${accentClass(type, Boolean(image))}`}>
            {t("campaign", lang)}
          </p>

          <h2 className={`${featured ? "max-w-[680px] text-5xl sm:text-6xl xl:text-7xl" : "max-w-[330px] text-3xl sm:text-4xl"} font-black italic leading-[0.94] tracking-[-0.055em]`}>
            {title}
          </h2>

          <p className={`mt-6 max-w-[520px] text-sm font-semibold leading-7 sm:text-base ${image || type === "PROMO" || type === "VIRTUAL" ? "text-white/82" : "text-slate-700"}`}>
            {description}
          </p>

          {leadEnabled ? (
            renderCampaignForm(banner, type, index, image)
          ) : (
            <button
              type="button"
              onClick={() => navigateTo(banner.linkUrl)}
              className="mt-8 inline-flex w-full max-w-[460px] items-center justify-center gap-3 rounded-2xl bg-[#C5A059] px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:text-black group-hover:translate-x-1"
            >
              {buttonText}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </article>
    );
  };

  if (!sliderItems.length) return null;

  const current = sliderItems[activeIndex];
  const nextItem = sliderItems[(activeIndex + 1) % sliderItems.length];

  return (
    <section
      id="promos"
      onMouseEnter={() => setIsSliderHovered(true)}
      onMouseLeave={() => setIsSliderHovered(false)}
      className="overflow-hidden bg-white py-8 dark:bg-slate-950 md:py-12"
    >
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 lg:px-6">
        <div className="relative">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 90 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -90 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex items-stretch gap-6"
            >
              <div className="min-w-0 flex-[1_1_100%] lg:flex-[0_0_69%]">
                {renderCampaignCard(current, activeIndex, true)}
              </div>
              {sliderItems.length > 1 && (
                <div className="hidden min-w-0 flex-[0_0_29%] xl:block">
                  <div className="h-full origin-left scale-[0.96] opacity-95">
                    {renderCampaignCard(nextItem, (activeIndex + 1) % sliderItems.length, false)}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {sliderItems.length > 1 && (
            <>
              <button onClick={prev} type="button" aria-label="Əvvəlki kampaniya" className="absolute left-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-xl ring-1 ring-slate-100 transition hover:bg-[#C5A059] hover:text-black md:flex dark:bg-slate-900 dark:text-white dark:ring-slate-800"><ChevronLeft size={21} /></button>
              <button onClick={next} type="button" aria-label="Növbəti kampaniya" className="absolute right-2 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-xl ring-1 ring-slate-100 transition hover:bg-[#C5A059] hover:text-black md:flex dark:bg-slate-900 dark:text-white dark:ring-slate-800"><ChevronRight size={21} /></button>
            </>
          )}
        </div>

        {sliderItems.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {sliderItems.map((banner, i) => (
              <button
                key={banner.id || i}
                type="button"
                aria-label={`${t("campaign", lang)} ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-2.5 rounded-full transition-all ${activeIndex === i ? "w-12 bg-[#C5A059]" : "w-2.5 bg-slate-300 dark:bg-slate-700"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoSlider;
