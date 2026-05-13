import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryGrid from "../components/CategoryGrid";
import FilterSidebar from "../components/FilterSidebar";
import AllModels from "../components/AllModels";
import { getAllProducts } from "../utils/services";
import { extractList, normalizeProduct } from "../utils/productMapper";

const normalizeText = (value: any) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c");

const CATEGORY_ALIASES: Record<string, string[]> = {
  Hamısı: ["Hamısı", "ALL", ""],
  "Dəst pərdələr": ["Dəst pərdələr", "Dəst Pərdələr", "CURTAINS", "SET_CURTAINS"],
  "Dəst Pərdələr": ["Dəst pərdələr", "Dəst Pərdələr", "CURTAINS", "SET_CURTAINS"],
  Fonluqlar: ["Fonluqlar", "BACKGROUNDS", "BACKDROPS"],
  Günəşliklər: ["Günəşliklər", "SUNSHADES"],
  Tüllər: ["Tüllər", "TULLES"],
  Jalüzlər: ["Jalüzlər", "BLINDS"],
  Kornizlər: ["Kornizlər", "CORNICES"],
  Aksesuarlar: ["Aksesuarlar", "ACCESSORIES"],
};

const getPrice = (product: any) => Number(product?.sizeOptions?.[0]?.price ?? product?.price ?? 0);
const getOldPrice = (product: any) => Number(product?.sizeOptions?.[0]?.oldPrice ?? product?.oldPrice ?? 0);

const categoryMatches = (productCategory: any, selectedCategory: string) => {
  if (!selectedCategory || selectedCategory === "Hamısı") return true;
  const aliases = CATEGORY_ALIASES[selectedCategory] || [selectedCategory];
  const productCategoryText = normalizeText(productCategory);
  return aliases.some((alias) => normalizeText(alias) === productCategoryText);
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || searchParams.get("cat") || "Hamısı";

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const categoryParam = searchParams.get("category") || searchParams.get("cat");
    if (categoryParam) setCategory(categoryParam);
    const searchParam = searchParams.get("search");
    if (searchParam) setSearchTerm(searchParam);
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts(0, 500);
        const products = extractList(res.data).map(normalizeProduct);
        setDbProducts(products);
      } catch (err) {
        console.error("Məlumat gəlmədi:", err);
        setDbProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const next: Record<string, string> = {};
    if (value && value !== "Hamısı") next.category = value;
    if (searchTerm.trim()) next.search = searchTerm.trim();
    setSearchParams(next);
  };

  const filteredProducts = useMemo(() => {
    let result = [...dbProducts];

    if (searchTerm.trim()) {
      const search = normalizeText(searchTerm);
      result = result.filter((p) =>
        normalizeText(p.name).includes(search) ||
        normalizeText(p.description).includes(search) ||
        normalizeText(p.category).includes(search) ||
        normalizeText(p.room).includes(search) ||
        normalizeText(p.partType).includes(search),
      );
    }

    if (category !== "Hamısı") {
      result = result.filter((p) => categoryMatches(p.category, category));
    }

    if (selectedRooms.length > 0) {
      result = result.filter((p) => selectedRooms.some((room) => normalizeText(room) === normalizeText(p.room)));
    }

    if (sortBy === "cheap") result.sort((a, b) => getPrice(a) - getPrice(b));
    if (sortBy === "expensive") result.sort((a, b) => getPrice(b) - getPrice(a));
    if (sortBy === "discount") result = result.filter((p) => getOldPrice(p) > getPrice(p)).sort((a, b) => getOldPrice(b) - getOldPrice(a));
    if (sortBy === "popular") result.sort((a, b) => Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular)));
    if (sortBy === "newest") result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

    return result;
  }, [dbProducts, searchTerm, category, selectedRooms, sortBy]);

  if (loading) {
    return <div className="pt-40 text-center font-serif text-2xl animate-pulse text-[#0A1128]">Kataloq yüklənir...</div>;
  }

  return (
    <div className="bg-[#f9f9f9] min-h-screen pt-24 pb-20" id="shop">
      <div className="container mx-auto px-4">
        <CategoryGrid />
        <div className="flex flex-col lg:flex-row gap-10 mt-20">
          <aside className="lg:w-1/4">
            <FilterSidebar
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
              selectedRooms={selectedRooms}
              onRoomChange={setSelectedRooms}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </aside>
          <main className="lg:w-3/4">
            <AllModels isAdmin={false} products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
