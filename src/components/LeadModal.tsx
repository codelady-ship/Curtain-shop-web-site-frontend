import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2, Phone, User, Upload, Mail } from "lucide-react";
import { formatBytes, MAX_UPLOAD_IMAGE_BYTES, optimizeImageFile } from "../utils/imageCompression";

const LeadModal = ({
  isOpen,
  onClose,
  modalType,
  onConfirm,
  isSuccess,
  errors: backendErrors,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    file: null,
  });
  const [localErrors, setLocalErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ fullName: "", phone: "", email: "", file: null });
      setLocalErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  const validate = () => {
    const err: any = {};
    if (!formData.fullName.trim()) err.fullName = "Ad Soyad mütləqdir";
    if (!/^\d+$/.test(formData.phone) || formData.phone.length < 9) {
      err.phone = "Düzgün nömrə daxil edin";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = "Email düzgün deyil";
    }
    if (modalType === "VISUAL" && !formData.file) {
      err.file = "Şəkil yükləmək mütləqdir";
    }

    setLocalErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (fileProcessing || !validate()) return;

    setLoading(true);
    try {
      await onConfirm({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        image: formData.file,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFormData({ ...formData, file: null });
      return;
    }

    setFileProcessing(true);
    setLocalErrors((prev: any) => ({ ...prev, file: undefined }));

    try {
      if (file.size > MAX_UPLOAD_IMAGE_BYTES) {
        throw new Error(`Şəkil maksimum ${formatBytes(MAX_UPLOAD_IMAGE_BYTES)} ola bilər.`);
      }

      const optimized = await optimizeImageFile(file, {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1200,
        initialQuality: 0.82,
      });
      setFormData({ ...formData, file: optimized });
    } catch (error: any) {
      setFormData({ ...formData, file: null });
      setLocalErrors((prev: any) => ({
        ...prev,
        file: error?.message || "Şəkil sıxışdırıla bilmədi.",
      }));
      e.target.value = "";
    } finally {
      setFileProcessing(false);
    }
  };

  if (!isOpen) return null;

  const allErrors = { ...localErrors, ...backendErrors };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 md:p-8 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-black transition-all"
        >
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 animate-in zoom-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Təşəkkür edirik!
            </h2>
            <p className="text-slate-500 text-sm font-medium px-4">
              {modalType === "VISUAL"
                ? "Otağınızın dizaynı hazırlanıb ən qısa zamanda WhatsApp nömrənizə göndəriləcək."
                : "Müraciətiniz qəbul edildi. Tezliklə mütəxəssisimiz sizinlə əlaqə saxlayacaq."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <h2 className="text-xl font-black uppercase text-center text-slate-900 italic">
              {modalType === "VISUAL" ? "Virtual Dizayn" : "Ölçü Alımı"}
            </h2>

            <div className="space-y-3">
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none border-2 transition-all text-sm ${allErrors.fullName ? "border-red-400" : "border-transparent focus:border-[#C5A059]"}`}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              {allErrors.fullName && (
                <p className="text-red-500 text-[10px] font-bold ml-2">
                  {allErrors.fullName}
                </p>
              )}

              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="tel"
                  placeholder="0500000000"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none border-2 transition-all text-sm ${allErrors.phone ? "border-red-400" : "border-transparent focus:border-[#C5A059]"}`}
                  value={formData.phone}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setFormData({ ...formData, phone: e.target.value });
                    }
                  }}
                />
              </div>
              {allErrors.phone && (
                <p className="text-red-500 text-[10px] font-bold ml-2">
                  {allErrors.phone}
                </p>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email (istəyə bağlı)"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none border-2 transition-all text-sm ${allErrors.email ? "border-red-400" : "border-transparent focus:border-[#C5A059]"}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {allErrors.email && (
                <p className="text-red-500 text-[10px] font-bold ml-2">
                  {allErrors.email}
                </p>
              )}

              {modalType === "VISUAL" && (
                <div className="space-y-1">
                  <label
                    className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${allErrors.file ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                  >
                    <Upload className="text-slate-400 mb-1" size={20} />
                    <span className="text-[10px] text-slate-500 font-bold uppercase text-center px-2">
                      {fileProcessing
                        ? "Şəkil optimizasiya olunur..."
                        : formData.file
                          ? `${formData.file.name} (${formatBytes(formData.file.size)})`
                          : "Otağın şəklini yükləyin"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  {allErrors.file && (
                    <p className="text-red-500 text-[10px] font-bold ml-2">
                      {allErrors.file}
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || fileProcessing}
                className="w-full py-4 bg-[#0A1128] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Təsdiqlə"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadModal;
