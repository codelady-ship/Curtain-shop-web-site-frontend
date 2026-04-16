import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Ruler, PenTool, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';

// Şəkilləri assets qovluğundan import edirik
import img1 from '../assets/about/perde1.jpg'; 
import img2 from '../assets/about/perde2.jpg';
import img3 from '../assets/about/perde3.jpg';
import img4 from '../assets/about/perde4.jpg';

const About = () => {
  const goldColor = '#C5A059';
  const [currentImg, setCurrentImg] = useState(0);

  const images = [img1, img2, img3, img4];

  const features = [
    { 
      title: "Premium Parçalar", 
      desc: "Dünyanın ən yaxşı tekstil fabriklərindən seçilmiş eksklüziv kolleksiya.",
      icon: <Award size={28} /> 
    },
    { 
      title: "Ödənişsiz Ölçü", 
      desc: "Peşəkar ustalarımız tərəfindən yerində dəqiq ölçü və məsləhət xidməti.",
      icon: <Ruler size={28} /> 
    },
    { 
      title: "Vizualizasiya", 
      desc: "Seçdiyiniz pərdələrin otağınızda necə görünəcəyini 3D formatda görün.",
      icon: <PenTool size={28} /> 
    },
    { 
      title: "Sürətli Çatdırılma", 
      desc: "Sifarişiniz 2-4 iş günü ərzində tam hazır və quraşdırılmış şəkildə təhvil verilir.",
      icon: <Truck size={28} /> 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="haqqimizda" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* SOL TƏRƏF: Şəkil və Çərçivə Hissəsi */}
          <div className="w-full lg:w-5/12 flex justify-center items-center">
            <div className="relative inline-block"> {/* Şəklin ölçüsünə görə daralan konteyner */}
              
              {/* Arxa fon Dekorasiyası - Üst Sol (Şəkildən kənara çıxması üçün mənfi dəyərlərlə) */}
              <motion.div 
                animate={{ x: [0, -5, 0], y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 w-24 h-24 border-l-[4px] border-t-[4px] rounded-tl-2xl z-0"
                style={{ borderColor: goldColor }}
              />

              {/* Arxa fon Dekorasiyası - Alt Sağ */}
              <motion.div 
                animate={{ x: [0, 5, 0], y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-4 w-24 h-24 border-r-[4px] border-b-[4px] rounded-br-2xl z-0"
                style={{ borderColor: goldColor }}
              />

              {/* Əsas Şəkil Konteyneri */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 w-[320px] md:w-[380px] lg:w-[400px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[8px] border-white bg-white"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImg}
                      src={images[currentImg]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-full object-cover"
                      alt="Properde"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/5" />
                </div>
                
                {/* Karusel indikatorları */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {images.map((_, i) => (
                    <div key={i} className={`h-1 transition-all duration-500 rounded-full ${currentImg === i ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* SAĞ TƏRƏF: Kontent */}
          <div className="w-full lg:w-7/12 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[1px] w-12 bg-gray-300"></div>
                <span style={{ color: goldColor }} className="text-sm uppercase tracking-[0.5em] font-bold">Haqqımızda</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-[1.1] mb-3">
                Pəncərəniz üçün <br />
                <span className="italic font-light">Eleqant</span> Həllər
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-light border-l-2 pl-6" style={{ borderColor: goldColor }}>
                Biz sadəcə pərdə satmırıq, biz məkanınızın ruhunu dəyişən zəriflik yaradırıq. 
                <strong className="text-slate-900 font-medium"> 1978-ci ildən</strong> bəri sənətkarlıqla texnologiyanı birləşdirərək premium toxunuş bəxş edirik.
              </p>
            </motion.div>

            {/* Özəlliklər */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {features.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-4 p-1">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm transition-all group-hover:bg-black group-hover:text-white"
                      style={{ color: goldColor }}
                    >
                      {React.cloneElement(item.icon, { size: 24 })}
                    </div>
                    <div>
                      <h3 className="text-md font-bold text-slate-800 mb-0.5 tracking-tight">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-tight">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Zəmanət və İadə Bölməsi */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -3 }}
                className="group relative flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden cursor-default transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                <div className="relative z-10 flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-sm transition-transform group-hover:scale-105">
                    <ShieldCheck size={20} style={{ color: goldColor }} className="shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-[#C5A059]">Rəsmi Zəmanət</h4>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                      Bütün mexanizm və parçalarımıza <span className="font-bold text-slate-700">1 il</span> rəsmi zəmanət.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="group relative flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden cursor-default transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                <div className="relative z-10 flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-sm transition-transform group-hover:scale-105">
                    <RefreshCcw size={20} style={{ color: goldColor }} className="shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider group-hover:text-[#C5A059]">İadə Şərtləri</h4>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                      İstehsal xətası zamanı <span className="font-bold text-slate-700">14 gün</span> ərzində yenilənmə.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Əlaqə */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Müştəri Xidməti</p>
                <p className="text-lg font-serif font-bold text-slate-800 transition-colors hover:text-[#C5A059] cursor-pointer">
                  +994 (99) 290 00 55
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;