import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const ReviewsCarousel = () => {
  const goldColor = '#C5A059';

  const reviews = [
    { 
      name: "Leyla Məmmədova", 
      location: "Bakı, White City",
      text: "Properde-dən aldığım tüllər evimin atmosferini tamamilə dəyişdi. Parçaların toxunuşu və keyfiyyəti sözlə ifadə edilməzdir. Hər kəsə tövsiyə edirəm!"
    },
    { 
      name: "Anar Əliyev", 
      location: "Bakı, Sea Breeze",
      text: "Ölçü götürmə xidməti çox operativdir. Peşəkar yanaşma və dəqiq quraşdırılma. Keyfiyyət gözlədiyimdən də yüksəkdir."
    },
    { 
      name: "Günel Həsənova", 
      location: "Sumqayıt",
      text: "3D Vizualizasiya xidməti sayəsində pərdələrin otağımda necə duracağını əvvəlcədən gördüm. Bu, qərar verməyimi çox asanlaşdırdı."
    },
    { 
      name: "Fərid Kərimov", 
      location: "Bakı, Port Baku",
      text: "Ofisimiz üçün müraciət etdik. Blackout pərdələr həm funksionaldır, həm də çox şık görünür. İşlərinin ustasıdırlar."
    },
    { 
      name: "Nigar Sultanova", 
      location: "Gəncə",
      text: "Müştəri xidmətləri çox nəzakətlidir. Sifarişim vaxtından tez hazır oldu. Paketləmə və çatdırılma mükəmməl idi."
    },
    { 
      name: "Elnur Qasımov", 
      location: "Bakı, Badamdar",
      text: "Premium keyfiyyət axtaranlar üçün tək ünvan. Parçaların rəng çalarları tam olaraq kataloqdakı kimidir."
    }
  ];

  // Sonsuz döngü üçün massivi 3 dəfə təkrarlayırıq
  const repeatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        {/* Başlıq */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-[1px] w-8 bg-gray-300"></div>
            <span style={{ color: goldColor }} className="text-sm uppercase tracking-[0.4em] font-bold">
              Müştəri Rəyləri
            </span>
            <div className="h-[1px] w-8 bg-gray-300"></div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Məmnun Müştərilərimiz</h2>
        </div>
      </div>

      {/* Karusel Sahəsi */}
      <div className="flex relative">
        {/* Kənar kölgə effektləri (Fade) */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div 
          className="flex gap-6 whitespace-nowrap py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            duration: 40, 
            ease: "linear" 
          }}
          whileHover={{ transition: { duration: 100 } }} // Üzərinə gələndə yavaşlayır
        >
          {repeatedReviews.map((review, i) => (
            <div 
              key={i} 
              className="inline-block w-[350px] md:w-[420px] p-8 md:p-10 bg-zinc-50 rounded-[2.5rem] border border-transparent hover:border-[#C5A059]/30 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group"
            >
              {/* Ulduzlar və Sitat */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} fill={goldColor} color={goldColor} />
                  ))}
                </div>
                <Quote size={36} className="text-[#C5A059]/10 group-hover:text-[#C5A059]/20 transition-colors" />
              </div>

              {/* Rəy Mətni */}
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-light whitespace-normal italic mb-8">
                "{review.text}"
              </p>

              {/* İstifadəçi Məlumatı */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div 
                  style={{ backgroundColor: `${goldColor}15`, color: goldColor }}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg font-bold border border-[#C5A059]/20"
                >
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight">{review.name}</h4>
                    <CheckCircle2 size={14} className="text-blue-500" />
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Alt Reytinq Göstəricisi */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-16 text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">
          Ortalama reytinq: <span className="text-slate-900">4.9/5.0</span>
        </p>
      </motion.div>
    </section>
  );
};

export default ReviewsCarousel;