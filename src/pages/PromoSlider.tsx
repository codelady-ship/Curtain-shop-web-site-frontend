import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, ArrowRight, Loader2 } from "lucide-react";
import LeadModal from "./../components/LeadModal";
import { useCart } from "../components/CartContest";
import {
  buildLeadSelectionPayload,
  extractList,
  fetchProducts,
  normalizeProduct,
  submitLead,
} from "../utils/services";

const PromoSlider = () => {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("MEASURE");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const { cartItems, wishlist } = useCart();

  useEffect(() => {
    fetchProducts()
      .then((res) => setDbProducts(extractList(res.data).map(normalizeProduct)))
      .catch((err) => console.error("Məhsullar yüklənmədi:", err));
  }, []);

  const selectionPayload = useMemo(
    () => buildLeadSelectionPayload({ cartItems, wishlist, products: dbProducts }),
    [cartItems, wishlist, dbProducts],
  );

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    setPhoneError("");

    if (phone.length < 10) {
      setPhoneError("Nömrəni tam daxil edin (məs: 0505554433)");
      return;
    }

    setStatus("loading");
    try {
      await submitLead({
        phone,
        source: "DISCOUNT",
        fullName: "Sürətli Müştəri",
        referrer: new URLSearchParams(window.location.search).get("ref") || "WEB",
        ...selectionPayload,
      });
      setStatus("success");
      setPhone("");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("Promo lead göndərilmədi:", err);
      alert("Sistem xətası. Backend-i yoxlayın.");
      setStatus("idle");
    }
  };

  const handleLeadConfirm = async (data) => {
    try {
      await submitLead({
        fullName: data.fullName || "",
        phone: data.phone || "",
        email: data.email || undefined,
        source: modalType,
        referrer: new URLSearchParams(window.location.search).get("ref") || "WEB",
        ...selectionPayload,
        image: data.image,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("Lead faylı göndərilmədi:", err);
      alert("Fayl yüklənmədi. Server xətası baş verdi.");
    }
  };

  const slides = [
    {
      id: "DISCOUNT",
      title: (
        <>
          İLK SİFARİŞƏ <br /> <span className="text-[#C5A059]">ENDİRİM!</span>
        </>
      ),
      desc: "Nömrənizi yazın, promo kodunuz nömrənizə göndərilsin.",
      bg: "#A82121",
      content: (
        <div className="mt-6 w-full">
          {status === "success" ? (
            <div className="bg-white/10 p-4 rounded-xl text-white font-bold border border-white/20">
              ✅ Promo kod nömrənizə göndəriləcək!
            </div>
          ) : (
            <form
              onSubmit={handleDiscountSubmit}
              className="flex flex-col gap-2"
            >
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="050 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`flex-1 px-4 py-4 rounded-xl text-black outline-none font-bold border-2 ${phoneError ? "border-yellow-400" : "border-transparent"}`}
                />
                <button className="bg-[#C5A059] px-6 py-4 rounded-xl font-black text-white active:scale-95">
                  {status === "loading" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "AL"
                  )}
                </button>
              </div>
              {phoneError && (
                <p className="text-white text-xs font-bold bg-black/20 p-1 rounded">
                  {phoneError}
                </p>
              )}
            </form>
          )}
        </div>
      ),
    },
    {
      id: "MEASURE",
      title: (
        <>
          ÖLÇÜ ALIMI <br /> <span className="text-[#C5A059]">PULSUZ!</span>
        </>
      ),
      desc: "Peşəkar komandamız evinize gəlsin və ölçüləri pulsuz götürsün.",
      bg: "#FBF9F4",
      textColor: "#0A1128",
      content: (
        <button
          onClick={() => {
            setModalType("MEASURE");
            setIsModalOpen(true);
            setIsSuccess(false);
          }}
          className="mt-6 flex items-center gap-4 bg-[#0A1128] text-white px-10 py-5 rounded-2xl font-black shadow-xl"
        >
          MÜRACİƏT ET <ArrowRight size={20} />
        </button>
      ),
    },
    {
      id: "VISUAL",
      title: (
        <>
          OTAĞINI <br /> <span className="text-[#C5A059]">VİRTUAL BƏZƏ!</span>
        </>
      ),
      desc: "Otağın şəklini göndər, pərdənin necə duracağını WhatsApp-la gör.",
      bg: "#0A1128",
      content: (
        <button
          onClick={() => {
            setModalType("VISUAL");
            setIsModalOpen(true);
            setIsSuccess(false);
          }}
          className="mt-6 flex items-center gap-4 bg-[#C5A059] text-white px-10 py-5 rounded-2xl font-black shadow-xl"
        >
          MÜRACİƏT ET <ImageIcon size={20} />
        </button>
      ),
    },
  ];

  return (
    <div className="py-20 overflow-hidden bg-white">
      <motion.div
        className="flex gap-8 px-10"
        animate={isPaused ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...slides, ...slides].map((slide, i) => (
          <div
            key={i}
            style={{
              backgroundColor: slide.bg,
              color: slide.textColor || "white",
            }}
            className="shrink-0 w-[450px] md:w-[600px] h-[400px] p-12 rounded-[4rem] flex flex-col justify-center shadow-2xl relative overflow-hidden"
          >
            <h2 className="text-4xl md:text-5xl font-black italic mb-4 leading-tight uppercase tracking-tighter">
              {slide.title}
            </h2>
            <p className="text-lg opacity-80 max-w-sm font-medium">
              {slide.desc}
            </p>
            {slide.content}
          </div>
        ))}
      </motion.div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLeadConfirm}
        isSuccess={isSuccess}
        modalType={modalType}
      />
    </div>
  );
};

export default PromoSlider;
