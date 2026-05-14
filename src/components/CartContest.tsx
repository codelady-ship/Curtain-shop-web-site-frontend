import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext<any>(null);

// Yalnız vacib məlumatları saxlayan funksiyalar
const colorNameOf = (item: any) => item?.selectedColor?.name || item?.selectedColor?.colorName || "Standart";
const sizeValueOf = (item: any) => item?.selectedSize?.size || item?.selectedSize?.sizeValue || "Standart";

// CartProvider komponenti
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // localStorage-dan məlumatları oxumaq, sadəcə əsas məlumatları saxlayırıq
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
    [cartItems],
  );

  // localStorage-ı yeniləmək
  useEffect(() => {
    const sanitizedCartItems = cartItems.map(normalizeCartItem); // Yalnız vacib məlumatları saxlayırıq
    localStorage.setItem("cart", JSON.stringify(sanitizedCartItems)); // cart məlumatlarını saxlayırıq
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); // wishlist məlumatlarını saxlayırıq
  }, [wishlist]);

  // Məlumatları sadələşdiririk (yalnız vacib məlumatları saxlayırıq)
  const normalizeCartItem = (item: any) => {
    const selectedColor = item?.selectedColor || {
      name: "Standart",
      colorName: "Standart",
    };

    const selectedSize = item?.selectedSize || {
      size: "Standart",
      sizeValue: "Standart",
      price: item?.price || 0,
    };

    const price = selectedSize?.price ?? selectedColor?.price ?? item?.price;

    return {
      id: item?.id,
      name: item?.name,
      price,
      quantity: Number(item?.quantity || 1),
      selectedColor: {
        name: selectedColor.name,
        colorName: selectedColor.colorName,
      },
      selectedSize: {
        size: selectedSize.size,
        sizeValue: selectedSize.sizeValue,
        price,
      },
    };
  };

  // Sebətə məhsul əlavə etmək
  const addToCart = (product: any) => {
    if (!product || !product.id) return;

    const selectedColor = product.selectedColor || product.colors?.[0] || {
      name: "Standart",
      colorName: "Standart",
      code: "#cccccc",
    };

    const selectedSize = product.selectedSize || product.sizeOptions?.[0] || {
      size: "Standart",
      sizeValue: "Standart",
      price: product.price || 0,
    };

    const normalizedProduct = {
      ...product,
      selectedColor: {
        ...selectedColor,
        name: selectedColor.name || selectedColor.colorName || "Standart",
        colorName: selectedColor.colorName || selectedColor.name || "Standart",
      },
      selectedSize: {
        ...selectedSize,
        size: selectedSize.size || selectedSize.sizeValue || "Standart",
        sizeValue: selectedSize.sizeValue || selectedSize.size || "Standart",
      },
      quantity: Number(product.quantity || 1),
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          Number(item?.id) === Number(normalizedProduct.id) &&
          colorNameOf(item) === colorNameOf(normalizedProduct) &&
          sizeValueOf(item) === sizeValueOf(normalizedProduct),
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: Number(newCart[existingIndex].quantity || 0) + normalizedProduct.quantity,
        };
        return newCart;
      }

      return [...prev, normalizedProduct];
    });
  };

  // Miqdarı yeniləmək
  const updateQuantity = (
    id: number,
    colorName: string,
    sizeValue: string,
    newQty: number,
  ) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        Number(item?.id) === Number(id) &&
          colorNameOf(item) === colorName &&
          sizeValueOf(item) === sizeValue
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  };

  // Sebətdən məhsul silmək
  const removeFromCart = (id: number, colorName: string, sizeValue: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            Number(item?.id) === Number(id) &&
            colorNameOf(item) === colorName &&
            sizeValueOf(item) === sizeValue
          ),
      ),
    );
  };

  // Sebəti təmizləmək
  const clearCart = () => setCartItems([]);

  // Wishlist-i dəyişdirmək
  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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

// useCart Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart CartProvider daxilində olmalıdır!");
  return context;
};