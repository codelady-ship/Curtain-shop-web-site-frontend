import { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react'; 
import CategoryGrid from '../components/CategoryGrid';
import FilterSidebar from '../components/FilterSidebar';
import AllModels from '../admin/AllModels'; 
import Pagination from '../components/Pagination'; 
import productsData from '../store/productData.json';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState('Hamısı');
  const [category, setCategory] = useState("Hamısı");
  const [color, setColor] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const productsPerPage = 6; 
  const isInitialRender = useRef(true);

  // --- 1. FİLTRASİYA VƏ SIRALAMA MƏNTİQİ ---
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (category !== 'Hamısı') {
      result = result.filter(p => p.category === category);
    }

    if (color) {
      result = result.filter(p => p.colors?.some(c => c.name === color));
    }

    if (rooms.length > 0) {
      result = result.filter(p => rooms.includes(p.room));
    }

    // Sıralama məntiqi
    if (activeSort === 'Endirim') {
      result = result.filter(p => p.status === 'ENDİRİM');
    } else if (activeSort === 'Populyar') {
      result = result.filter(p => p.rating >= 4.5);
    } else if (activeSort === 'Ucuzdan bahaya') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (activeSort === 'Bahadan ucuza') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [searchTerm, activeSort, category, color, rooms]);

  // --- 2. PAGINATION HESABLAMASI ---
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  // Filtr dəyişəndə 1-ci səhifəyə qayıt
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [category, color, rooms, searchTerm, activeSort]);

  return (
    <div className="bg-[#f9f9f9] min-h-screen pb-20 pt-24 overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        <CategoryGrid />

        <div className="text-center mb-16 mt-20">
          <div className="flex justify-center items-center gap-4 text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em] mb-4">
            <div className="h-[1px] w-12 bg-[#C5A059]/30" /> Kolleksiya <div className="h-[1px] w-12 bg-[#C5A059]/30" />
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-slate-900 uppercase tracking-tight">Eksklüziv Seçimlər</h2>
        </div>

        {/* Toolbar: Axtarış və Sıralama */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 relative z-20">
          <div className="relative w-full lg:w-1/3 flex gap-3">
            <input 
              type="text" 
              placeholder="Axtar..." 
              className="flex-grow pl-6 pr-4 py-3.5 bg-gray-50 rounded-2xl outline-none text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden p-4 bg-black text-white rounded-2xl">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 w-full lg:w-auto">
            {['Hamısı', 'Populyar', 'Endirim', 'Ucuzdan bahaya', 'Bahadan ucuza'].map(sort => (
              <button
                key={sort}
                onClick={() => setActiveSort(sort)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeSort === sort ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-32">
              <FilterSidebar 
                selectedCategory={category} onCategoryChange={setCategory}
                selectedColor={color} onColorChange={setColor}
                selectedRooms={rooms} onRoomChange={setRooms}
              />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <main className="w-full lg:w-3/4 flex flex-col">
            <div className="min-h-[600px]">
              {currentProducts.length > 0 ? (
                /* Burada AllModels istifadə olunur. 
                   isAdmin={false} olduğu üçün düymə "Səbətə at" olacaq.
                */
                <AllModels isAdmin={false} products={currentProducts} />
              ) : (
                <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed text-gray-400 italic">
                  Axtarışınıza uyğun məhsul tapılmadı.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination 
                  totalPages={totalPages} 
                  currentPage={currentPage} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobil Filter Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <div onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" />
            <div className="fixed inset-y-0 left-0 w-[300px] bg-white z-[101] p-6 overflow-y-auto rounded-r-[2rem]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif">Filtrlər</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button>
              </div>
              <FilterSidebar 
                selectedCategory={category} onCategoryChange={setCategory}
                selectedColor={color} onColorChange={setColor}
                selectedRooms={rooms} onRoomChange={setRooms}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;