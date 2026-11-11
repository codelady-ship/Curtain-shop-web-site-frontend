// Demo data for when the Spring Boot backend is not reachable
// (e.g. the static GitHub Pages build). Only public product reads are served;
// everything else (admin, leads, analytics) still needs the real backend.
import demoProducts from "../store/productData.json";

const page = (items, params = {}) => {
  const size = Math.max(1, Number(params.size ?? 10));
  const number = Math.max(0, Number(params.page ?? 0));
  return {
    content: items.slice(number * size, number * size + size),
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
    number,
    size,
  };
};

const matches = (product, params = {}) => {
  const search = String(params.search || "").trim().toLowerCase();
  if (search && !`${product.name} ${product.description}`.toLowerCase().includes(search)) return false;
  if (params.category && product.category !== params.category) return false;
  if (params.room && product.room !== params.room) return false;
  if (params.inDiscount !== undefined && Boolean(product.isDiscount) !== (String(params.inDiscount) === "true")) return false;
  return true;
};

// Returns { data } for a GET the demo can answer, otherwise null.
export const getDemoResponse = (config = {}) => {
  if (String(config.method || "get").toLowerCase() !== "get") return null;
  const path = String(config.url || "").split("?")[0];
  const params = config.params || {};

  if (path === "/products/all") return { data: page(demoProducts, params) };
  if (path === "/products/filter") return { data: page(demoProducts.filter((p) => matches(p, params)), params) };

  const byId = path.match(/^\/products\/([^/]+)$/);
  if (byId) {
    const product = demoProducts.find((p) => String(p.id) === byId[1]);
    return product ? { data: product } : null;
  }
  return null;
};

// True when the request never reached a JSON API: network error, or a static host's HTML 404 page.
export const isBackendUnavailable = (error) => {
  const response = error?.response;
  if (!response) return true;
  const contentType = String(response.headers?.["content-type"] || "");
  return !contentType.includes("json");
};
