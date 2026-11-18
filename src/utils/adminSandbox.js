// In-browser sandbox for the public "Demo admin" when the Spring Boot API cannot be reached
// (sleeping/cold Render instance, offline, or no API URL in the build).
// Every admin request is answered here from a copy of the bundled demo data
// (productData.json + the admin stat labels in adminPanelData.js + fictional leads/banners).
// Changes live only in this browser tab (sessionStorage) and disappear when the tab closes.
import demoProducts from "../store/productData.json";
import { stats as demoStatCards } from "../store/adminPanelData.js";

const STATE_KEY = "perde_admin_sandbox_v1";
const MODE_KEY = "perde_admin_mode";
export const SANDBOX_TOKEN = "demo-sandbox";

export const DEMO_USER = {
  id: 0,
  username: "demo",
  name: "Demo Admin",
  role: "Demo (yalnız baxış)",
  email: "",
  phone: "",
  demo: true,
  sandbox: true,
};

const safeStorage = (kind) => {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export const isSandboxSession = () => safeStorage("local")?.getItem(MODE_KEY) === "sandbox";

export const startSandboxSession = () => {
  const local = safeStorage("local");
  local?.setItem(MODE_KEY, "sandbox");
  local?.setItem("token", SANDBOX_TOKEN);
  local?.setItem("adminUser", JSON.stringify(DEMO_USER));
  return DEMO_USER;
};

export const endSandboxSession = () => {
  safeStorage("local")?.removeItem(MODE_KEY);
  safeStorage("session")?.removeItem(STATE_KEY);
};

const LEAD_SOURCES = ["ORDER", "DISCOUNT", "VISUAL", "MEASURE", "HEART"];
const LEAD_STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "PROMO_SENT", "COMPLETED"];
const REFERRERS = ["INSTAGRAM", "WHATSAPP", "FACEBOOK", "GOOGLE", "TIKTOK"];
// Fictional customers: the sandbox never contains real people's data.
const DEMO_NAMES = [
  "Nərmin Q.", "Elvin M.", "Aytən H.", "Rauf S.", "Günel Ə.", "Orxan B.",
  "Səbinə K.", "Tural İ.", "Leyla N.", "Kamran R.", "Fidan Z.", "Murad T.",
];

const daysAgo = (days, hour = 11) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

const productLine = (product, quantity = 1) => {
  const size = product.sizeOptions?.[0] || {};
  const color = product.colors?.[0] || {};
  return `${product.name} | ID: ${product.id} | ${color.name || "Standart"} | ${size.size || "Standart"} | ${quantity} ədəd | ${size.price || 0} ₼`;
};

const seedLeads = () =>
  DEMO_NAMES.map((name, index) => {
    const source = LEAD_SOURCES[index % LEAD_SOURCES.length];
    const product = demoProducts[index % demoProducts.length];
    const createdAt = daysAgo(index * 2, 9 + (index % 8));
    const requested = source === "ORDER" ? [productLine(product, 1 + (index % 2))] : [];
    return {
      id: 1000 + index,
      fullName: name,
      name,
      phone: `+994 50 000 00 ${String(index + 1).padStart(2, "0")}`,
      email: "",
      message: source === "MEASURE" ? "Ölçü alımı üçün zəng edin (demo)" : "",
      referrer: REFERRERS[index % REFERRERS.length],
      source,
      status: LEAD_STATUSES[index % LEAD_STATUSES.length],
      contacted: index % 3 === 1,
      promoCode: source === "DISCOUNT" ? `DEMO${10 + index}` : "",
      requestedProducts: requested.join("\n"),
      likedProductsSummary: source === "HEART" ? productLine(product) : "",
      likedProductLinks: "",
      totalAmount: source === "ORDER" ? Number(product.sizeOptions?.[0]?.price || 0) * (1 + (index % 2)) : 0,
      visualizationImageUrl: source === "VISUAL" ? product.colors?.[0]?.mainImage || "" : "",
      createdAt,
      updatedAt: createdAt,
      deleted: false,
    };
  });

const seedBanners = () => [
  {
    id: 1,
    titleAz: "Yeni ilə 20% endirim",
    titleRu: "Скидка 20% к Новому году",
    titleEn: "20% New Year discount",
    descriptionAz: "Bütün tül modellərinə endirim (demo kampaniya).",
    descriptionRu: "Скидка на все модели тюля (демо).",
    descriptionEn: "Discount on all tulle models (demo campaign).",
    buttonTextAz: "Kataloqa bax",
    buttonTextRu: "Смотреть каталог",
    buttonTextEn: "View catalog",
    linkUrl: "#shop",
    desktopImageUrl: demoProducts[0]?.colors?.[0]?.mainImage || "",
    mobileImageUrl: "",
    placement: "MAIN",
    visualType: "IMAGE",
    active: true,
    sortOrder: 100,
  },
  {
    id: 2,
    titleAz: "Blackout fonluqlar",
    titleRu: "Блэкаут шторы",
    titleEn: "Blackout curtains",
    descriptionAz: "Yataq otağı üçün tam qaranlıq (demo kampaniya).",
    descriptionRu: "Полная темнота для спальни (демо).",
    descriptionEn: "Full darkness for the bedroom (demo campaign).",
    buttonTextAz: "Bax",
    buttonTextRu: "Смотреть",
    buttonTextEn: "View",
    linkUrl: "#shop",
    desktopImageUrl: demoProducts[1]?.colors?.[0]?.mainImage || "",
    mobileImageUrl: "",
    placement: "MAIN",
    visualType: "IMAGE",
    active: false,
    sortOrder: 110,
  },
];

const seedState = () => ({
  products: JSON.parse(JSON.stringify(demoProducts)),
  leads: seedLeads(),
  banners: seedBanners(),
  partners: [],
  profile: { ...DEMO_USER },
  nextId: 5000,
});

let memoryState = null;

const loadState = () => {
  if (memoryState) return memoryState;
  try {
    const saved = safeStorage("session")?.getItem(STATE_KEY);
    memoryState = saved ? JSON.parse(saved) : seedState();
  } catch {
    memoryState = seedState();
  }
  return memoryState;
};

const saveState = () => {
  try {
    safeStorage("session")?.setItem(STATE_KEY, JSON.stringify(memoryState));
  } catch {
    // Storage full or blocked: the sandbox still works in memory for this page view.
  }
};

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

const lowestPrice = (product) => {
  const prices = (product.sizeOptions || []).map((o) => Number(o.price)).filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : 0;
};

const filterProducts = (items, params = {}) => {
  const search = String(params.search || "").trim().toLowerCase();
  let list = items.filter((p) => {
    if (search && !`${p.name} ${p.description}`.toLowerCase().includes(search)) return false;
    if (params.category && p.category !== params.category) return false;
    if (params.room && p.room !== params.room) return false;
    if (params.inDiscount !== undefined && Boolean(p.isDiscount) !== (String(params.inDiscount) === "true")) return false;
    return true;
  });
  const sort = String(params.sortType || "newest").toLowerCase();
  if (sort === "oldest") list = list.sort((a, b) => a.id - b.id);
  else if (sort === "name") list = list.sort((a, b) => String(a.name).localeCompare(String(b.name), "az"));
  else if (["cheap", "price_asc", "priceasc"].includes(sort)) list = list.sort((a, b) => lowestPrice(a) - lowestPrice(b));
  else if (["expensive", "price_desc", "pricedesc"].includes(sort)) list = list.sort((a, b) => lowestPrice(b) - lowestPrice(a));
  else list = list.sort((a, b) => b.id - a.id);
  return list;
};

const parseBody = async (data) => {
  if (!data) return {};
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    const product = data.get("product") || data.get("data");
    const image = data.get("image");
    let body = {};
    if (product && typeof product.text === "function") body = JSON.parse(await product.text());
    else if (typeof product === "string") body = JSON.parse(product);
    if (image && typeof image === "object" && typeof URL !== "undefined") {
      // Object URLs die with the tab, like the rest of the sandbox.
      body.imageUrl = URL.createObjectURL(image);
    }
    return body;
  }
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
};

const dashboard = (state) => {
  const leads = state.leads.filter((l) => !l.deleted);
  const today = new Date();
  const weeklyVisits = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const key = day.toISOString().slice(0, 10);
    return {
      dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
      date: key,
      ziyaret: 40 + ((i * 37) % 55),
      sifaris: leads.filter((l) => String(l.createdAt).slice(0, 10) === key).length,
    };
  });
  const yearlyStats = Array.from({ length: 12 }, (_, m) => ({
    month: new Date(today.getFullYear(), m, 1).toLocaleDateString("en-US", { month: "short" }),
    ziyaret: m <= today.getMonth() ? 600 + ((m * 173) % 900) : 0,
    sifaris: leads.filter((l) => new Date(l.createdAt).getMonth() === m && new Date(l.createdAt).getFullYear() === today.getFullYear()).length,
  }));
  const bySource = (source) => leads.filter((l) => l.source === source).length;
  return {
    monthlyOrders: leads.filter((l) => new Date(l.createdAt).getMonth() === today.getMonth()).length,
    weeklyVisits,
    yearlyStats,
    totalLeads: leads.length,
    totalOrders: bySource("ORDER"),
    promoRequests: bySource("DISCOUNT"),
    visualizationRequests: bySource("VISUAL"),
    measurementRequests: bySource("MEASURE"),
    wishlistRequests: bySource("HEART"),
  };
};

const leadStats = (state) => {
  const leads = state.leads.filter((l) => !l.deleted);
  const idFor = (id) => (id === "ORDERS" ? "ORDER" : id);
  return demoStatCards.map((card) => {
    const id = idFor(card.id);
    return { id, label: card.label, value: id === "ALL" ? leads.length : leads.filter((l) => l.source === id).length };
  });
};

const ok = (data, status = 200) => ({ data, status });
const notFound = () => ({ data: { message: "Tapılmadı (demo)" }, status: 404 });
const demoForbidden = (message = "Demo rejimi: bu əməliyyat demoda mümkün deyil.") => ({
  data: { message, demo: true },
  status: 403,
});

const crud = async (state, listKey, method, id, body) => {
  const list = state[listKey];
  if (method === "post") {
    const item = { ...body, id: state.nextId++ };
    list.unshift(item);
    return ok(item);
  }
  const index = list.findIndex((item) => String(item.id) === String(id));
  if (index < 0) return notFound();
  if (method === "put" || method === "patch") {
    list[index] = { ...list[index], ...body, id: list[index].id };
    return ok(list[index]);
  }
  if (method === "delete") {
    list.splice(index, 1);
    return { data: null, status: 204 };
  }
  return null;
};

// Returns { data, status } for every request the admin UI makes.
export const handleSandboxRequest = async (config = {}) => {
  const state = loadState();
  const method = String(config.method || "get").toLowerCase();
  const path = String(config.url || "").split("?")[0].replace(/\/+$/, "") || "/";
  const params = config.params || {};
  const body = method === "get" ? {} : await parseBody(config.data);
  let match;

  const result = await (async () => {
    // Public site endpoints (the admin's "all models" list and product pages).
    if (method === "get" && path === "/products/all") return ok(page(filterProducts(state.products, {}), params));
    if (method === "get" && path === "/products/filter") return ok(page(filterProducts(state.products, params), params));
    if (method === "get" && (match = path.match(/^\/products\/([^/]+)$/))) {
      const product = state.products.find((p) => String(p.id) === match[1]);
      return product ? ok(product) : notFound();
    }
    if (method === "post" && (path === "/analytics/hit" || path === "/leads/submit")) return ok({ demo: true });

    // Dashboard and leads.
    if (method === "get" && path === "/analytics/dashboard") return ok(dashboard(state));
    if (method === "get" && path === "/leads/stats") return ok(leadStats(state));
    if (method === "get" && path === "/leads") {
      const source = String(params.source || "ALL").toUpperCase();
      return ok(state.leads.filter((l) => !l.deleted && (source === "ALL" || l.source === source)));
    }
    if ((match = path.match(/^\/leads\/(\d+)\/(status|contacted|promo|soft-delete)$/))) {
      const lead = state.leads.find((l) => String(l.id) === match[1]);
      if (!lead) return notFound();
      if (match[2] === "status") lead.status = params.status ?? body.status ?? lead.status;
      if (match[2] === "contacted") lead.contacted = String(params.contacted ?? body.contacted) === "true";
      if (match[2] === "promo") {
        lead.promoCode = params.promoCode ?? body.promoCode ?? lead.promoCode;
        lead.message = params.message ?? body.message ?? lead.message;
      }
      if (match[2] === "soft-delete") lead.deleted = true;
      lead.updatedAt = new Date().toISOString();
      return match[2] === "soft-delete" ? { data: null, status: 204 } : ok(lead);
    }

    // Products.
    if (method === "get" && path === "/admin/products") return ok(state.products);
    if (method === "post" && (path === "/admin/products" || path === "/admin/products/upload")) {
      return crud(state, "products", "post", null, { isPopular: false, isDiscount: false, ...body });
    }
    if ((match = path.match(/^\/admin\/products\/([^/]+)$/))) return crud(state, "products", method, match[1], body);

    // Banners and partners.
    if (method === "get" && path === "/banners") return ok(state.banners.filter((b) => b.active));
    if (method === "get" && path === "/partners") return ok(state.partners);
    if (path === "/admin/banners" || path === "/admin/partners") {
      const key = path.endsWith("banners") ? "banners" : "partners";
      return method === "get" ? ok(state[key]) : crud(state, key, method, null, body);
    }
    if ((match = path.match(/^\/admin\/(banners|partners)\/([^/]+)$/))) return crud(state, match[1], method, match[2], body);

    // Admin profile: editable in the sandbox, password never changes.
    if (path === "/admin/auth/profile") {
      if (method === "get") return ok(state.profile);
      state.profile = { ...state.profile, ...body, username: "demo", demo: true };
      return ok(state.profile);
    }
    if (path === "/admin/auth/change-password") return demoForbidden("Demo rejimi: demo hesabın şifrəsi dəyişdirilmir.");
    if (path === "/admin/auth/forgot-password" || path === "/admin/auth/reset-password") {
      return demoForbidden("Demo rejimi: şifrə bərpası yalnız real admin üçündür.");
    }
    return null;
  })();

  if (method !== "get") saveState();
  return result || { data: { message: "Bu əməliyyat demo rejimində yoxdur." }, status: 404 };
};

// axios adapter: resolves 2xx, rejects other statuses like axios does.
export const sandboxAdapter = async (config) => {
  const { data, status } = await handleSandboxRequest(config);
  const response = { data, status, statusText: String(status), headers: { "content-type": "application/json" }, config, request: {} };
  if (status >= 200 && status < 300) return response;
  const error = new Error(data?.message || `Request failed with status code ${status}`);
  error.config = config;
  error.response = response;
  error.isAxiosError = true;
  throw error;
};
