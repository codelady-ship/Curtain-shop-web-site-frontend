export const DEFAULT_PRODUCT_CATEGORIES = [
  "Dəst Pərdələr",
  "Kornizlər",
  "Günəşliklər",
  "Fonluqlar",
  "Tüllər",
  "Jalüzlər",
  "Aksesuarlar",
  "Pastellər",
];

export const DEFAULT_PRODUCT_STATUSES = ["Popular", "Yeni", "Endirimli", "Standart"];

const STORAGE_KEYS = {
  categories: "properde_product_categories",
  statuses: "properde_product_statuses",
};

const uniqueList = (items = []) => {
  const normalized = [];
  items.forEach((item) => {
    const value = String(item || "").trim();
    if (!value) return;
    const exists = normalized.some((existing) => existing.toLocaleLowerCase("az-AZ") === value.toLocaleLowerCase("az-AZ"));
    if (!exists) normalized.push(value);
  });
  return normalized;
};

export const loadOptionList = (defaults = [], key = "") => {
  const storageKey = STORAGE_KEYS[key] || key || "";
  if (typeof window === "undefined" || !storageKey) return uniqueList(defaults);

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return uniqueList([...defaults, ...(Array.isArray(saved) ? saved : [])]);
  } catch {
    return uniqueList(defaults);
  }
};

export const saveCustomOption = (key, value) => {
  const storageKey = STORAGE_KEYS[key] || key || "";
  const option = String(value || "").trim();
  if (!option) return "";

  if (typeof window === "undefined" || !storageKey) return option;

  const defaults = key === "categories" ? DEFAULT_PRODUCT_CATEGORIES : DEFAULT_PRODUCT_STATUSES;
  const current = loadOptionList(defaults, key);
  const next = uniqueList([...current, option]);
  const customOnly = next.filter(
    (item) => !defaults.some((defaultItem) => defaultItem.toLocaleLowerCase("az-AZ") === item.toLocaleLowerCase("az-AZ")),
  );
  window.localStorage.setItem(storageKey, JSON.stringify(customOnly));
  return option;
};
