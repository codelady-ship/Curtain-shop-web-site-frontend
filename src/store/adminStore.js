import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import productsData from './productData.json';

const useAdminStore = create(
  persist(
    (set) => ({
      activeTab: 'dashboard',
      activeFilter: 'ALL',
      adminUser: { name: 'Properde Admin', role: 'Baş Administrator' },
      // Başlanğıcda JSON-dan yükləyirik, lakin persist bunu yaddaşdakı ilə əvəzləyəcək
      products: productsData, 
      editingProduct: null,
      deletingProductId: null,

      setActiveTab: (tab) => set({ activeTab: tab }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      openEditModal: (product) => set({ editingProduct: product }),
      closeEditModal: () => set({ editingProduct: null }),
      openDeleteConfirm: (id) => set({ deletingProductId: id }),
      closeDeleteConfirm: () => set({ deletingProductId: null }),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addProduct: (product) =>
        set((state) => {
          const mainPrice = product.sizeOptions?.[0]?.price || product.price || 0;
          const oldPrice = product.sizeOptions?.[0]?.oldPrice || product.oldPrice || null;
          
          const newProduct = { 
            ...product, 
            id: crypto.randomUUID(), // Saniyədə minlərlə unikal ID yaradır
            price: Number(mainPrice),
            oldPrice: oldPrice ? Number(oldPrice) : null,
            createdAt: new Date().toISOString() 
          };

          return {
            products: [newProduct, ...state.products]
          };
        }),

      updateProduct: (updatedProduct) =>
        set((state) => {
          const mainPrice = updatedProduct.sizeOptions?.[0]?.price || updatedProduct.price || 0;
          const oldPrice = updatedProduct.sizeOptions?.[0]?.oldPrice || updatedProduct.oldPrice || null;
          
          return {
            products: state.products.map((p) => 
              p.id === updatedProduct.id 
                ? { ...updatedProduct, price: Number(mainPrice), oldPrice: oldPrice ? Number(oldPrice) : null } 
                : p
            ),
            editingProduct: null
          };
        }),
    }),
    {
      name: 'properde-system-v1',
      // Datanın tamlığını təmin etmək üçün
      partialize: (state) => ({
        products: state.products,
        activeTab: state.activeTab,
        activeFilter: state.activeFilter
      }),
      // LocalStorage-dan yüklənərkən xətaların qarşısını alır
      onRehydrateStorage: () => (state) => {
        console.log('Sistem datası bərpa olundu');
      }
    }
  )
);

export default useAdminStore;