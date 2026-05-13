import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import useAdminStore from "../store/adminStore";
import ConfirmModal from "../components/ConfirmModal";
import {
  CheckCircle2,
  Trash2,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  Layers,
  Palette,
  Ruler,
  Tag,
  Home,
} from "lucide-react";

// Tiplər
type ColorOption = { hex: string; name: string; preview: string | null };
type SizeOption = { size: string; price: string; oldPrice: string };
type Errors = Record<string, string>;

// Sabitlər
const SIZE_REGEX = /^\d{2,4}\s*[xX×]\s*\d{2,4}$/;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const CATEGORY_MAP = [
  { value: "Dəst Pərdələr", label: "Dəst Pərdələr" },
  { value: "Kornizlər", label: "Kornizlər" },
  { value: "Günəşliklər", label: "Günəşliklər" },
  { value: "Fonluqlar", label: "Fonluqlar" },
  { value: "Tüllər", label: "Tüllər" },
  { value: "Jalüzlər", label: "Jalüzlər" },
  { value: "Aksesuarlar", label: "Aksesuarlar" },
];

const AddProduct = () => {
  const addProduct = useAdminStore((state: any) => state.addProduct);
  const setActiveTab = useAdminStore((state: any) => state.setActiveTab);

  // Status & UI States
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dəst Pərdələr");
  const [status, setStatus] = useState("Popular");
  const [room, setRoom] = useState("Qonaq Otağı");
  const [fabric, setFabric] = useState("");

  const [colors, setColors] = useState<ColorOption[]>([
    { hex: "#ffffff", name: "", preview: null },
  ]);
  const [sizes, setSizes] = useState<SizeOption[]>([
    { size: "", price: "", oldPrice: "" },
  ]);

  // Yardımçı Funksiyalar
  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const sanitizePriceInput = (value: string) => {
    let cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
    const parts = cleaned.split(".");
    return parts.length > 2
      ? parts[0] + "." + parts.slice(1).join("")
      : cleaned;
  };

  const toPriceNumber = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Validasiya Məntiqi
  const errors = useMemo(() => {
    const errs: Errors = {};
    if (!name.trim()) errs.name = "Modelin adını daxil edin.";

    sizes.forEach((item, index) => {
      if (!item.size.trim()) errs[`sizes.${index}.size`] = "Ölçü vacibdir.";
      else if (!SIZE_REGEX.test(item.size))
        errs[`sizes.${index}.size`] = "Format: 200x300";

      if (!item.price.trim() || toPriceNumber(item.price) <= 0)
        errs[`sizes.${index}.price`] = "Qiymət düzgün deyil.";
    });

    return errs;
  }, [name, sizes]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (hasErrors) return;
    setShowConfirm(true);
  };
  const confirmSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const productData = {
      name,
      description,
      category,
      room,
      partType: fabric,
      isPopular: status === "Popular",
      isDiscount: status === "Endirimli",
      rating: 5.0,

      // 1. ProductSize Entity üçün (Backend RequestDTO-da ad 'sizeOptions' olmalıdır)
      sizeOptions: sizes.map((s) => ({
        sizeValue: s.size,
        price: toPriceNumber(s.price),
        oldPrice: s.oldPrice ? toPriceNumber(s.oldPrice) : null,
      })),

      // 2. ProductColor Entity üçün (Backend RequestDTO-da ad 'colors' olmalıdır)
      colors: colors.map((c) => ({
        colorName: c.name || "Standart",
        colorCode: c.hex,
        mainImage: c.preview, // Base64 şəkil
      })),
    };

    try {
      const success = await addProduct(productData);
      if (success) {
        setShowConfirm(false);
        setActiveTab("all-models");
      }
    } catch (error) {
      console.error("Göndərmə xətası:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || file.size > MAX_IMAGE_SIZE) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newColors = [...colors];
      newColors[index].preview = reader.result as string;
      setColors(newColors);
    };
    reader.readAsDataURL(file);
  };

  const inputClass = (field: string) => {
    const hasErr = (submitAttempted || touched[field]) && errors[field];
    return `w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium outline-none transition-all duration-300 ${hasErr
        ? "border-red-300 ring-4 ring-red-50 shadow-sm"
        : "border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-50"
      }`;
  };

  return (
    <div className="relative min-h-screen bg-slate-50 px-4 py-10">
      <motion.div
        animate={{ opacity: 1 }}
        className={showConfirm ? "blur-md pointer-events-none" : ""}
      >
        <div className="mx-auto max-w-6xl space-y-7 rounded-[2.5rem] bg-white p-6 md:p-10 shadow-2xl border border-slate-100">
          {/* Əsas Məlumatlar */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 rounded-2xl text-white">
                <Layers size={22} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Model Məlumatları
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Modelin Adı *
                </label>
                <input
                  className={inputClass("name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => markTouched("name")}
                  placeholder="Məs: Modern Zebra"
                />
                {submitAttempted && errors.name && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Kateqoriya
                </label>
                <select
                  className={inputClass("category")}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_MAP.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2 flex items-center gap-1">
                  <Tag size={15} className="text-amber-500" /> Status
                </label>
                <select
                  className={inputClass("status")}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Popular">Popular</option>
                  <option value="Yeni">Yeni</option>
                  <option value="Endirimli">Endirimli</option>
                  <option value="Standart">Standart</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2 flex items-center gap-1">
                  <Home size={15} className="text-blue-500" /> Otaq Seçimi
                </label>
                <select
                  className={inputClass("room")}
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                >
                  <option value="Qonaq Otağı">Qonaq Otağı</option>
                  <option value="Yataq Otağı">Yataq Otağı</option>
                  <option value="Mətbəx">Mətbəx</option>
                  <option value="Uşaq Otağı">Uşaq Otağı</option>
                  <option value="Ofis">Ofis</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Parça Növü
                </label>
                <input
                  className={inputClass("fabric")}
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="Məs: Məxmər"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Təsvir
                </label>
                <textarea
                  className={`${inputClass("description")} min-h-[100px] resize-none`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Məhsul haqqında qısa məlumat..."
                />
              </div>
            </div>
          </section>

          {/* Ölçülər və Qiymətlər */}
          <section className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Ruler size={20} /> Ölçülər və Qiymət
              </h2>
              <button
                type="button"
                onClick={() =>
                  setSizes([...sizes, { size: "", price: "", oldPrice: "" }])
                }
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-amber-600 transition-all shadow-lg"
              >
                + YENİ ÖLÇÜ
              </button>
            </div>
            <div className="space-y-4">
              {sizes.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 items-start bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
                >
                  <div>
                    <input
                      placeholder="Ölçü (200x300)"
                      className={inputClass(`sizes.${i}.size`)}
                      value={s.size}
                      onChange={(e) => {
                        const n = [...sizes];
                        n[i].size = e.target.value;
                        setSizes(n);
                      }}
                    />
                    {submitAttempted && errors[`sizes.${i}.size`] && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        {errors[`sizes.${i}.size`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      placeholder="Qiymət (AZN)"
                      className={inputClass(`sizes.${i}.price`)}
                      value={s.price}
                      onChange={(e) => {
                        const n = [...sizes];
                        n[i].price = sanitizePriceInput(e.target.value);
                        setSizes(n);
                      }}
                    />
                    {submitAttempted && errors[`sizes.${i}.price`] && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">
                        {errors[`sizes.${i}.price`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      placeholder="Köhnə Qiymət"
                      className={inputClass(`sizes.${i}.oldPrice`)}
                      value={s.oldPrice}
                      onChange={(e) => {
                        const n = [...sizes];
                        n[i].oldPrice = sanitizePriceInput(e.target.value);
                        setSizes(n);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={sizes.length === 1}
                    onClick={() =>
                      setSizes(sizes.filter((_, idx) => idx !== i))
                    }
                    className="text-red-400 p-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all disabled:opacity-0"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Rənglər və Şəkillər */}
          <section className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Palette size={20} /> Rənglər və Şəkillər
              </h2>
              <button
                type="button"
                onClick={() =>
                  setColors([
                    ...colors,
                    { hex: "#ffffff", name: "", preview: null },
                  ])
                }
                className="bg-amber-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:bg-slate-900 transition-all"
              >
                + YENİ RƏNG
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
                >
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => {
                      const n = [...colors];
                      n[i].hex = e.target.value;
                      setColors(n);
                    }}
                    className="w-14 h-14 cursor-pointer rounded-lg border-2 border-slate-100"
                  />
                  <div className="flex-1">
                    <input
                      placeholder="Rəng adı..."
                      className={inputClass(`colors.${i}.name`)}
                      value={c.name}
                      onChange={(e) => {
                        const n = [...colors];
                        n[i].name = e.target.value;
                        setColors(n);
                      }}
                    />
                  </div>
                  <label className="cursor-pointer bg-slate-50 p-3 rounded-xl hover:bg-amber-50 transition-colors border border-slate-200">
                    <ImageIcon size={22} className="text-slate-500" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e)}
                    />
                  </label>
                  {c.preview && (
                    <img
                      src={c.preview}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-amber-200"
                      alt="rəng"
                    />
                  )}
                  <button
                    type="button"
                    disabled={colors.length === 1}
                    onClick={() =>
                      setColors(colors.filter((_, idx) => idx !== i))
                    }
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Düyməsi */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-6 pt-8 border-t border-slate-100">
            {submitAttempted && hasErrors && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold animate-pulse">
                <AlertCircle size={18} /> Zəhmət olmasa xətalı xanaları
                düzəldin.
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmitAttempt}
              className="w-full md:w-auto bg-slate-900 text-white px-14 py-5 rounded-[1.5rem] font-black text-sm tracking-widest shadow-2xl hover:bg-amber-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <CheckCircle2 size={24} /> MƏHSULU SİSTEMƏ YERLƏŞDİR
            </button>
          </div>
        </div>
      </motion.div>

      {/* Təsdiq Modalı */}
      <ConfirmModal
        showConfirm={showConfirm}
        isSaving={isSaving}
        setShowConfirm={setShowConfirm}
        confirmSave={confirmSave}
      />
    </div>
  );
};

export default AddProduct;
