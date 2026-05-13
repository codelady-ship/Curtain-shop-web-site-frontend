import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../components/CartContest";
import logo from "../assets/home/logo.jpg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  // Sayt daxili skrol funksiyası (Əvvəlki problemi həll edən versiya)
  useEffect(() => {
    if (location.pathname === "/" && location.state?.targetId) {
      const targetId = location.state.targetId;
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = 80;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
          window.history.replaceState({}, document.title);
        }
      }, 100);
    }
  }, [location]);

  const navLinks = [
    { name: "Məhsullar", id: "shop" },
    { name: "Haqqımızda", id: "about" },
    { name: "Müştəri rəyləri", id: "testimonials" },
    { name: "Əlaqə", id: "footer" },
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { targetId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-[1000] bg-black py-4 border-b border-white/5">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex-shrink-0"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 md:h-12 object-contain rounded-lg"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="px-5 py-2 text-[10px] uppercase tracking-[0.4em] font-black text-[#C5A059] hover:text-white transition-all duration-300"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* SAĞ İKONLAR */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/basket")}
            className="relative p-2 text-white hover:text-[#C5A059] transition-all active:scale-90"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            <AnimatePresence mode="popLayout">
              {totalItems > 0 && (
                <motion.span
                  key={totalItems} // Rəqəm hər dəyişəndə animasiya oynayacaq
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-0 right-0 bg-[#C5A059] text-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-black shadow-xl border border-black px-1"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="md:hidden p-2 text-[#C5A059] active:scale-90 transition-transform"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={30} />
          </button>
        </div>
      </div>

      {/* MOBİL DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[10001]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 w-[80%] max-w-[320px] h-screen bg-black border-l border-white/10 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-[#C5A059] font-black tracking-[0.4em] text-[10px] uppercase">
                  NAVİQASİYA
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white p-2"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="flex flex-col space-y-8">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left text-2xl uppercase font-black text-white hover:text-[#C5A059] transition-colors tracking-widest"
                  >
                    {link.name}
                  </button>
                ))}

                <div className="h-px bg-white/10 w-full my-4" />

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/basket");
                  }}
                  className="flex items-center justify-between text-xl uppercase text-[#C5A059] font-black group"
                >
                  Səbətim
                  <span className="bg-[#C5A059] text-black px-4 py-1 rounded-full text-sm">
                    {totalItems}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
