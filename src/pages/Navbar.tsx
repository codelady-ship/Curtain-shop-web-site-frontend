import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useCart } from '../components/CartContest'; 
import logo from "../assets/home/logo.jpg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Səbət datalarını götürürük
  const { cartItems } = useCart();
  
  const navigate = useNavigate(); 
  const location = useLocation();
  
  // Səbətdəki ümumi məhsul sayı
  const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const navLinks = [
    { name: 'Məhsullar', id: 'products' },
    { name: 'Haqqımızda', id: 'about' },
    { name: 'Müştəri rəyləri', id: 'testimonials' },
    { name: 'Əlaqə', id: 'footer' },
  ];

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { targetId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (location.pathname === '/' && location.state?.targetId) {
      const targetId = location.state.targetId;
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 80;
          const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  return (
    <nav className="fixed top-0 w-full z-[1000] bg-black py-4 border-b border-white/5">
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-10 md:h-12 object-contain rounded-lg" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="px-5 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-[#C5A059] border border-transparent hover:border-white/20 rounded-full transition-all duration-300"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* SAĞ İKON HİSSƏSİ */}
        <div className="flex items-center space-x-2 md:space-x-4">
          
          {/* SƏBƏT İKONU - Kliklədikdə birbaşa /basket səhifəsinə gedir */}
          <button 
            onClick={() => navigate('/basket')} 
            className="relative p-2 text-white hover:text-[#C5A059] transition-all active:scale-90"
          >
            <ShoppingBag size={22} strokeWidth={1.2} />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 bg-white text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-lg"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* MOBİL MENU BUTTON */}
          <button 
            className="md:hidden p-2 text-[#C5A059]" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div className="fixed inset-0 z-[9999] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="relative w-[85%] max-w-[350px] h-full bg-black border-l border-white/5 flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-[#C5A059] font-black tracking-[0.5em] text-[9px] uppercase">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><X size={32} /></button>
              </div>
              
              <div className="flex flex-col space-y-8">
                {navLinks.map((link) => (
                  <button 
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left text-xl uppercase text-white hover:text-[#C5A059] transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
                {/* Mobil menyuda Səbətə sürətli keçid */}
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/basket'); }}
                  className="text-left text-xl uppercase text-[#C5A059] font-bold"
                >
                  Səbətim ({totalItems})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;