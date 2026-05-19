import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext<any>(null);

const colorNameOf = (item: any) => item?.selectedColor?.name || item?.selectedColor?.colorName || "Standart";
const sizeValueOf = (item: any) => item?.selectedSize?.size || item?.selectedSize?.sizeValue || "Standart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Cart items state
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.id) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item?.quantity || 0), 0),
    [cartItems]
  );

  // Minimal cart verisi ile LocalStorage güncelle
  useEffect(() => {
    try {
      const minimalCart = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.imageUrl || item.image || "",
        selectedColor: { name: item.selectedColor?.name || "Standart" },
        selectedSize: { size: item.selectedSize?.size || "Standart" },
      }));
      localStorage.setItem("cart", JSON.stringify(minimalCart));
    } catch (e) {
      console.error("LocalStorage quota exceeded", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("LocalStorage wishlist quota exceeded", e);
    }
  }, [wishlist]);

  const addToCart = (product: any) => {
    if (!product || !product.id) return;

    const normalizedProduct = {
      ...product,
      quantity: Number(product.quantity || 1),
      selectedColor: product.selectedColor || { name: "Standart" },
      selectedSize: product.selectedSize || { size: "Standart", price: product.price || 0 },
    };

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item =>
          Number(item.id) === Number(normalizedProduct.id) &&
          colorNameOf(item) === colorNameOf(normalizedProduct) &&
          sizeValueOf(item) === sizeValueOf(normalizedProduct)
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + normalizedProduct.quantity,
        };
        return newCart;
      }

      return [...prev, normalizedProduct];
    });
  };

  const updateQuantity = (id: number, colorName: string, sizeValue: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        Number(item.id) === Number(id) &&
          colorNameOf(item) === colorName &&
          sizeValueOf(item) === sizeValue
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (id: number, colorName: string, sizeValue: string) => {
    setCartItems(prev =>
      prev.filter(
        item =>
          !(Number(item.id) === Number(id) &&
            colorNameOf(item) === colorName &&
            sizeValueOf(item) === sizeValue)
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (id: number) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart CartProvider içinde olmalıdır!");
  return context;
};