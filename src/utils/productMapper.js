import api from "./api.js";

export const getAllProducts = (page = 0, size = 10) => {
  return api.get("/products/all", {
    params: { page, size },
  });
};

export const fetchProducts = () => api.get("/products/all", { params: { page: 0, size: 500 } });

export const getProductById = (id) => api.get(`/products/${id}`);

export const deleteProductApi = (id) => api.delete(`/products/${id}`);

export const updateProductApi = (id, productData) => api.put(`/products/${id}`, productData);

export const createProductApi = (productData) => api.post("/products", productData);

export const createProductWithImage = (productData, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));

  return api.post("/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

export const trackSiteVisit = () => api.post("/analytics/hit");
export const getDashboardData = () => api.get("/analytics/dashboard");

export const submitLead = (data = {}) => {
  if (data.image instanceof File) {
    const formData = new FormData();
    const { image, ...payload } = data;
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    formData.append("image", image);
    return api.post("/leads/submit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post("/leads/submit", data);
};

export const getLeads = (params = {}) => api.get("/leads", { params });
export const updateLeadStatus = (id, status) => api.patch(`/leads/${id}/status`, null, { params: { status } });
export const updateLeadContacted = (id, contacted) => api.patch(`/leads/${id}/contacted`, null, { params: { contacted } });
export const updateLeadPromo = (id, promoCode) => api.patch(`/leads/${id}/promo`, null, { params: { promoCode } });
export const getLeadsBySource = (source) => api.get("/leads", { params: { source } });

const BACKEND_URL = "http://localhost:8080";

export const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image !== "string") return "";
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image;
  }
  return `${BACKEND_URL}${image.startsWith("/") ? image : `/${image}`}`;
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
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.items)) return data.items;
  return [];
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
      images: Array.isArray(color.images) ? color.images.map((img) => getImageUrl(img)) : colorImage ? [getImageUrl(colorImage)] : [],
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
    rating: toNumber(product.rating, 5),
    price,
    oldPrice,
    image: getImageUrl(image),
    imageUrl: getImageUrl(image),
    colors: normalizedColors,
    sizeOptions: normalizedSizes,
  };
};
