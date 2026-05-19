import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Phone, Mail, Clock } from 'lucide-react';

// Şəkillərin importu
import teamMainImg from '../assets/about/team-main.jpg';
import mudirImg from '../assets/about/mudir.jpg';

const About: React.FC = () => {
  const goldColor = '#C5A059';

  // Avtomatik növbə ilə dəyişən 2 şəkil
  const images = [teamMainImg, mudirImg];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 4 saniyədən bir şəkilləri dəyişən timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="haqqimizda" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">

          {/* SOL TƏRƏF: Animasiyalı Foto Çərçivəsi və ALTINDA ƏLAQƏ HİSSƏSİ */}
          <div className="w-full lg:w-6/12 flex flex-col items-center">

            {/* Foto Çərçivə Konteyneri */}
            <div className="relative inline-block w-full max-w-[640px] mb-8">

              {/* Üst Sol Animasiyalı Qızılı Künc */}
              <motion.div
                animate={{ x: [0, -4, 0], y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -left-5 w-24 h-24 border-l-[3px] border-t-[3px] rounded-tl-3xl z-0"
                style={{ borderColor: goldColor }}
              />

              {/* Alt Sağ Animasiyalı Qızılı Künc */}
              <motion.div
                animate={{ x: [0, 4, 0], y: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-5 -right-5 w-24 h-24 border-r-[3px] border-b-[3px] rounded-br-3xl z-0"
                style={{ borderColor: goldColor }}
              />

              {/* Əsas Foto */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-[8px] border-white bg-white"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-50">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      initial={{ opacity: 0, filter: "blur(6px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                      alt="Properde Komandası"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/[0.01]" />
                </div>
              </motion.div>
            </div>

            {/* FOTONUN TAM ALTINDAKI Premium Əlaqə Paneli */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-[640px] p-6 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
            >
              <div className="space-y-4 w-full sm:w-auto">
                {/* WhatsApp Linki */}
                <a
                  href="https://wa.me/994992900055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-white text-slate-600 transition-colors group-hover:bg-green-50 group-hover:text-green-600 shadow-xs border border-slate-100">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Müştəri Xidməti (WhatsApp)</p>
                    <p className="text-base font-serif font-bold text-slate-800 transition-colors group-hover:text-[#C5A059]">
                      +994 (99) 290 00 55
                    </p>
                  </div>
                </a>

                {/* Email Linki */}
                <a
                  href="mailto:contact@properde.az"
                  className="flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-white text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 shadow-xs border border-slate-100">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Rəsmi E-poçt Ünvanı</p>
                    <p className="text-base font-serif font-bold text-slate-800 transition-colors group-hover:text-[#C5A059]">
                      contact@properde.az
                    </p>
                  </div>
                </a>
              </div>

              {/* İş Saatları Bloku */}
              <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:border-l border-gray-200 sm:pl-6 w-full sm:w-auto">
                <div className="p-2.5 rounded-full bg-white text-slate-600 shadow-xs border border-slate-100">
                  <Clock size={18} style={{ color: goldColor }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">İş Saatlarımız</p>
                  <p className="text-sm font-bold text-slate-800">Hər gün: 09:00 - 18:00</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* SAĞ TƏRƏF: Mətnlər və İş Bölgüsü */}
          <div className="w-full lg:w-6/12 space-y-10 lg:pt-2">

            {/* Başlıq və Haqqımızda fəlsəfəsi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[1px] w-12 bg-gray-300"></div>
                <span style={{ color: goldColor }} className="text-sm uppercase tracking-[0.5em] font-bold">Haqqımızda</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-[1.15] mb-4">
                Xəyallarınızı Pəncərənizə <br />
                <span className="italic font-light text-slate-800">Köçürən Komanda</span>
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-light border-l-2 pl-6" style={{ borderColor: goldColor }}>
                Hər bir pərdə layihəsinin arxasında sadəcə parçalar deyil, böyük bir sənətkarlıq, sevgi və komanda işi dayanır. Biz, evinizin ruhuna və interyerinə mükəmməl toxunuşu bəxş etmək üçün bütöv bir heyətlə çalışırıq.
              </p>
            </motion.div>

            {/* Rəhbərlikdən Səmimi Mesaj */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex gap-4 p-5 bg-slate-50/70 rounded-2xl border border-slate-100/80 transition-all hover:bg-white hover:shadow-md"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm" style={{ color: goldColor }}>
                <Quote size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Rəhbərlikdən Səmimi Mesaj</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed mt-0.5">
                  "Bizim üçün ən böyük qazanc, işimizi bitirdikdən sonra müştərimizin üzündəki o səmimi məmnuniyyəti görməkdir." Hər bir müraciəti fərdi olaraq analiz edir, hər bir evə xüsusi bir konsept qururuq.
                </p>
              </div>
            </motion.div>

            {/* Peşəkar İş Bölgüsü mərhələləri */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-gray-300"></div>
                <h3 className="text-lg font-serif font-bold text-slate-900 tracking-tight">Peşəkar İş Bölgümüz</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-50/60 border border-slate-100 transition-colors hover:bg-slate-100/50">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">Dizayn və Konsultasiya</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">Evinizin interyerinə və işıq bucağına uyğun ən doğru model seçimində sizə yol göstərən komandamız.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50/60 border border-slate-100 transition-colors hover:bg-slate-100/50">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">Dərzi və İstehsalat</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">Premium parçaları milimetrik dəqiqliklə, gizli tikiş texnologiyası ilə sənət əsərinə çevirən ustalarımız.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50/60 border border-slate-100 transition-colors hover:bg-slate-100/50">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">Peşəkar Quraşdırılma</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">Pərdələrinizin məkanda tam ideal və düzgün dayanmasını təmin edən, təmiz işləyən montaj heyətimiz.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;