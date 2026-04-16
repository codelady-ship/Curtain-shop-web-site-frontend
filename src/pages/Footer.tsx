import { Instagram, Facebook, Phone, Mail, MapPin, Music2, ChevronUp } from 'lucide-react';

const Footer = () => {
  const goldColor = '#C5A059';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-zinc-900 relative" id="footer">
      
      {/* Yuxarı qalx düyməsi */}
      <button 
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-black border border-zinc-800 rounded-full flex items-center justify-center hover:border-[#C5A059] transition-all group shadow-2xl z-20"
      >
        <ChevronUp size={24} style={{ color: goldColor }} className="group-hover:-translate-y-1 transition-transform" />
      </button>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Sosial */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <h2 className="text-sm font-serif font-bold tracking-[0.2em] uppercase">
              Sosial Şəbəkələrimiz
            </h2>
            <div className="flex gap-4">
              {[
                { icon: <Instagram size={18} />, link: "https://instagram.com/senin_username" },
                { icon: <Facebook size={18} />, link: "https://facebook.com/senin_page" },
                { icon: <Music2 size={18} />, link: "https://tiktok.com/@senin_username" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-zinc-900 hover:border-[#C5A059] transition-all" 
                  style={{ color: goldColor }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Məlumat */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: goldColor }}>
              Məlumat
            </h4>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium text-center sm:text-left">
            <li><button onClick={() => scrollToSection('haqqimizda')} className="hover:text-white">Haqqımızda</button></li>
            <li><button onClick={() => scrollToSection('promos')} className="hover:text-white transition-colors">Kampaniyalar</button></li>              
            <li><button onClick={() => scrollToSection('haqqimizda')} className="hover:text-white">Zəmanət</button></li>
            <li><button onClick={() => scrollToSection('haqqimizda')} className="hover:text-white">İadə qaydaları</button></li>
            </ul>
          </div>

          {/* Kataloq */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: goldColor }}>
              Kataloq
            </h4>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium text-center sm:text-left">
              <li><button onClick={() => scrollToSection('products')} className="hover:text-white">Dəst pərdələr</button></li>
              <li><button onClick={() => scrollToSection('products')} className="hover:text-white">Günəşliklər</button></li>
              <li><button onClick={() => scrollToSection('products')} className="hover:text-white">Tüllər</button></li>
              <li><button onClick={() => scrollToSection('products')} className="hover:text-white">Jalüzlər</button></li>
              <li><button onClick={() => scrollToSection('products')} className="hover:text-white">Aksesuarlar</button></li>
              <li><button onClick={() => scrollToSection('products')} className="hover:text-white">Kornizlər</button></li>
            </ul>
          </div>

          {/* Əlaqə */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: goldColor }}>
              Əlaqə
            </h4>
            <ul className="space-y-5 text-[13px] text-zinc-400">
              
              {/* MAP */}
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 group">
                <MapPin size={18} style={{ color: goldColor }} />
                <a 
                  href="https://www.google.com/maps?q=Bakı+Nizami+rayonu+B.Nuriyev+322"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center sm:text-left hover:text-white"
                >
                  Bakı ş. Nizami r-nu <br /> B. Nuriyev 322
                </a>
              </li>

              {/* WHATSAPP */}
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 group">
                <Phone size={18} style={{ color: goldColor }} />
                <a 
                  href="https://wa.me/994992900055?text=Salam%20məhsullar%20haqqında%20məlumat%20almaq%20istəyirəm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-bold"
                >
                  099 290 00 55
                </a>
              </li>

              {/* EMAIL */}
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 group">
                <Mail size={18} style={{ color: goldColor }} />
                <a 
                  href="mailto:Properde1978@gmail.com" 
                  className="hover:text-white"
                >
                  Properde1978@gmail.com
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase text-center md:text-left">
            © 2026 <span className="text-zinc-400">PROPERDƏ</span>. Bütün hüquqlar qorunur.
          </p>
          <div className="flex gap-8 text-[9px] text-zinc-700 tracking-[0.2em] uppercase font-bold">
            <a href="#" className="hover:text-zinc-400">Məxfilik Siyasəti</a>
            <a href="#" className="hover:text-zinc-400">İstifadə Şərtləri</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;