import React from 'react';

// Şəkillərin importu
import dest1 from '../assets/dest/dest1.jpg';
import dest2 from '../assets/dest/dest2.jpg';
import dest3 from '../assets/dest/dest3.jpg';

import tul1 from '../assets/tul/tul1.jpg';
import tul2 from '../assets/tul/tul2.jpg';
import tul3 from '../assets/tul/tul3.jpg';

import jaluz1 from '../assets/jaluz/jaluz1.jpg';
import jaluz2 from '../assets/jaluz/jaluz2.jpg';
import jaluz3 from '../assets/jaluz/jaluz3.jpg';

import korniz1 from '../assets/korniz/korniz1.jpg';
import korniz2 from '../assets/korniz/korniz2.jpg';
import korniz3 from '../assets/korniz/korniz3.jpg';

import aksesuar1 from '../assets/aksesuar/aksesuar1.jpg';
import aksesuar2 from '../assets/aksesuar/aksesuar2.jpg';
import aksesuar3 from '../assets/aksesuar/aksesuar3.jpg';

import guneslik1 from '../assets/guneslik/guneslik1.jpg';
import guneslik2 from '../assets/guneslik/guneslik2.jpg';
import guneslik3 from '../assets/guneslik/guneslik3.jpg';

const categories = [
  { title: "Dəst Pərdələr", images: [dest1, dest2, dest3] },
  { title: "Tüllər", images: [tul1, tul2, tul3] },
  { title: "Jalüzlər", images: [jaluz1, jaluz2, jaluz3] },
  { title: "Kornizlər", images: [korniz1, korniz2, korniz3] },
  { title: "Aksesuarlar", images: [aksesuar1, aksesuar2, aksesuar3] },
  { title: "Günəşliklər", images: [guneslik1, guneslik2, guneslik3] },
];

const CategoryGrid = () => {
  return (
    <div className="w-full py-10 bg-white">
      {/* Başlıq */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 uppercase">  Kateqoriyalar
        </h2>
        <div className="h-0.5 w-16 bg-[#C5A059] mx-auto mt-2" />
      </div>

      {/* grid-cols-1: Mobildə alt-alta (1-1-1)
          sm:grid-cols-2: 640px-dən yuxarı (2-2-2)
          md:grid-cols-3: 768px-dən yuxarı (3-3)
          lg:grid-cols-6: 1024px-dən yuxarı (Hamısı yan-yana)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-6">
        
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col group w-full">
            
            {/* Kartın Daxili Karuseli */}
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 bg-white">
              
              {/* Daxili Sürüşmə (Şəkillər) */}
              <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">
                {cat.images.map((img, index) => (
                  <div key={index} className="min-w-full h-full snap-center">
                    <img
                      src={img}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* DAXİLİ NÖQTƏLƏR (Qara və Boz, Böyük) */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 pointer-events-none bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                {cat.images.map((_, dotIdx) => (
                  <div 
                    key={dotIdx} 
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      dotIdx === 0 ? 'bg-black scale-110' : 'bg-gray-400'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Yazı Hissəsi */}
            <div className="mt-5 text-center px-4">
              <h3 className="text-[12px] md:text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-[#C5A059] transition-colors leading-tight">
                {cat.title}
              </h3>
              <div className="h-[1.5px] w-0 bg-[#C5A059] mx-auto mt-2 transition-all duration-500 group-hover:w-12" />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;