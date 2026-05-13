import React, { useCallback, useEffect, useMemo, useState } from "react";
import { deleteProductApi, fetchFilteredProductsApi, getAllProducts, updateProductApi } from "../utils/services";
import { extractList, normalizeProduct } from "../utils/productMapper";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import { Search, Loader2, Plus } from "lucide-react";
import useAdminStore from "../store/adminStore";

interface AllModelsProps {
  isAdmin?: boolean;
  products?: any[];
}

const normalizeText = (value: any) => String(value || "").trim().toLowerCase();
const priceOf = (p: any) => Number(p?.sizeOptions?.[0]?.price ?? p?.price ?? 0);

const AllModels = ({ isAdmin = false, products: externalProducts }: AllModelsProps) => {
  const isControlledMode = Array.isArray(externalProducts);
  const setActiveTab = useAdminStore((state: any) => state.setActiveTab);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isControlledMode);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    if (isControlledMode) return;
    setLoading(true);

    try {
      const response = await fetchFilteredProductsApi({
        search: search.trim(),
        page: currentPage,
        size: 12,
      });
      const data = extractList(response.data).map(normalizeProduct);
      setProducts(data);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error("Filter endpoint xətası, /products/all ilə fallback edilir:", err);
      try {
        const fallbackResponse = await getAllProducts(currentPage, 12);
        const fallbackProducts = extractList(fallbackResponse.data).map(normalizeProduct);
        setProducts(fallbackProducts);
        setTotalPages(fallbackResponse.data?.totalPages || 1);
      } catch (fallbackErr) {
        console.error("Yükləmə xətası:", fallbackErr);
        setProducts([]);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  }, [isControlledMode, search, currentPage]);

  useEffect(() => {
    if (isControlledMode) return;
    const timer = setTimeout(() => {
      setCurrentPage(0);
      loadProducts();
    }, 350);
    return () => clearTimeout(timer);
  }, [search, isControlledMode, loadProducts]);

  useEffect(() => {
    if (isControlledMode) return;
    loadProducts();
  }, [currentPage, isControlledMode, loadProducts]);

  const visibleProducts = useMemo(() => {
    const source = isControlledMode ? externalProducts || [] : products;
    let normalized = source.map(normalizeProduct);

    if (search.trim()) {
      const searchValue = normalizeText(search);
      normalized = normalized.filter((p) =>
        normalizeText(p.name).includes(searchValue) ||
        normalizeText(p.description).includes(searchValue) ||
        normalizeText(p.category).includes(searchValue) ||
        normalizeText(p.partType).includes(searchValue),
      );
    }

    return normalized;
  }, [isControlledMode, externalProducts, products, search]);

  const handleUpdate = async (payload: any) => {
    if (!selectedProduct?.id) return;
    setActionLoading(true);
    try {
      await updateProductApi(selectedProduct.id, payload);
      setIsEditOpen(false);
      setSelectedProduct(null);
      await loadProducts();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct?.id) return;
    setActionLoading(true);
    try {
      await deleteProductApi(selectedProduct.id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      await loadProducts();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 pb-20">
      <div className="flex flex-col xl:flex-row gap-4 mb-12 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="MODEL, KATEQORİYA VƏ YA PARÇA NÖVÜ AXTAR..."
            className="w-full bg-white border border-gray-100 rounded-2xl pl-14 py-4 outline-none focus:ring-2 focus:ring-[#C5A059]/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab("add-model")}
            className="w-full xl:w-auto bg-black text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-[#C5A059] transition-all"
          >
            <Plus size={20} /> Yeni Model
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C5A059]" size={40} /></div>
      ) : visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isAdmin={isAdmin}
              onEdit={() => { setSelectedProduct(p); setIsEditOpen(true); }}
              onDelete={() => { setSelectedProduct(p); setIsDeleteOpen(true); }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">Məhsul tapılmadı</div>
      )}

      {!isControlledMode && totalPages > 1 && (
        <div className="mt-10"><Pagination current={currentPage} total={totalPages} onChange={(p) => setCurrentPage(p)} /></div>
      )}

      {isEditOpen && selectedProduct && <EditModal product={selectedProduct} onClose={() => setIsEditOpen(false)} onSave={handleUpdate} />}
      {isDeleteOpen && selectedProduct && <DeleteModal onConfirm={handleDelete} onCancel={() => { setIsDeleteOpen(false); setSelectedProduct(null); }} />}
      {actionLoading && <div className="fixed inset-0 z-[100001] bg-white/40 backdrop-blur-sm flex items-center justify-center"><Loader2 className="animate-spin text-[#C5A059]" size={44} /></div>}
    </div>
  );
};

export default AllModels;