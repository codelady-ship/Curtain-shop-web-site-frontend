import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCart } from '../components/CartContest'; 
import { Link } from 'react-router-dom';

const ProductCard = ({ product }: any) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isFavorite = wishlist.includes(product?.id);  
  
  // 1. Şəkil iyerarxiyası
  const defaultImage = 
    product?.colors?.[0]?.mainImage || 
    (product?.thumbnails && product?.thumbnails[0]) || 
    product?.image;

  // 2. Default Seçimlər (Səbət xətası almamaları üçün mütləqdir)
  const firstSizeOption = product?.sizeOptions?.[0];
  const firstColorOption = product?.colors?.[0];
  
  // Qiymət iyerarxiyası
  const currentPrice = Number(
    firstSizeOption?.price || 
    product?.colors?.[0]?.price || 
    product?.price || 
    0
  );

  const oldPrice = Number(
    firstSizeOption?.oldPrice || 
    product?.colors?.[0]?.oldPrice || 
    product?.oldPrice || 
    0
  );

  const discountPercent = oldPrice > currentPrice
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] p-4 relative group transition-all duration-500 shadow-sm hover:shadow-xl"
    >
      {/* ŞƏKİL HİSSƏSİ */}
      <div className="relative aspect-[3/4] mb-5 rounded-[2rem] overflow-hidden bg-gray-50">
        <img
          src={defaultImage}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Endirim Etiketi */}
        {oldPrice > currentPrice && (
          <div className="absolute top-4 left-4 bg-[#C5A059] text-white text-[11px] font-black px-4 py-2 rounded-full shadow-lg z-10">
            -{discountPercent}%
          </div>
        )}

        {/* Hover zamanı görünən Göz ikonu */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
          <Link 
            to={`/product/${product?.id}`} 
            className="bg-white p-4 rounded-full hover:bg-[#C5A059] hover:text-white transition-colors shadow-xl"
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>

      {/* MƏLUMAT HİSSƏSİ */}
      <div className="px-2 space-y-3 mb-5">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${product?.id}`} className="flex-1">
            <h4 className="font-bold text-slate-800 text-[13px] uppercase line-clamp-2 hover:text-[#C5A059] transition-colors">
              {product?.name || "Adsız Məhsul"}
            </h4>
          </Link>

          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg shrink-0">
            <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
            <span className="text-[10px] font-bold">{product?.rating || 0}</span>
          </div>
        </div>

        {/* Qiymət Bloku */}
        <div className="flex flex-wrap items-baseline gap-2">
          {currentPrice > 0 ? (
            <>
              <span className="text-xl font-black text-slate-900">
                {currentPrice.toFixed(2)} ₼
              </span>
              {oldPrice > currentPrice && (
                <span className="text-sm text-gray-400 line-through font-semibold">
                  {oldPrice.toFixed(2)} ₼
                </span>
              )}
              {firstSizeOption && (
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                    / {firstSizeOption.size}
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] font-bold text-red-400 italic uppercase tracking-widest">
              Qiymət təyin edilməyib
            </span>
          )}
        </div>
      </div>

      {/* DÜYMƏLƏR */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              ...product,
              selectedColor: firstColorOption || { name: "Standart", mainImage: defaultImage },
              selectedSize: firstSizeOption || { size: "Standart", price: currentPrice },
              quantity: 1
            });
          }}
          className="flex-1 bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all"
        >
          <ShoppingBag size={16} /> Səbətə At
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product?.id);
          }}
          className={`p-4 border rounded-2xl transition-all ${
            isFavorite 
              ? 'bg-red-50 text-red-500 border-red-200' 
              : 'text-gray-400 border-gray-100 hover:border-[#C5A059]/30'
          }`}
        >
          <Heart size={20} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;