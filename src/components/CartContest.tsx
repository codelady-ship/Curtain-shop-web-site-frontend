import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Xarab dataları (selectedColor və ya name-i olmayanları) filterləyirik
      return Array.isArray(parsed) ? parsed.filter(item => item && item.selectedColor?.name) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: any) => {
    // Əgər gələn datada rəng yoxdursa, funksiyanı dayandırırıq ki, səbət xarab olmasın
    if (!product || !product.selectedColor?.name) return;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item && 
        item.id === product.id && 
        item.selectedColor?.name === product.selectedColor?.name &&
        item.selectedSize?.size === product.selectedSize?.size
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity = (newCart[existingIndex].quantity || 0) + (product.quantity || 1);
        return newCart;
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    setIsCartOpen(true); 
  };

  const updateQuantity = (id: number, colorName: string, sizeValue: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item => 
      (item && item.id === id && item.selectedColor?.name === colorName && item.selectedSize?.size === sizeValue) 
      ? { ...item, quantity: newQty } 
      : item
    ));
  };

  const removeFromCart = (id: number, colorName: string, sizeValue: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item && item.id === id && item.selectedColor?.name === colorName && item.selectedSize?.size === sizeValue)
    ));
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity,
      wishlist, toggleWishlist, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart CartProvider daxilində olmalıdır!");
  return context;
};