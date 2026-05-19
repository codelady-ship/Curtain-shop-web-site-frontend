import React, { useState, useEffect } from "react";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";

type MessageModalProps = {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
  onSavePromo: (lead: any, promoCode: string, message: string) => Promise<void>;
};

const buildDefaultMessage = (lead: any, promoCode: string) => {
  const name = lead?.fullName || lead?.name || "";
  return `Salam ${name}. Sizin üçün promo kod hazırlanıb: ${promoCode}\n\nBu koddan istifadə edərək sifarişinizi tamamlaya bilərsiniz.`;
};

const MessageModal = ({
  lead,
  isOpen,
  onClose,
  onSavePromo,
}: MessageModalProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const normalizePhoneForWhatsApp = (phone: string) => {
    const cleaned = String(phone || "").replace(/\D/g, "");

    if (!cleaned) return "";
    if (cleaned.startsWith("994")) return cleaned;
    if (cleaned.startsWith("0") && cleaned.length === 10) return `994${cleaned.slice(1)}`;
    return cleaned;
  };

  const whatsappPhone = normalizePhoneForWhatsApp(lead?.phone || "");

  useEffect(() => {
    if (!lead || !isOpen) return;

    const currentPromo = lead.promoCode || lead.promo_code || "";
    const currentMessage = lead.message || buildDefaultMessage(lead, currentPromo);
    setPromoCode(currentPromo);
    setMessage(currentMessage);
    setIsMessageSent(false);
  }, [lead, isOpen]);

  const persistPromoAndMessage = async () => {
    if (!lead) return;
    await onSavePromo(lead, promoCode.trim(), message.trim());
    setIsMessageSent(true);
  };

  const handleSavePromo = async () => {
    try {
      setSending(true);
      await persistPromoAndMessage();
    } catch (err) {
      console.error("Promo kod və mesaj saxlanmadı:", err);
      alert("Promo kod və mesaj yadda saxlanmadı!");
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async (isViaWhatsapp: boolean) => {
    if (isViaWhatsapp && !whatsappPhone) {
      alert("WhatsApp nömrəsi düzgün deyil!");
      return;
    }

    if (!message.trim()) {
      alert("Mesaj boş ola bilməz!");
      return;
    }

    try {
      setSending(true);
      await persistPromoAndMessage();

      if (isViaWhatsapp) {
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message.trim())}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Mesaj göndərmə xətası:", err);
      alert("Mesaj göndərilə bilmədi!");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0A1128]/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-7 border-b flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-[#0A1128]">
            Promo mesaj göndər
          </h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-full">
            <X size={22} />
          </button>
        </div>

        <div className="p-7 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Promo kod
            </label>
            <input
              value={promoCode}
              onChange={(e) => {
                const value = e.target.value;
                setPromoCode(value);
                setMessage(buildDefaultMessage(lead, value));
              }}
              placeholder="PROMO10"
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold outline-none border border-slate-100 focus:ring-2 focus:ring-[#C5A059]/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Göndəriləcək mesaj
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Müştəriyə göndəriləcək mesaj..."
              className="w-full min-h-[180px] px-4 py-4 bg-slate-50 rounded-2xl text-sm outline-none border border-slate-100 resize-none focus:ring-2 focus:ring-[#C5A059]/20"
            />
          </div>

          {isMessageSent && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-center">
              Promo kod və mesaj bazaya yazıldı.
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-600 text-xs font-black uppercase hover:bg-slate-200 transition-all"
            >
              Bağla
            </button>

            <button
              type="button"
              onClick={handleSavePromo}
              disabled={sending}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-[#0A1128] text-xs font-black uppercase hover:bg-slate-50 transition-all"
            >
              Yadda saxla
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage(true)}
              disabled={sending}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0A1128] text-[#C5A059] text-xs font-black uppercase hover:opacity-90 transition-all"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <><MessageCircle size={16} /> WhatsApp</>}
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage(false)}
              disabled={sending}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0A1128] text-[#C5A059] text-xs font-black uppercase hover:opacity-90 transition-all"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={15} /> Mesaj</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
