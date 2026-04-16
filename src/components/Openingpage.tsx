import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/home/logo.jpg";

const Openingpage = ({ children }) => {
  // İlk yüklənmədə sessiyanı yoxla
  const [isVisible, setIsVisible] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("seenIntro");
    if (seen) {
      setIsVisible(false);
      setIsDone(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("seenIntro", "true");
        // Animasiya tam bitdikdən sonra komponenti yaddaşdan silmək üçün
        setTimeout(() => setIsDone(true), 1500);
      }, 4000); 

      return () => clearTimeout(timer);
    }
  }, []);

  // Əgər intro görülübsə, birbaşa saytı qaytar
  if (isDone) return <>{children}</>;

  return (
    <>
      {/* Sayt arxada hazır dayanır amma pərdə açılana qədər gizli qalır */}
      <div className={`fixed inset-0 ${isVisible ? 'opacity-0' : 'opacity-1'}`}>
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="opening-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="fixed inset-0 z-[10000] flex overflow-hidden bg-black"
          >
            {/* SOL PƏRDƏ */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1], delay: 2.2 }}
              className="absolute left-0 top-0 w-1/2 h-full bg-[#0a0a0a] z-20 border-r border-white/5"
            />

            {/* SAĞ PƏRDƏ */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1], delay: 2.2 }}
              className="absolute right-0 top-0 w-1/2 h-full bg-[#0a0a0a] z-20 border-l border-white/5"
            />

            {/* LOGO VƏ MƏTN */}
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ 
                  duration: 2.5, 
                  times: [0, 0.2, 0.8, 1],
                  ease: "easeInOut" 
                }}
                className="flex flex-col items-center text-center px-4"
              >
                <img 
                  src={logo} 
                  alt="logo" 
                  className="w-24 md:w-40 mb-6 rounded-full border border-[#C5A059] p-1" 
                />
                <h1 className="text-[#C5A059] text-3xl md:text-5xl font-serif tracking-[0.3em] uppercase">
                  PROPERDE
                </h1>
                <p className="text-gray-500 tracking-[0.5em] uppercase text-[10px] mt-2">
                  Pəncərənizdəki Sənət
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Openingpage;