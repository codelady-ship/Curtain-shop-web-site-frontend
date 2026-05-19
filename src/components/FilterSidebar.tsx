import React, { useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  Check,
  Search,
  SortAsc,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-6 last:border-0">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex justify-between items-center w-full group focus:outline-none"
      >
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 group-hover:text-[#C5A059] transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-400"
        >
          <ChevronDown size={16} />
        </motion.div>
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

const FilterSidebar = ({
  selectedCategory,
  onCategoryChange,
  selectedRooms = [],
  onRoomChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const categories = [
    "Hamısı",
    "Dəst pərdələr",
    "Fonluqlar",
    "Günəşliklər",
    "Tüllər",
    "Jalüzlər",
    "Kornizlər",
    "Aksesuarlar",
    "Pastellər",
  ];
  const rooms = ["Qonaq otağı", "Yataq otağı", "Mətbəx", "Ofis", "Uşaq otağı"];

  const handleRoomToggle = (room) => {
    const nextRooms = selectedRooms.includes(room)
      ? selectedRooms.filter((r) => r !== room)
      : [...selectedRooms, room];
    onRoomChange?.(nextRooms);
  };

  return (
    <aside className="w-full bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50">
      {/* BAŞLIQ */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="p-3.5 bg-black text-white rounded-2xl shadow-xl shadow-black/10">
          <SlidersHorizontal size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
            Filtrlə
          </h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            İstədiyini tap
          </p>
        </div>
      </div>

      {/* SIRALAMA (YENİ) */}
      <FilterSection title="Sıralama" defaultOpen={true}>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: "popular", label: "Popular olanlar" },
            { id: "cheap", label: "Ucuzdan bahaya" },
            { id: "expensive", label: "Bahadan ucuza" },
            { id: "discount", label: "Endirimdə olanlar" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSortChange(item.id)}
              className={`text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${sortBy === item.id ? "bg-[#C5A059]/10 text-[#C5A059]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* KATEQORİYALAR */}
      <FilterSection title="Kateqoriyalar" defaultOpen={true}>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange?.(cat)}
              className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl transition-all ${selectedCategory === cat ? "bg-black text-white shadow-lg" : "hover:bg-gray-50 text-gray-500"}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {cat}
              </span>
              {selectedCategory === cat && (
                <Check size={14} strokeWidth={4} className="text-[#C5A059]" />
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* OTAQ NÖVÜ */}
      <FilterSection title="Otaq növü" defaultOpen={false}>
        <div className="space-y-1">
          {rooms.map((room) => (
            <div
              key={room}
              onClick={() => handleRoomToggle(room)}
              className="flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all group"
            >
              <div
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${selectedRooms.includes(room) ? "bg-black border-black" : "border-gray-200"}`}
              >
                {selectedRooms.includes(room) && (
                  <Check className="text-white" size={12} strokeWidth={4} />
                )}
              </div>
              <span
                className={`text-[12px] font-bold uppercase tracking-wider ${selectedRooms.includes(room) ? "text-black" : "text-gray-500"}`}
              >
                {room}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* SIFIRLA */}
      <motion.button
        type="button"
        onClick={() => {
          onCategoryChange("Hamısı");
          onRoomChange([]);
          onSearchChange("");
          onSortChange("popular");
        }}
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
