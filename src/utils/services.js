import api from "./api.js";

const normalizeBackendOrigin = (value) => {
  const cleaned = String(value || "").trim().replace(/\s+/g, "").replace(/\/+$/g, "");
  if (!cleaned || cleaned === "/") return "";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return "";
};

const BACKEND_ORIGIN = normalizeBackendOrigin(import.meta.env.VITE_BACKEND_ORIGIN);

export const getAllProducts = (page = 0, size = 10) => {
  return api.get("/products/all", {
    params: { page, size },
  });
};

export const fetchProducts = () => api.get("/products/all", { params: { page: 0, size: 500 } });

export const getProductById = (id) => api.get(`/products/${id}`);

export const deleteProductApi = (id) => api.delete(`/admin/products/${id}`);

export const updateProductApi = (id, productData) => api.put(`/admin/products/${id}`, productData);

export const createProductApi = (productData = {}) => {
  const imageFile = productData.imageFile || productData.primaryImageFile;
  const hasImageFile = typeof File !== "undefined" && imageFile instanceof File;

  const { imageFile: _imageFile, primaryImageFile: _primaryImageFile, ...payload } = productData;

  if (hasImageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("product", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    return api.post("/admin/products/upload", formData);
  }

  return api.post("/admin/products", payload);
};

export const createProductWithImage = (productData, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));

  return api.post("/admin/products/upload", formData);
};

export const fetchFilteredProductsApi = (params = {}) => {
  return api.get("/products/filter", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 10,
      search: params.search || undefined,
      category: params.category || undefined,
      room: params.room || undefined,
      inDiscount: params.inDiscount ?? undefined,
      sortType: params.sortType || "newest",
    },
  });
};

export const trackSiteVisit = () => api.post("/analytics/hit", null, { headers: { "X-Page-Path": typeof window !== "undefined" ? window.location.pathname + window.location.search : "/" } });
export const getDashboardData = () => api.get("/analytics/dashboard");
export const getLeadStats = () => api.get("/leads/stats");

export const submitLead = (data = {}) => {
  if (data instanceof FormData) {
    return api.post("/leads/submit", data);
  }

  const hasImageFile = typeof File !== "undefined" && data?.image instanceof File;
  if (hasImageFile) {
    const formData = new FormData();
    const { image, ...payload } = data;
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    formData.append("image", image);
    return api.post("/leads/submit", formData);
  }

  return api.post("/leads/submit", data);
};

export const getLeads = (params = {}) => api.get("/leads", { params });
export const updateLeadStatus = (id, status) => api.patch(`/leads/${id}/status`, null, { params: { status } });
export const updateLeadContacted = (id, contacted) => api.patch(`/leads/${id}/contacted`, null, { params: { contacted } });
export const updateLeadPromo = (id, promoCode, message) => api.patch(`/leads/${id}/promo`, { promoCode, message });
export const getLeadsBySource = (source) => api.get("/leads", { params: { source } });

export const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";

  const trimmed = image.trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const withoutLeadingSlash = trimmed.replace(/^\/+/, "");
  const normalizedPath = withoutLeadingSlash.startsWith("uploads/")
    ? `/${withoutLeadingSlash}`
    : `/uploads/${withoutLeadingSlash}`;

  return `${BACKEND_ORIGIN}${normalizedPath}`;
};

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const toNumber = (...values) => {
  const value = firstValue(...values);
  const numberValue = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export const extractList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

export const sameProductId = (left, right) => String(left ?? "") === String(right ?? "");

const productUrl = (id) => {
  if (!id) return "";
  if (typeof window === "undefined" || !window.location?.origin) {
    return `/product/${id}`;
  }
  return `${window.location.origin}/product/${id}`;
};

const productName = (item = {}) => firstValue(item.name, item.productName, item.modelName, item.title, item.id ? `Məhsul ID: ${item.id}` : "Adsız Məhsul");

const selectedColorName = (item = {}) =>
  firstValue(item.selectedColor?.colorName, item.selectedColor?.name, item.colorName, item.color, "Standart");

const selectedSizeValue = (item = {}) =>
  firstValue(item.selectedSize?.sizeValue, item.selectedSize?.size, item.sizeValue, item.size, "Standart");

const selectedPrice = (item = {}) => toNumber(item.selectedSize?.price, item.selectedColor?.price, item.price);

export const resolveWishlistProducts = (wishlist = [], products = []) => {
  const productList = Array.isArray(products) ? products : [];
  const wishlistIds = Array.isArray(wishlist) ? wishlist : [];

  return wishlistIds.map((id) => {
    const match = productList.find((product) => sameProductId(product?.id, id));
    return match || { id, name: `Məhsul ID: ${id}` };
  });
};

export const buildRequestedProducts = (cartItems = []) => {
  if (!Array.isArray(cartItems)) return [];

  return cartItems
    .filter((item) => item && item.id)
    .map((item) => {
      const quantity = Number(item.quantity || 1);
      const price = selectedPrice(item);
      return `${productName(item)} | ID: ${item.id} | ${selectedColorName(item)} | ${selectedSizeValue(item)} | ${quantity} ədəd | ${price} ₼`;
    });
};

export const buildLikedProducts = (wishlistProducts = []) => {
  if (!Array.isArray(wishlistProducts)) return [];

  return wishlistProducts
    .filter((item) => item && item.id)
    .map((item) => `${productName(item)} | ID: ${item.id}`);
};

export const buildLikedProductLinks = (wishlistProducts = []) => {
  if (!Array.isArray(wishlistProducts)) return [];

  return wishlistProducts
    .filter((item) => item && item.id)
    .map((item) => productUrl(item.id))
    .filter(Boolean);
};

export const calculateCartTotal = (cartItems = []) => {
  if (!Array.isArray(cartItems)) return 0;

  return cartItems.reduce((sum, item) => {
    const quantity = Number(item?.quantity || 1);
    return sum + selectedPrice(item) * quantity;
  }, 0);
};

export const buildLeadSelectionPayload = ({ cartItems = [], wishlist = [], products = [] } = {}) => {
  const normalizedProducts = Array.isArray(products) ? products : [];
  const wishlistProducts = resolveWishlistProducts(wishlist, normalizedProducts);

  return {
    requestedProducts: buildRequestedProducts(cartItems),
    likedProducts: buildLikedProducts(wishlistProducts),
    likedProductLinks: buildLikedProductLinks(wishlistProducts),
    totalAmount: calculateCartTotal(cartItems),
  };
};

export const normalizeProduct = (product = {}) => {
  const rawColors = Array.isArray(product.colors) ? product.colors : [];
  const rawSizes = Array.isArray(product.sizeOptions)
    ? product.sizeOptions
    : Array.isArray(product.sizes)
      ? product.sizes
      : [];

  const firstColor = rawColors[0] || {};
  const firstSize = rawSizes[0] || {};

  const image = firstValue(
    product.imageUrl,
    product.image,
    product.mainImage,
    product.photo,
    product.photoUrl,
    product.imagePath,
    product.filePath,
    product.coverImage,
    product.thumbnail,
    firstColor.mainImage,
    firstColor.image,
    firstColor.imageUrl,
    Array.isArray(firstColor.images) ? firstColor.images[0] : undefined,
    Array.isArray(product.images) ? product.images[0] : undefined,
  );

  const price = toNumber(firstSize.price, product.price, product.modelPrice, product.productPrice, product.salePrice, product.amount);
  const oldPrice = toNumber(firstSize.oldPrice, product.oldPrice, product.discountPrice, product.previousPrice);

  const normalizedColors = rawColors.map((color) => {
    const colorImage = firstValue(color.mainImage, color.image, color.imageUrl, Array.isArray(color.images) ? color.images[0] : undefined, image);
    return {
      ...color,
      name: firstValue(color.name, color.colorName, "Standart"),
      colorName: firstValue(color.colorName, color.name, "Standart"),
      code: firstValue(color.code, color.hex, color.colorCode, color.colorHex, "#cccccc"),
      colorCode: firstValue(color.colorCode, color.code, color.hex, color.colorHex, "#cccccc"),
      mainImage: getImageUrl(colorImage),
      imageUrl: getImageUrl(colorImage),
      images: Array.isArray(color.images) ? color.images.map((img) => getImageUrl(img)).filter(Boolean) : colorImage ? [getImageUrl(colorImage)] : [],
    };
  });

  const normalizedSizes = rawSizes.length > 0
    ? rawSizes.map((size) => ({
      ...size,
      size: firstValue(size.size, size.sizeValue, size.name, size.label, "Standart"),
      sizeValue: firstValue(size.sizeValue, size.size, size.name, size.label, "Standart"),
      price: toNumber(size.price, product.price, product.modelPrice),
      oldPrice: toNumber(size.oldPrice, product.oldPrice),
    }))
    : [{ size: "Standart", sizeValue: "Standart", price, oldPrice }];

  return {
    ...product,
    id: firstValue(product.id, product.productId, product.modelId),
    name: firstValue(product.name, product.productName, product.modelName, product.title, "Adsız Məhsul"),
    description: firstValue(product.description, product.desc, ""),
    category: firstValue(product.category, product.categoryType, product.categoryName, ""),
    room: firstValue(product.room, product.roomType, ""),
    partType: firstValue(product.partType, product.fabric, ""),
    status: firstValue(product.status, product.productStatus, product.isDiscount ? "Endirimli" : product.isPopular ? "Popular" : "Standart"),
    rating: toNumber(product.rating, 5),
    price,
    oldPrice,
    image: getImageUrl(image),
    imageUrl: getImageUrl(image),
    colors: normalizedColors,
    sizeOptions: normalizedSizes,
  };
};


export const getAdminProfile = () => api.get("/admin/auth/profile");
export const updateAdminProfile = (payload) => api.put("/admin/auth/profile", payload);
export const forgotAdminPassword = (payload) => api.post("/admin/auth/forgot-password", payload);
export const resetAdminPassword = (payload) => api.post("/admin/auth/reset-password", payload);

export const adminLogin = (password, username = "admin") => api.post("/admin/auth/login", { username, password });
export const changeAdminPassword = (currentPassword, newPassword) => api.post("/admin/auth/change-password", { currentPassword, newPassword });

export const getBanners = (activeOnly = true) => api.get("/banners", { params: { activeOnly } });
export const getAdminBanners = () => api.get("/admin/banners");
export const createBanner = (payload) => api.post("/admin/banners", payload);
export const updateBanner = (id, payload) => api.put(`/admin/banners/${id}`, payload);
export const deleteBanner = (id) => api.delete(`/admin/banners/${id}`);

export const getPartners = (activeOnly = true) => api.get("/partners", { params: { activeOnly } });
export const getAdminPartners = () => api.get("/admin/partners");
export const createPartner = (payload) => api.post("/admin/partners", payload);
export const updatePartner = (id, payload) => api.put(`/admin/partners/${id}`, payload);
export const deletePartner = (id) => api.delete(`/admin/partners/${id}`);

export const softDeleteLead = (id) => api.delete(`/leads/${id}/soft-delete`);
