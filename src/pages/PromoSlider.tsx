import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Gift, Image as ImageIcon, Send, ArrowRight, UserCheck } from 'lucide-react';

const PromoSlider = ({ onOpenLeadModal }: { onOpenLeadModal: () => void }) => {
  const goldColor = '#C5A059';
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      type: 'discount',
      title: <>İLK SİFARİŞƏ <br/> <span style={{ color: goldColor }}>HƏDİYYƏ!</span></>,
      desc: "Nömrənizi yazın, endirim kodu SMS-lə gəlsin.",
      bg: "#A82121",
      icon: <Gift size={250} className="opacity-10 absolute -right-10 -bottom-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />,
      content: (
        <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-sm" onClick={() => setIsPaused(true)}>
          <input 
            type="tel" 
            placeholder="+994 -- --- -- --" 
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="flex-1 px-4 py-4 rounded-xl text-black outline-none text-sm border-2 border-transparent focus:border-[#C5A059] transition-all" 
          />
          <button className="bg-[#C5A059] text-white font-black px-6 py-4 rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg">
            AL <Send size={18} />
          </button>
        </div>
      )
    },
    {
      id: 2,
      type: 'service',
      title: <>Ölçü alımı <span style={{ color: goldColor }}>pulsuz</span>!</>,
      desc: "Peşəkar komandamız ünvanınıza gəlir, kataloqlarla seçiminizə kömək edir.",
      bg: "#FBF9F4",
      textColor: "#1A1A1A",
      // Burada həm adam (UserCheck) həm də hərəkətli metrə var
      icon: (
        <div className="absolute right-4 bottom-0 flex items-end">
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="relative z-10"
          >
            <UserCheck size={280} className="text-[#1A1A1A] opacity-[0.07]" />
          </motion.div>
          <motion.div 
            animate={{ rotate: [-45, -35, -45] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -left-10 bottom-20"
          >
            <Ruler size={120} style={{ color: goldColor }} className="opacity-20" />
          </motion.div>
        </div>
      ),
      content: (
        <button 
          onClick={onOpenLeadModal}
          className="mt-6 flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-4 rounded-xl hover:bg-[#C5A059] transition-all group shadow-xl"
        >
          <span className="font-bold">Mütəxəssis çağır</span> 
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </button>
      )
    },
    {
      id: 3,
      type: 'visual',
      title: <>Otağını <br/> <span style={{ color: goldColor }}>virtual bəzə!</span></>,
      desc: "Şəkli göndər, pərdənin otağında necə duracağını anında gör.",
      bg: "#0A0A0A",
      icon: <ImageIcon size={250} className="opacity-10 absolute -right-10 -top-10 group-hover:scale-110 transition-transform duration-1000" />,
             content: (
        <button 
          onClick={onOpenLeadModal}
          className="mt-6 flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-4 rounded-xl"
        >
          Şəkil gönderin <ArrowRight size={20} />
        </button>
      )
    }
  ];

  const repeatedSlides = [...slides, ...slides, ...slides, ...slides];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="flex relative">
        {/* Kənar Fade effektləri */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-60 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-60 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div 
          className="flex gap-8 py-4"
          animate={isPaused ? {} : { x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            duration: 35, 
            ease: "linear" 
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {repeatedSlides.map((slide, i) => (
            <div 
              key={i} 
              style={{ backgroundColor: slide.bg, color: slide.textColor || 'white' }}
              className="relative shrink-0 w-[380px] md:w-[600px] h-[350px] md:h-[420px] p-10 md:p-16 rounded-[3.5rem] overflow-hidden flex flex-col justify-center shadow-[0_25px_60px_rgba(0,0,0,0.12)] group transition-all duration-500"
            >
              {slide.icon}
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl md:text-6xl font-black leading-[1.1] uppercase italic mb-5 tracking-tighter">
                    {slide.title}
                  </h2>
                </motion.div>
                
                <p className="text-sm md:text-xl opacity-70 font-medium max-w-sm leading-relaxed">
                  {slide.desc}
                </p>
                
                <div className="mt-2">
                  {slide.content}
                </div>
              </div>

              {/* Dekorativ künc effekti */}
              <div 
                className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-bl-full transition-all duration-700 group-hover:scale-150"
                style={{ backgroundColor: slide.textColor === "#1A1A1A" ? goldColor : 'white' }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PromoSlider;