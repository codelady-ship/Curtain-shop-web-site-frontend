import React from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart, Eye, Edit3, Trash2 } from "lucide-react";
import { useCart } from "../components/CartContest";
import { Link } from "react-router-dom";
import { normalizeProduct } from "../utils/productMapper"; // normalizeProduct funksiyasını import edirik

interface ProductCardProps {
  product: any;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductCard = ({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const item = normalizeProduct(product); // Normalizə edilmiş məhsul

  const isFavorite = wishlist.includes(item.id);

  const defaultColor = item.colors?.[0] || {
    name: "Standart",
    image: item.image,
    mainImage: item.image,
    code: "#cccccc",
  };

  const defaultSize = item.sizeOptions?.[0] || {
    size: "Standart",
    price: item.price,
    oldPrice: item.oldPrice,
  };

  const currentPrice = Number(defaultSize.price || item.price || 0);
  const oldPrice = Number(defaultSize.oldPrice || item.oldPrice || 0);

  const imageSrc =
    defaultColor.mainImage ||
    defaultColor.image ||
    item.imageUrl ||
    item.image ||
    "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      ...item,
      selectedColor: defaultColor,
      selectedSize: defaultSize,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] p-4 relative group transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] mb-5 rounded-[2rem] overflow-hidden bg-gray-50">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector(".image-fallback")) {
                const fallback = document.createElement("div");
                fallback.className = "image-fallback w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold uppercase";
                fallback.innerText = "Şəkil yoxdur";
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold uppercase">
            Şəkil yoxdur
          </div>
        )}

        {isAdmin ? (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-3 bg-white text-slate-900 rounded-2xl shadow-xl hover:bg-black hover:text-white transition-all"
            >
              <Edit3 size={18} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-3 bg-white text-red-500 rounded-2xl shadow-xl hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
            <Link
              to={`/product/${item.id}`}
              className="bg-white p-4 rounded-full hover:bg-[#C5A059] hover:text-white transition-colors shadow-xl"
            >
              <Eye size={20} />
            </Link>
          </div>
        )}
      </div>

      <div className="px-2 flex-grow space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-slate-800 text-[13px] uppercase line-clamp-2">
            {item.name}
          </h4>

          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
            <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
            <span className="text-[10px] font-bold">{item.rating || 5}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-slate-900">
            {currentPrice.toFixed(2)} ₼
          </span>

          {oldPrice > currentPrice && (
            <span className="text-xs text-gray-400 line-through">
              {oldPrice.toFixed(2)} ₼
            </span>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all"
          >
            <ShoppingBag size={16} /> Səbətə At
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(item.id);
            }}
            className={`p-4 border rounded-2xl transition-all ${isFavorite
                ? "bg-red-50 text-red-500 border-red-200"
                : "text-gray-400 border-gray-100"
              }`}
          >
            <Heart size={20} className={isFavorite ? "fill-current" : ""} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
