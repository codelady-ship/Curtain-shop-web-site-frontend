import React, { useState } from 'react';
import { useCart } from '../components/CartContest';
import { 
  Trash2, Minus, Plus, ShoppingBag, Heart, 
  ChevronRight, ArrowLeft, ShoppingCart,
  Instagram, MessageCircle, Music2, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import productsData from '../store/productData.json';
import LeadModal from '../components/LeadModal';

const BasketAndFavorite = () => {
  const { cartItems, wishlist, removeFromCart, updateQuantity, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setIsLeadModalOpen(true);
    }
  };

  // Səbət cəmi hesablama
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.selectedSize?.price || item.selectedColor?.price || item.price || 0);
    return acc + (price * item.quantity);
  }, 0);

  const wishlistProducts = wishlist.map((id) => 
    productsData.find(p => p.id === id)
  ).filter(Boolean);


const handleConfirmOrder = (data) => {
  console.log("Sifariş göndərildi:", data);
  setTimeout(() => {
    setIsSuccess(true);
  }, 500);
};
  return (
    <div className="bg-[#FBFBFA] min-h-screen flex flex-col">
      {/* HEADER / NAVBAR */}
      <header className="bg-black text-white h-20 flex items-center sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={16} /> GERİ
          </button>

          <nav className="hidden md:flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
            <span onClick={() => navigate('/')} className="cursor-pointer hover:text-[#C5A059]">ANA SƏHİFƏ</span>
            <ChevronRight size={12} className="text-gray-700" />
            <span className="text-[#C5A059] italic font-serif text-sm lowercase">Mənim Seçimlərim</span>
          </nav>

          <div className="relative cursor-pointer group" onClick={() => navigate('/basket')}>
            <ShoppingBag size={22} className="group-hover:scale-110 transition-transform text-[#C5A059]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-12 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 italic">Mənim Seçimlərim</h1>
            <div className="h-[1px] w-12 bg-[#C5A059] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            {/* İSTƏK SİYAHISI */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg text-red-500">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <h2 className="text-xl font-serif text-slate-800">İstək Siyahısı</h2>
                </div>
                <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase">
                  {wishlistProducts.length} Məhsul
                </span>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                  {wishlistProducts.length > 0 ? (
                    wishlistProducts.map((product) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={product.id}
                        className="bg-white p-4 rounded-[2rem] shadow-sm flex items-center gap-4 border border-gray-50 group hover:border-[#C5A059]/30 transition-all"
                      >
                        <div className="w-24 h-28 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img 
                            src={product.colors?.[0]?.mainImage || "/placeholder.jpg"} 
                            className="w-full h-full object-cover" 
                            alt={product.name} 
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-serif text-sm text-slate-800 leading-tight">{product.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{product.category}</p>
                          <button 
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="text-[9px] font-black text-[#C5A059] uppercase tracking-tighter hover:underline block pt-1"
                          >
                            Detala bax
                          </button>
                        </div>
                        <button 
                          onClick={() => toggleWishlist(product.id)}
                          className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
                      <Heart size={40} className="mx-auto text-gray-100 mb-4" />
                      <p className="text-gray-400 font-serif italic">Bəyəndiyiniz məhsul yoxdur</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* SƏBƏT */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-[#C5A059]">
                    <ShoppingCart size={20} />
                  </div>
                  <h2 className="text-xl font-serif">Alış-veriş Səbəti</h2>
                </div>
                <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                  {cartItems.length} Element
                </span>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.length > 0 ? (
                    <>
                      <div className="max-h-[60vh] overflow-y-auto no-scrollbar pr-2 space-y-4">
                        {cartItems.map((item) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            key={`${item.id}-${item.selectedColor?.name || 'default'}-${item.selectedSize?.size}`}
                            className="bg-white p-5 rounded-[2.5rem] flex items-center gap-6 shadow-sm border border-gray-50"
                          >
                            <div className="w-28 h-36 rounded-[1.8rem] overflow-hidden border border-gray-100 flex-shrink-0">
                              <img 
                                src={item.selectedColor?.mainImage || item.mainImage || "/placeholder.jpg"} 
                                className="w-full h-full object-cover" 
                                alt={item.name} 
                              />
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-serif text-lg text-slate-900 leading-tight">{item.name}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                  {item.selectedColor?.name || "Rəng seçilməyib"} • {item.selectedSize?.size || item.selectedSize} sm
                                </p>
                              </div>
                              
                              <div className="flex items-center bg-gray-50 w-fit rounded-xl px-2 py-1 border border-gray-100">
                                <button onClick={() => updateQuantity(item.id, item.selectedColor?.name, item.selectedSize?.size, item.quantity - 1)} className="p-1.5 text-slate-400 hover:text-[#C5A059]"><Minus size={14} strokeWidth={3} /></button>
                                <span className="w-10 text-center font-black text-sm text-slate-900">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.selectedColor?.name, item.selectedSize?.size, item.quantity + 1)} className="p-1.5 text-slate-400 hover:text-[#C5A059]"><Plus size={14} strokeWidth={3} /></button>
                              </div>
                            </div>

                            <div className="text-right flex flex-col justify-between h-36 py-2">
                              <button onClick={() => removeFromCart(item.id, item.selectedColor?.name, item.selectedSize?.size)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                              <p className="font-black text-xl text-slate-900">
                                {((item.selectedSize?.price || item.selectedColor?.price || item.price || 0) * item.quantity).toFixed(2)} ₼
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div layout className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-end border-b border-gray-50 pb-6">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">Ümumi Məbləğ</p>
                            <h3 className="text-4xl font-black text-slate-900">{subtotal.toFixed(2)} <span className="text-[#C5A059] italic text-2xl ml-1">₼</span></h3>
                          </div>
                          <div className="text-green-500 text-[10px] font-black bg-green-50 px-3 py-1 rounded-full uppercase">Ödənişə hazırdır</div>
                        </div>
                        <button 
                          onClick={handleCheckout}
                          className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#C5A059] transition-all flex items-center justify-center gap-3 group"
                        >
                          Sifarişi təsdiqlə <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <div className="bg-white p-20 rounded-[3rem] border border-gray-50 flex flex-col items-center justify-center text-center space-y-6">
                      <ShoppingBag size={40} className="text-gray-200" />
                      <p className="text-slate-900 font-serif text-xl italic">Səbətiniz hələ ki, boşdur</p>
                      <button onClick={() => navigate('/shop')} className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059]">Alış-verişə başla</button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* LEAD MODAL */}
      <AnimatePresence>
  {isLeadModalOpen && (
    <LeadModal 
      isOpen={isLeadModalOpen} 
      onClose={() => {
        setIsLeadModalOpen(false);
        setIsSuccess(false);
      }}
      onConfirm={handleConfirmOrder}
      isSuccess={isSuccess}   
    />
  )}
</AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-black text-white py-6 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
            <div className="flex gap-5 justify-center md:justify-start">
              <Instagram size={20} className="text-gray-400 hover:text-[#C5A059] cursor-pointer" />
              <MessageCircle size={20} className="text-gray-400 hover:text-[#C5A059] cursor-pointer" />
              <Music2 size={20} className="text-gray-400 hover:text-[#C5A059] cursor-pointer" />
            </div>
            <div className="text-center">
              <h3 className="font-serif italic text-3xl text-[#C5A059]">Properde</h3>
              <p className="text-[8px] tracking-[0.5em] text-gray-600 uppercase mt-1 italic"> By Premium Tekstil</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="flex items-center gap-3">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400">Xəritədə bax</p>
                    <p className="text-[10px] italic font-serif text-gray-600">Bəhruz Nuriyev 322, Bakı</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#C5A059]/20 transition-all">
                    <MapPin size={18} className="text-[#C5A059]" />
                  </div>
                </a>
              </div>
            </div>
          </div>
          <p className="text-center mt-8 text-[7px] text-gray-800 tracking-[0.3em] uppercase">© 2026 PROPERDE ART STUDIO. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default BasketAndFavorite;