import { motion } from 'framer-motion';
// Əgər qırmızı xətt itməsə, faylın adının 'hero.jpg' olduğundan 
// və assets/home/ qovluğunda yerləşdiyindən əmin ol
import bgimage from "../assets/home/hero.jpg"; 

const Hero = ({ onLeadModal }) => {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          // Pərdə açılmağa başlayanda (2.2s) şəkil artıq görünsün
          transition={{ duration: 2, ease: "easeOut", delay: 1.5 }} 
          src={bgimage} 
          alt="Properde Hero" 
          className="w-full h-full object-cover object-center lg:object-[center_30%]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, letterSpacing: "1em", filter: "blur(10px)" }}
          animate={{ opacity: 1, letterSpacing: "0.1em", filter: "blur(0px)" }}
          transition={{ 
            delay: 3.5, // Pərdə tam açılan kimi yazı gəlsin
            duration: 1.2, 
            ease: "easeOut" 
          }}
          className="text-5xl md:text-[8rem] lg:text-[11rem] font-serif text-white leading-none mb-6 uppercase select-none"
        >
          PROPƏRDƏ
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2, duration: 0.8 }}
          className="text-white text-sm md:text-2xl font-serif tracking-[0.6em] uppercase italic"
        >
          Pəncərənizdəki Sənət
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 4.8, duration: 0.6 }}
        >
          <button 
            onClick={onLeadModal}
            className="mt-12 group relative bg-transparent border border-white text-[#C5A059] px-12 py-4 rounded-full font-bold uppercase text-[11px] tracking-[0.4em] overflow-hidden transition-all duration-500 hover:text-black"
          >
            <span className="relative z-10">Sifariş Et</span>
            <div className="absolute inset-0 bg-[#C5A059] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>
      
    </section>
  );
};

export default Hero;