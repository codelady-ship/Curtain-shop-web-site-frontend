import React, { useCallback, useEffect, useMemo, useState } from "react";
import { deleteProductApi, fetchFilteredProductsApi, getAllProducts, updateProductApi } from "../utils/services";
import { extractList, normalizeProduct } from "../utils/productMapper";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import { Search, Loader2, Plus } from "lucide-react";
import useAdminStore from "../store/adminStore";
import { getLang, t } from "../utils/i18n";

interface AllModelsProps {
  isAdmin?: boolean;
  products?: any[];
  showSearch?: boolean;
  pageSize?: number;
}

const normalizeText = (value: any) => String(value || "").trim().toLowerCase();

const AllModels = ({ isAdmin = false, products: externalProducts, showSearch = true, pageSize = 8 }: AllModelsProps) => {
  const isControlledMode = Array.isArray(externalProducts);
  const setActiveTab = useAdminStore((state: any) => state.setActiveTab);

  const [lang, setLang] = useState(getLang());
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isControlledMode);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [clientPage, setClientPage] = useState(1);

  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const handler = (event: any) => setLang(event.detail || getLang());
    window.addEventListener("perde:language", handler);
    return () => window.removeEventListener("perde:language", handler);
  }, []);

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

  useEffect(() => {
    setClientPage(1);
  }, [externalProducts?.length, search]);

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

  const controlledTotalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const pagedProducts = isControlledMode
    ? visibleProducts.slice((clientPage - 1) * pageSize, clientPage * pageSize)
    : visibleProducts;

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
    <div className="w-full pb-20">
      {(showSearch || isAdmin) && <div className="mb-12 flex flex-col items-center gap-4 xl:flex-row">
        {showSearch && <div className="relative w-full flex-1">
          <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A059]" size={18} />
          <input
            type="text"
            placeholder={t("searchPlaceholder", lang)}
            className="w-full rounded-2xl border border-gray-100 bg-white py-4 pl-14 outline-none transition focus:ring-2 focus:ring-[#C5A059]/30 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>}

        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab("add-model")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 font-bold text-white transition-all hover:bg-[#C5A059] xl:w-auto"
          >
            <Plus size={20} /> Yeni Model
          </button>
        )}
      </div>}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C5A059]" size={40} /></div>
      ) : pagedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {pagedProducts.map((p) => (
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
        <div className="py-20 text-center text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">{t("noProducts", lang)}</div>
      )}

      {isControlledMode && controlledTotalPages > 1 && (
        <Pagination currentPage={clientPage} totalPages={controlledTotalPages} onPageChange={(p: number) => setClientPage(p)} />
      )}

      {!isControlledMode && totalPages > 1 && (
        <Pagination currentPage={currentPage + 1} totalPages={totalPages} onPageChange={(p: number) => setCurrentPage(p - 1)} />
      )}

      {isEditOpen && selectedProduct && <EditModal product={selectedProduct} onClose={() => setIsEditOpen(false)} onSave={handleUpdate} />}
      {isDeleteOpen && selectedProduct && <DeleteModal onConfirm={handleDelete} onCancel={() => { setIsDeleteOpen(false); setSelectedProduct(null); }} />}
      {actionLoading && <div className="fixed inset-0 z-[100001] flex items-center justify-center bg-white/40 backdrop-blur-sm"><Loader2 className="animate-spin text-[#C5A059]" size={44} /></div>}
    </div>
  );
};

export default AllModels;
