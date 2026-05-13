import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AnyObject = Record<string, any>;

type CartContextValue = {
  cartItems: AnyObject[];
  cart: AnyObject[];
  wishlist: any[];
  addToCart: (item: AnyObject) => void;
  removeFromCart: (keyOrId: any) => void;
  updateQuantity: (keyOrId: any, quantity: number) => void;
  increaseQuantity: (keyOrId: any) => void;
  decreaseQuantity: (keyOrId: any) => void;
  clearCart: () => void;
  toggleWishlist: (productId: any) => void;
  isInWishlist: (productId: any) => boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = "cart";
const WISHLIST_KEY = "wishlist";
const MAX_CART_ITEMS = 50;

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function isHeavyImage(value: any): boolean {
  return typeof value === "string" && value.startsWith("data:image") && value.length > 512;
}

function compactImage(value: any): string {
  if (typeof value !== "string") return "";
  return isHeavyImage(value) ? "" : value;
}

function compactProduct(product: AnyObject = {}): AnyObject {
  const firstColor = product?.colors?.[0] || {};
  const firstSize = product?.sizeOptions?.[0] || {};

  return {
    id: product?.id,
    name: product?.name,
    category: product?.category,
    room: product?.room,
    partType: product?.partType,
    rating: product?.rating,
    price: product?.price ?? firstSize?.price ?? 0,
    oldPrice: product?.oldPrice ?? firstSize?.oldPrice ?? null,
    imageUrl: compactImage(
      product?.imageUrl ||
      product?.image ||
      product?.mainImage ||
      firstColor?.imageUrl ||
      firstColor?.mainImage ||
      firstColor?.image,
    ),
  };
}

function compactColor(color: AnyObject = {}): AnyObject {
  return {
    id: color?.id,
    name: color?.name || color?.colorName || "Standart",
    colorName: color?.colorName || color?.name || "Standart",
    code: color?.code || color?.colorCode || color?.colorHex || color?.hex || "#cccccc",
    colorCode: color?.colorCode || color?.code || color?.colorHex || color?.hex || "#cccccc",
    colorHex: color?.colorHex || color?.colorCode || color?.code || color?.hex || "#cccccc",
    imageUrl: compactImage(color?.imageUrl || color?.mainImage || color?.image),
    image: compactImage(color?.image || color?.imageUrl || color?.mainImage),
    mainImage: compactImage(color?.mainImage || color?.imageUrl || color?.image),
  };
}

function compactSize(size: AnyObject = {}): AnyObject {
  return {
    id: size?.id,
    size: size?.size || size?.sizeValue || "Standart",
    sizeValue: size?.sizeValue || size?.size || "Standart",
    price: Number(size?.price ?? 0),
    oldPrice: size?.oldPrice ?? null,
  };
}

function buildStorageItem(input: AnyObject): AnyObject {
  const product = input?.product ? input.product : input;
  const selectedColor = input?.selectedColor || product?.selectedColor || product?.colors?.[0] || {};
  const selectedSize = input?.selectedSize || product?.selectedSize || product?.sizeOptions?.[0] || {};
  const compact = compactProduct(product);
  const color = compactColor(selectedColor);
  const size = compactSize(selectedSize);
  const quantity = Math.max(1, Number(input?.quantity ?? product?.quantity ?? 1));

  const key = [compact.id, color.colorHex || color.colorCode || color.code, size.sizeValue || size.size]
    .filter(Boolean)
    .join("_");

  return {
    ...compact,
    key: key || String(Date.now()),
    selectedColor: color,
    selectedSize: size,
    quantity,
  };
}

function persistSmall(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error: any) {
    if (error?.name !== "QuotaExceededError") throw error;

    // Last-resort recovery: remove heavy images and persist fewer recent items.
    const compacted = Array.isArray(value)
      ? value.slice(-20).map((item) => ({
        ...item,
        imageUrl: "",
        image: "",
        mainImage: "",
        selectedColor: item?.selectedColor
          ? { ...item.selectedColor, imageUrl: "", image: "", mainImage: "" }
          : item?.selectedColor,
      }))
      : value;

    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(compacted));
  }
}

function hydrateCart(): AnyObject[] {
  const stored = safeJsonParse<AnyObject[]>(localStorage.getItem(CART_KEY), []);
  return Array.isArray(stored) ? stored.map(buildStorageItem).slice(-MAX_CART_ITEMS) : [];
}

function hydrateWishlist(): any[] {
  const stored = safeJsonParse<any[]>(localStorage.getItem(WISHLIST_KEY), []);
  return Array.isArray(stored) ? stored : [];
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<AnyObject[]>(hydrateCart);
  const [wishlist, setWishlist] = useState<any[]>(hydrateWishlist);

  useEffect(() => {
    persistSmall(CART_KEY, cartItems.map(buildStorageItem).slice(-MAX_CART_ITEMS));
  }, [cartItems]);

  useEffect(() => {
    persistSmall(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  const addToCart = useCallback((item: AnyObject) => {
    const nextItem = buildStorageItem(item);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((cartItem) => cartItem.key === nextItem.key);
      if (existingIndex >= 0) {
        return prev.map((cartItem, index) =>
          index === existingIndex
            ? { ...cartItem, quantity: Number(cartItem.quantity || 1) + Number(nextItem.quantity || 1) }
            : cartItem,
        );
      }
      return [...prev, nextItem].slice(-MAX_CART_ITEMS);
    });
  }, []);

  const removeFromCart = useCallback((keyOrId: any) => {
    setCartItems((prev) => prev.filter((item) => item.key !== keyOrId && item.id !== keyOrId));
  }, []);

  const updateQuantity = useCallback((keyOrId: any, quantity: number) => {
    const safeQuantity = Math.max(1, Number(quantity || 1));
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === keyOrId || item.id === keyOrId ? { ...item, quantity: safeQuantity } : item,
      ),
    );
  }, []);

  const increaseQuantity = useCallback((keyOrId: any) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === keyOrId || item.id === keyOrId
          ? { ...item, quantity: Number(item.quantity || 1) + 1 }
          : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((keyOrId: any) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === keyOrId || item.id === keyOrId
          ? { ...item, quantity: Math.max(1, Number(item.quantity || 1) - 1) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const toggleWishlist = useCallback((productId: any) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const isInWishlist = useCallback((productId: any) => wishlist.includes(productId), [wishlist]);

  const value = useMemo(
    () => ({
      cartItems,
      cart: cartItems,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
    }),
    [
      cartItems,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
