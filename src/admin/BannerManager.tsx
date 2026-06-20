import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Edit3,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  createBanner,
  deleteBanner,
  extractList,
  getAdminBanners,
  getImageUrl,
  updateBanner,
} from "../utils/services";
import { fileToDataUrl } from "./adminFormUtils";

type BannerForm = {
  id?: number;
  titleAz: string;
  titleRu: string;
  titleEn: string;
  descriptionAz: string;
  descriptionRu: string;
  descriptionEn: string;
  buttonTextAz: string;
  buttonTextRu: string;
  buttonTextEn: string;
  linkUrl: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  placement: string;
  visualType: string;
  active: boolean;
  sortOrder: number;
};

const emptyForm: BannerForm = {
  titleAz: "Yeni kampaniya",
  titleRu: "Новая акция",
  titleEn: "New campaign",
  descriptionAz: "Perde.az kampaniya təklifi",
  descriptionRu: "Специальное предложение Perde.az",
  descriptionEn: "Perde.az special offer",
  buttonTextAz: "Kataloqa bax",
  buttonTextRu: "Смотреть каталог",
  buttonTextEn: "View catalog",
  linkUrl: "#shop",
  desktopImageUrl: "",
  mobileImageUrl: "",
  placement: "MAIN",
  visualType: "IMAGE",
  active: true,
  sortOrder: 100,
};

const BannerManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<any>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminBanners();
      setItems(
        extractList(res.data).sort(
          (a: any, b: any) =>
            Number(a.sortOrder || 0) - Number(b.sortOrder || 0),
        ),
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reklam siyahısı yüklənmədi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setField = (key: keyof BannerForm, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImage = async (
    key: "desktopImageUrl" | "mobileImageUrl",
    file?: File | null,
  ) => {
    if (!file) return;
    setField(key, await fileToDataUrl(file));
  };

  const edit = (item: any) => {
    setForm({
      ...emptyForm,
      ...item,
      visualType: item.visualType || "IMAGE",
      active: item.active !== false,
      sortOrder: Number(item.sortOrder ?? 100),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => setForm(emptyForm);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (form.id) await updateBanner(form.id, form);
      else await createBanner(form);
      reset();
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reklam saxlanmadı.");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = async () => {
    if (!pendingDelete?.id) return;
    setDeleting(true);
    try {
      await deleteBanner(pendingDelete.id);
      setPendingDelete(null);
      await load();
    } finally {
      setDeleting(false);
    }
  };

  const previewImage = getImageUrl(form.desktopImageUrl || form.mobileImageUrl);

  return (
    <div className="space-y-6">
      <form
        onSubmit={save}
        className="space-y-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Saytın ana reklam karuseli üçün şəkil, mətn, düymə və sıra
              ayarları
            </p>
          </div>
          {form.id && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-600"
            >
              <X size={16} /> Yeni reklam yarat
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
          <h3 className="mb-3 text-sm font-black text-[#0A1128]">Mətnlər</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="admin-label">Başlıq — Azərbaycan dili</label>
              <input
                value={form.titleAz}
                onChange={(e) => setField("titleAz", e.target.value)}
                placeholder="Məs: ÖLÇÜ ALIMI PULSUZ!"
                className="admin-input"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label">Заголовок — Русский язык</label>
              <input
                value={form.titleRu}
                onChange={(e) => setField("titleRu", e.target.value)}
                placeholder="Например: БЕСПЛАТНЫЙ ЗАМЕР!"
                className="admin-input"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label">Title — English</label>
              <input
                value={form.titleEn}
                onChange={(e) => setField("titleEn", e.target.value)}
                placeholder="Example: FREE MEASUREMENT!"
                className="admin-input"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label">Açıqlama — Azərbaycan dili</label>
              <textarea
                value={form.descriptionAz}
                onChange={(e) => setField("descriptionAz", e.target.value)}
                placeholder="Reklamın qısa izahı"
                className="admin-input min-h-[90px]"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label">Описание — Русский язык</label>
              <textarea
                value={form.descriptionRu}
                onChange={(e) => setField("descriptionRu", e.target.value)}
                placeholder="Краткое описание рекламы"
                className="admin-input min-h-[90px]"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label">Description — English</label>
              <textarea
                value={form.descriptionEn}
                onChange={(e) => setField("descriptionEn", e.target.value)}
                placeholder="Short advertising text"
                className="admin-input min-h-[90px]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-black text-[#0A1128]">
              Düymə və keçid
            </h3>
            <p className="text-[11px] font-semibold text-slate-400">
              Düyməyə klik ediləndə hansı bölməyə gedəcəyini burada seçirsiniz.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="admin-label">Düymə mətni — AZ</label>
              <input
                value={form.buttonTextAz}
                onChange={(e) => setField("buttonTextAz", e.target.value)}
                placeholder="Kataloqa bax"
                className="admin-input"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label">Текст кнопки — RU</label>
              <input
                value={form.buttonTextRu}
                onChange={(e) => setField("buttonTextRu", e.target.value)}
                placeholder="Смотреть каталог"
                className="admin-input"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label">Button text — EN</label>
              <input
                value={form.buttonTextEn}
                onChange={(e) => setField("buttonTextEn", e.target.value)}
                placeholder="View catalog"
                className="admin-input"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="admin-label">Düymə keçidi</label>
              <select
                value={form.linkUrl}
                onChange={(e) => setField("linkUrl", e.target.value)}
                className="admin-input"
              >
                <option value="#shop">Kataloq bölməsi — #shop</option>
                <option value="#promos">Kampaniyalar bölməsi — #promos</option>
                <option value="#customers">
                  Müştərilər və partnyorlar — #customers
                </option>
                <option value="#about">Haqqımızda bölməsi — #about</option>
                <option value="#footer">Əlaqə bölməsi — #footer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="admin-label">Xüsusi link yazmaq üçün</label>
              <input
                value={form.linkUrl}
                onChange={(e) => setField("linkUrl", e.target.value)}
                placeholder="#shop və ya https://..."
                className="admin-input"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="space-y-2">
            <label className="admin-label">Reklam yeri</label>
            <select
              value={form.placement}
              onChange={(e) => setField("placement", e.target.value)}
              className="admin-input"
            >
              <option value="MAIN">Əsas reklam karuseli</option>
              <option value="SIDE">Əlavə reklam</option>
              <option value="SMALL">Kiçik reklam</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="admin-label">Kart dizaynı</label>
            <select
              value={form.visualType}
              onChange={(e) => setField("visualType", e.target.value)}
              className="admin-input"
            >
              <option value="IMAGE">Şəkilli reklam kartı</option>
              <option value="PROMO">Promo kod nömrə formu</option>
              <option value="MEASURE">Ölçü alımı nömrə formu</option>
              <option value="VIRTUAL">Vizualizasiya nömrə formu</option>
            </select>
            <p className="text-[10px] font-semibold text-slate-400">
              Şəkil seçsəniz kart şəkilli görünür. Form tipində nömrə admin
              paneldə müraciətlərə düşür.
            </p>
          </div>
          <div className="space-y-2">
            <label className="admin-label">Sıra nömrəsi</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setField("sortOrder", Number(e.target.value))}
              placeholder="100"
              className="admin-input"
            />
            <p className="text-[10px] font-semibold text-slate-400">
              1-3 əsas kart sistemdə sabitdir. Əlavə reklamlar üçün 100 və
              yuxarı saxlayın.
            </p>
          </div>
          <label className="admin-upload md:col-span-1">
            <ImagePlus size={18} /> Desktop reklam şəkli
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImage("desktopImageUrl", e.target.files?.[0])
              }
            />
          </label>
          <label className="admin-upload md:col-span-1">
            <ImagePlus size={18} /> Mobil reklam şəkli
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImage("mobileImageUrl", e.target.files?.[0])
              }
            />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setField("active", e.target.checked)}
          />{" "}
          Reklam aktiv göstərilsin
        </label>

        {previewImage && (
          <div className="overflow-hidden rounded-[1.5rem] border bg-slate-50">
            <img
              src={previewImage}
              alt="Reklam önizləmə"
              className="max-h-72 w-full object-cover"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-2xl bg-[#0A1128] px-6 py-3 font-black text-[#C5A059]"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : form.id ? (
            <Save size={18} />
          ) : (
            <Plus size={18} />
          )}
          {form.id ? "Reklamı yenilə" : "Reklam əlavə et"}
        </button>
      </form>

      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-[#C5A059]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-5 py-4">Şəkil</th>
                  <th>Başlıq</th>
                  <th>Tip</th>
                  <th>Status</th>
                  <th>Sıra</th>
                  <th className="px-5 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <img
                        src={getImageUrl(
                          item.desktopImageUrl || item.mobileImageUrl,
                        )}
                        alt={item.titleAz}
                        className="h-14 w-28 rounded-xl bg-slate-100 object-cover"
                      />
                    </td>
                    <td className="font-bold text-[#0A1128]">{item.titleAz}</td>
                    <td className="text-sm text-slate-500">
                      {item.placement} / {item.visualType || "IMAGE"}
                    </td>
                    <td>{item.active ? "Aktiv" : "Passiv"}</td>
                    <td>{item.sortOrder}</td>
                    <td className="space-x-2 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => edit(item)}
                        className="admin-action"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(item)}
                        className="admin-action text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {pendingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={34} />
              </div>
              <h3 className="text-2xl font-black text-slate-950">
                Reklam silinsin?
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                “{pendingDelete.titleAz}” reklamını silmək istədiyinizə
                əminsiniz?
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  disabled={deleting}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  onClick={confirmRemove}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}{" "}
                  Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannerManager;
