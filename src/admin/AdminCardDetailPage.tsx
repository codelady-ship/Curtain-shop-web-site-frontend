import React, { useState } from 'react';
import { X, Ruler, Layers, ChevronRight, Star, Edit3, Trash2 } from 'lucide-react';
import useAdminStore from '../store/adminStore'; // Store-u import edirik

interface DetailProps {
  product: any;
  onClose: () => void;
  formatPrice: (price: any) => string;
}

const AdminCardDetailPage = ({ product, onClose, formatPrice }: DetailProps) => {
  // Store-dan funksiyaları götürürük
  const openEditModal = useAdminStore((state) => state.openEditModal);
  const openDeleteConfirm = useAdminStore((state) => state.openDeleteConfirm);

  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [activeSizeIdx, setActiveSizeIdx] = useState(0);

  const currentColor = product.colors[activeColorIdx];
  const sizeOptions = product.sizeOptions || product.sizes || [];
  const currentSize = sizeOptions[activeSizeIdx] || { price: 0 };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-10 overflow-hidden">
      {/* Arxa Fon Blur - TAM EKRAN VƏ RESPONSİV */}
      <div 
        className="fixed inset-0 bg-[#0A1128]/90 backdrop-blur-2xl animate-in fade-in duration-300 w-full h-full" 
        onClick={onClose}
      ></div>
      
      {/* Ana Kart - Responsiv hündürlük (max-h-[90vh]) */}
      <div className="bg-white rounded-[3rem] w-full max-w-6xl overflow-hidden relative shadow-2xl flex flex-col lg:flex-row h-full max-h-[90vh] animate-in slide-in-from-bottom-10 duration-500 z-10">
        
        {/* İdarəetmə Düymələri Panel (Edit/Delete/Close) */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          {/* Edit Düyməsi */}
          <button 
            onClick={() => {
              onClose(); // Detal modalını bağla
              openEditModal(product); // Edit modalını aç
            }} 
            className="p-3 bg-white hover:bg-slate-50 text-[#0A1128] rounded-2xl transition-all shadow-md border border-slate-100"
          >
            <Edit3 size={18} />
          </button>
          
          {/* Delete Düyməsi */}
          <button 
            onClick={() => {
              onClose(); // Detal modalını bağla
              openDeleteConfirm(product.id); // Silmə təsdiq modalını aç
            }} 
            className="p-3 bg-white hover:bg-rose-50 text-rose-500 rounded-2xl transition-all shadow-md border border-rose-100"
          >
            <Trash2 size={18} />
          </button>
          
          {/* Bağla Düyməsi */}
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-100 hover:bg-white rounded-2xl transition-all shadow-sm"
          >
            <X size={24} className="text-[#0A1128]" />
          </button>
        </div>
        
        {/* SOL: Dinamik Şəkil Bölməsi */}
        <div className="lg:w-1/2 h-[350px] lg:h-auto relative shrink-0">
          <img 
            src={currentColor.mainImage || currentColor.image || currentColor.preview} 
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" 
            key={activeColorIdx}
            alt={product.name}
          />
        </div>

        {/* SAĞ: Məlumat və Seçimlər - DAXİLİ SCROLL */}
        <div className="lg:w-1/2 p-8 lg:p-14 overflow-y-auto space-y-10 custom-scrollbar">
          <div className="space-y-4 pt-10 lg:pt-0"> {/* Yuxarıdakı düymələrə görə padding */}
            <nav className="flex items-center gap-2 text-[10px] font-black text-[#C5A059] uppercase tracking-widest">
              <span>{product.category}</span>
              <ChevronRight size={12} />
              <span className="text-slate-400">{product.room || product.roomType}</span>
            </nav>
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-4xl font-black text-[#0A1128] leading-tight break-words">{product.name}</h2>
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl text-amber-500 shrink-0">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-sm">{product.rating || '5.0'}</span>
              </div>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">{product.description}</p>
          </div>

          {/* Rəng Palitrası */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-black text-[#0A1128] uppercase">
              <Layers size={16} className="text-[#C5A059]"/>
              <span>Rənglər: {product.colors.length} variant</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {product.colors.map((c: any, i: number) => (
                <button 
                  key={i}
                  onClick={() => setActiveColorIdx(i)}
                  className={`w-14 h-14 rounded-2xl border-4 transition-all transform hover:scale-110 ${activeColorIdx === i ? 'border-[#C5A059] shadow-xl ring-4 ring-[#C5A059]/10' : 'border-slate-100'}`}
                  style={{ backgroundColor: c.code || c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Ölçülər */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-black text-[#0A1128] uppercase">
              <Ruler size={16} className="text-[#C5A059]"/>
              <span>Ölçü və Qiymət Seçimi</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sizeOptions.map((s: any, i: number) => (
                <button 
                  key={i}
                  onClick={() => setActiveSizeIdx(i)}
                  className={`px-4 py-4 rounded-2xl font-bold text-sm transition-all border-2 flex flex-col items-center gap-1 ${activeSizeIdx === i ? 'bg-[#0A1128] border-[#0A1128] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-[#C5A059]/30'}`}
                >
                  <span className="break-all">{s.size}</span>
                  <span className={activeSizeIdx === i ? 'text-white/60 text-[10px]' : 'text-[#C5A059] text-[10px]'}>
                    {formatPrice(s.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Qiymət Paneli */}
          <div className="pt-10 border-t border-slate-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Yekun Məbləğ</p>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-[#0A1128] break-all">{formatPrice(currentSize.price)}</span>
                {currentSize.oldPrice && (
                  <span className="text-2xl text-slate-300 line-through font-bold break-all">{formatPrice(currentSize.oldPrice)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCardDetailPage;