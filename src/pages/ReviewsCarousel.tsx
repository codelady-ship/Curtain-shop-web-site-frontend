import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { getLang, t } from "../utils/i18n";

const reviewTexts: Record<string, any[]> = {
  AZ: [
    { name: "Leyla Məmmədova", location: "Bakı, White City", text: "Pərdələr evimin atmosferini tam dəyişdi. Parçaların toxunuşu və keyfiyyəti çox yüksəkdir." },
    { name: "Anar Əliyev", location: "Bakı, Sea Breeze", text: "Ölçü xidməti operativ gəldi, quraşdırılma dəqiq edildi. Nəticə gözlədiyimdən yaxşıdır." },
    { name: "Günel Həsənova", location: "Sumqayıt", text: "Vizual məsləhət sayəsində otağa uyğun model seçmək çox asan oldu." },
    { name: "Fərid Kərimov", location: "Bakı, Port Baku", text: "Ofis üçün blackout pərdələr aldıq. Həm funksionaldır, həm də interyerə uyğundur." },
    { name: "Nigar Sultanova", location: "Gəncə", text: "Müştəri xidməti nəzakətli idi. Sifariş vaxtında hazırlandı və səliqəli çatdırıldı." },
    { name: "Elnur Qasımov", location: "Bakı, Badamdar", text: "Premium keyfiyyət axtaranlar üçün düzgün ünvandır. Rənglər kataloqdakı kimi gəldi." },
  ],
  RU: [
    { name: "Лейла Мамедова", location: "Баку, White City", text: "Шторы полностью изменили атмосферу дома. Качество ткани и пошива на высоком уровне." },
    { name: "Анар Алиев", location: "Баку, Sea Breeze", text: "Замер сделали оперативно, установка прошла точно. Результат лучше ожиданий." },
    { name: "Гюнель Гасанова", location: "Сумгаит", text: "Благодаря консультации было легко подобрать модель под комнату." },
    { name: "Фарид Керимов", location: "Баку, Port Baku", text: "Заказывали blackout для офиса. Практично и хорошо выглядит в интерьере." },
    { name: "Нигяр Султанова", location: "Гянджа", text: "Сервис вежливый, заказ подготовили вовремя и аккуратно доставили." },
    { name: "Эльнур Гасымов", location: "Баку, Бадамдар", text: "Хороший выбор для тех, кто ищет премиальное качество. Цвета совпали с каталогом." },
  ],
  EN: [
    { name: "Leyla Mammadova", location: "Baku, White City", text: "The curtains changed the atmosphere of my home. Fabric touch and quality feel premium." },
    { name: "Anar Aliyev", location: "Baku, Sea Breeze", text: "Measurement was fast and the installation was precise. The result exceeded expectations." },
    { name: "Gunel Hasanova", location: "Sumgayit", text: "The visual consultation made it easy to choose the right model for the room." },
    { name: "Farid Karimov", location: "Baku, Port Baku", text: "We ordered blackout curtains for the office. They are functional and fit the interior." },
    { name: "Nigar Sultanova", location: "Ganja", text: "Customer service was polite, and the order was prepared and delivered neatly." },
    { name: "Elnur Gasimov", location: "Baku, Badamdar", text: "A strong option for premium quality. The colors matched the catalog." },
  ],
};

const ReviewsCarousel = () => {
  const goldColor = "#C5A059";
  const [lang, setLang] = useState(getLang());

  useEffect(() => {
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

  const reviews = reviewTexts[lang] || reviewTexts.AZ;
  const repeatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section id="testimonials" className="overflow-hidden bg-white py-5 dark:bg-slate-950 md:py-24">
      <div className="container mx-auto mb-12 px-6 md:mb-14">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <div className="h-[1px] w-8 bg-gray-300 dark:bg-slate-700" />
            <span style={{ color: goldColor }} className="text-sm font-bold uppercase tracking-[0.4em]">
              {t("reviews", lang)}
            </span>
            <div className="h-[1px] w-8 bg-gray-300 dark:bg-slate-700" />
          </motion.div>
          <h2 className="mb-6 font-serif text-4xl text-slate-900 dark:text-white md:text-5xl">{t("happyCustomers", lang)}</h2>
        </div>
      </div>

      <div className="relative flex">
        <div className="absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-white to-transparent dark:from-slate-950 md:w-40" />
        <div className="absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-white to-transparent dark:from-slate-950 md:w-40" />

        <div className="review-track flex gap-5 whitespace-nowrap py-4">
          {repeatedReviews.map((review, i) => (
            <div
              key={i}
              className="group inline-block w-[300px] rounded-[2rem] border border-transparent bg-zinc-50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#C5A059]/35 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:bg-slate-900 dark:hover:bg-slate-900 md:w-[360px]"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={13} fill={goldColor} color={goldColor} />
                  ))}
                </div>
                <Quote size={30} className="text-[#C5A059]/10 transition-colors group-hover:text-[#C5A059]/25" />
              </div>

              <p className="mb-7 whitespace-normal text-sm font-light italic leading-relaxed text-slate-700 dark:text-slate-300">
                “{review.text}”
              </p>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-5 dark:border-slate-800">
                <div
                  style={{ backgroundColor: `${goldColor}15`, color: goldColor }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A059]/20 font-serif text-lg font-bold"
                >
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{review.name}</h4>
                    <CheckCircle2 size={14} className="text-blue-500" />
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          {t("averageRating", lang)}: <span className="text-slate-900 dark:text-white">4.9/5.0</span>
        </p>
      </motion.div>
    </section>
  );
};

export default ReviewsCarousel;
