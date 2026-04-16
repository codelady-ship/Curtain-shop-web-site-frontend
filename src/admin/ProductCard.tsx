import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const ProductCard = ({ product, formatPrice, onEdit, onDelete, onDetail }: any) => (
  <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative">
    <div className="relative h-64 overflow-hidden">
      <img src={product.colors?.[0]?.mainImage || product.colors?.[0]?.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
        <button onClick={onEdit} className="p-3 bg-white text-[#0A1128] rounded-2xl shadow-xl hover:bg-[#0A1128] hover:text-white transition-all"><Edit3 size={18}/></button>
        <button onClick={onDelete} className="p-3 bg-white text-rose-500 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18}/></button>
      </div>
      <button onClick={onDetail} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-xl text-xs font-black shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">DETALLI BAXIŞ</button>
    </div>
    <div className="p-6">
      <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">{product.category}</p>
      <h3 className="text-lg font-black text-[#0A1128] line-clamp-1">{product.name}</h3>
      <p className="text-xl font-black text-[#0A1128] mt-4">{formatPrice(product.sizeOptions?.[0]?.price || product.price)}</p>
    </div>
  </div>
);
export default ProductCard;