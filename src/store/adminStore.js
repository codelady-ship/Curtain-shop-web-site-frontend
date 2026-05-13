import { create } from "zustand";
import { createProductApi, extractList, getAllProducts, normalizeProduct } from "../utils/services";

const useAdminStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  activeTab: "dashboard",
  activeFilter: "ALL",
  editingProduct: null,
  deletingProductId: null,
  adminUser: { name: "Properde Admin", role: "Baş Administrator" },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  checkAndReset: () => {},

  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await createProductApi(productData);
      set((state) => ({
        products: [normalizeProduct(response.data), ...state.products],
        loading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: "Əlavə etmə zamanı xəta: " + (error.response?.data?.message || error.message),
        loading: false,
      });
      console.error("Product add error:", error.response?.data || error);
      return false;
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllProducts(0, 500);
      set({ products: extractList(response.data).map(normalizeProduct), loading: false });
    } catch (error) {
      set({
        error: "Məhsulları yükləyərkən xəta: " + (error.response?.data?.message || error.message),
        loading: false,
      });
    }
  },

  openEditModal: (product) => set({ editingProduct: product }),
  closeEditModal: () => set({ editingProduct: null }),
  openDeleteConfirm: (id) => set({ deletingProductId: id }),
  closeDeleteConfirm: () => set({ deletingProductId: null }),
}));

export default useAdminStore;
