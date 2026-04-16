import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import useAdminStore from '../store/adminStore';

// Komponentlərin importu
import ProductCard from './ProductCard';
import Pagination from '../components/Pagination';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import ProductDetailModal from './AdminCardDetailPage';

const AllModels = () => {
  const { products, deleteProduct, updateProduct } = useAdminStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Hamısı');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const formatPrice = (price: any) => Number(price).toFixed(2) + " AZN";

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'Hamısı' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* BAŞLIQ VƏ SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <h2 className="text-xl font-black text-[#0A1128]">Model sayı: <span className="text-[#C5A059] ml-2">({filteredProducts.length})</span></h2>
        <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Axtar..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] focus:border-[#C5A059] outline-none font-medium"
              value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] focus:border-[#C5A059] outline-none appearance-none font-bold text-[#0A1128] cursor-pointer"
              value={categoryFilter} onChange={(e) => {setCategoryFilter(e.target.value); setCurrentPage(1);}}
            >
              <option value="Hamısı">Bütün Kateqoriyalar</option>
              <option value="Tüllər">Tüllər</option>
              <option value="Aksesuarlar">Aksesuarlar</option>
              <option value="Kornizlər">Kornizlər</option>
              <option value="Fonluqlar">Fonluqlar</option>
              <option value="Jalüzlər">Jalüzlər</option>
              <option value="Günəşliklər">Günəşliklər</option>
            </select>
          </div>
        </div>
      </div>

      {/* QRİD VƏ KARTLAR */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              formatPrice={formatPrice}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => setDeletingId(product.id)}
              onDetail={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 font-bold text-slate-400">Model tapılmadı.</div>
      )}

      {/* PAGINATION CALL */}
      <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />

      {/* MODALLARIN ÇAĞIRILMASI */}
      {deletingId && (
        <DeleteModal 
          onConfirm={() => { deleteProduct(deletingId); setDeletingId(null); }}
          onCancel={() => setDeletingId(null)}
        />
      )}

      {editingProduct && (
        <EditModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onSave={(updated: any) => { updateProduct(updated); setEditingProduct(null); }} 
        />
      )}

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          formatPrice={formatPrice}
          onClose={() => setSelectedProduct(null)}
           
        />
      )}
    </div>
  );
};

export default AllModels;