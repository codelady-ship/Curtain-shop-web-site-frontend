import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-6 last:border-0">
      <button 
        type="button" 
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }} 
        className="flex justify-between items-center w-full group focus:outline-none"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 group-hover:text-[#C5A059] transition-colors">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-gray-400"><ChevronDown size={16} /></motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-2 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSidebar = ({ selectedCategory, onCategoryChange, selectedColor, onColorChange, selectedRooms = [], onRoomChange }) => {
  const categories = ["Hamısı", "Dəst pərdələr", "Fonluqlar", "Günəşliklər", "Tüllər", "Jalüzlər", "Kornizlər", "Aksesuarlar"];
  const rooms = ["Qonaq otağı", "Yataq otağı", "Mətbəx", "Ofis", "Uşaq otağı"];
  const colors = [
    { name: 'Ağ', code: '#FFFFFF' }, { name: 'Bej', code: '#F5F5DC' },
    { name: 'Boz', code: '#808080' }, { name: 'Qara', code: '#000000' },
    { name: 'Qızılı', code: '#D4AF37' }, { name: 'Göy', code: '#0000FF' }
  ];

  const handleRoomToggle = (room) => {
    const nextRooms = selectedRooms.includes(room) ? selectedRooms.filter(r => r !== room) : [...selectedRooms, room];
    onRoomChange?.(nextRooms);
  };

  return (
    <aside className="w-full bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50">
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
        <div className="p-3.5 bg-black text-white rounded-2xl shadow-xl shadow-black/10"><SlidersHorizontal size={20} /></div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Filtrlə</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Seçiminizi daraldın</p>
        </div>
      </div>

      <FilterSection title="Kateqoriyalar" defaultOpen={true}>
        <div className="space-y-1">
          {categories.map(cat => (
            <button key={cat} type="button" onClick={() => onCategoryChange?.(cat)}
              className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl transition-all ${selectedCategory === cat ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">{cat}</span>
              {selectedCategory === cat && <Check size={14} strokeWidth={4} className="text-[#C5A059]" />}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rəng Aralığı" defaultOpen={false}>
        <div className="grid grid-cols-5 gap-3 pt-2">
          {colors.map(color => (
            <button key={color.name} type="button" onClick={() => onColorChange?.(color.name === selectedColor ? null : color.name)}
              className={`group relative w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color.name ? 'border-[#C5A059] scale-110' : 'border-gray-100 hover:border-gray-300'}`}
              style={{ backgroundColor: color.code }}
            >
              {selectedColor === color.name && <Check size={12} strokeWidth={4} className={color.name === 'Ağ' ? 'text-black' : 'text-white'} />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* OTAQ FİLTRİ - ARTIQ SUSMAYA GÖRƏ BAĞLIDIR */}
      <FilterSection title="Otaq növü" defaultOpen={false}>
        <div className="space-y-1">
          {rooms.map(room => (
            <div key={room} onClick={() => handleRoomToggle(room)} className="flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all group">
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${selectedRooms.includes(room) ? 'bg-black border-black' : 'border-gray-200'}`}>
                {selectedRooms.includes(room) && <Check className="text-white" size={12} strokeWidth={4} />}
              </div>
              <span className={`text-[12px] font-bold uppercase tracking-wider ${selectedRooms.includes(room) ? 'text-black' : 'text-gray-500'}`}>{room}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <motion.button 
        type="button" 
        onClick={() => { onCategoryChange("Hamısı"); onColorChange(null); onRoomChange([]); }} 
        whileHover={{ scale: 1.01 }} 
        whileTap={{ scale: 0.99 }}
        className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:border-black hover:text-black transition-all"
      > 
        Seçimləri sıfırla 
      </motion.button>
    </aside>
  );
};

export default FilterSidebar;