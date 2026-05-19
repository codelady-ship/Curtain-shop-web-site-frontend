import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Instagram,
  Facebook,
  Globe,
  Loader2,
  Video,
  Send,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import {
  extractList,
  getImageUrl,
  getLeads,
  updateLeadContacted,
  updateLeadPromo,
  updateLeadStatus,
} from "../utils/services";
import MessageModal from "./MessageModal";

const STATUS_OPTIONS = [
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "Əlaqə saxlanıldı" },
  { value: "IN_PROGRESS", label: "İcradadır" },
  { value: "PROMO_SENT", label: "Promo göndərildi" },
  { value: "COMPLETED", label: "Tamamlandı" },
  { value: "CANCELLED", label: "Ləğv edildi" },
];

const LEAD_STATUS_STORAGE_KEY = "properde_lead_statuses";

const normalizeUniqueStatuses = (items: string[] = []) => {
  const result: string[] = [];
  items.forEach((item) => {
    const value = String(item || "").trim();
    if (!value) return;
    const exists = result.some((existing) => existing.toLocaleLowerCase("az-AZ") === value.toLocaleLowerCase("az-AZ"));
    if (!exists) result.push(value);
  });
  return result;
};

const loadCustomLeadStatuses = () => {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(LEAD_STATUS_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? normalizeUniqueStatuses(saved) : [];
  } catch {
    return [];
  }
};

const saveCustomLeadStatuses = (items: string[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEAD_STATUS_STORAGE_KEY, JSON.stringify(normalizeUniqueStatuses(items)));
};

const normalizeLeadItems = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (!value) return [];

  return String(value)
    .split(/\r?\n|[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const extractProductIdFromLeadItem = (item: string) => {
  const match = String(item || "").match(/(?:^|\b)(?:id|məhsul\s*id|product\s*id)\s*[:#-]?\s*(\d+)\b/i);
  return match?.[1] || "";
};

const resolveInternalProductPath = (item: string, link?: string) => {
  const idFromItem = extractProductIdFromLeadItem(item);
  if (idFromItem) return `/product/${idFromItem}`;

  if (!link) return "";
  const linkMatch = String(link).match(/\/product\/(\d+)/i);
  return linkMatch?.[1] ? `/product/${linkMatch[1]}` : "";
};

const renderLeadItems = (items: string[], emptyLabel: string, links: string[] = []) => {
  if (!items.length) {
    return <span className="text-[11px] text-slate-300 font-bold italic">{emptyLabel}</span>;
  }

  return (
    <div className="space-y-1 max-w-[260px]">
      {items.slice(0, 4).map((item, index) => {
        const link = links[index];
        const productPath = resolveInternalProductPath(item, link);
        const content = (
          <span className="line-clamp-2">
            {item}
          </span>
        );

        if (productPath) {
          return (
            <Link
              key={`${item}-${index}`}
              to={productPath}
              className="block rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-blue-600 hover:bg-blue-50"
              title={`${item} — detal səhifəsini aç`}
            >
              {content}
            </Link>
          );
        }

        return link ? (
          <a
            key={`${item}-${index}`}
            href={link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-blue-600 hover:bg-blue-50"
            title={item}
          >
            {content}
          </a>
        ) : (
          <div
            key={`${item}-${index}`}
            className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600"
            title={item}
          >
            {content}
          </div>
        );
      })}

      {items.length > 4 && (
        <div className="text-[10px] font-black text-[#C5A059] px-3">
          +{items.length - 4} model daha
        </div>
      )}
    </div>
  );
};

const LeadsTable = ({ filter = "ALL" }: { filter?: string }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSocial, setSelectedSocial] = useState("ALL");
  const [promoDrafts, setPromoDrafts] = useState<Record<number, string>>({});
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageLead, setMessageLead] = useState<any>(null);

  const [customLeadStatuses, setCustomLeadStatuses] = useState<string[]>(loadCustomLeadStatuses);
  const [customStatusLeadId, setCustomStatusLeadId] = useState<number | null>(null);
  const [newLeadStatus, setNewLeadStatus] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const source = filter && filter !== "ALL" ? filter : "ALL";
      const res = await getLeads({ source });
      setLeads(extractList(res.data));
    } catch (err) {
      console.error("Lead siyahısı yüklənmədi:", err);
      setError("Müraciətlər yüklənmədi. Backend və /api/leads sorğusunu yoxlayın.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const formatLeadDate = (lead: any) => {
    const rawDate = lead.created_at || lead.createdAt;

    if (!rawDate) return "-";

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateLeadStatus(id, newStatus);
      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead)));
    } catch (err) {
      console.error("Status yenilənmədi:", err);
      alert("Status yenilənmədi!");
    }
  };

  const handleAddLeadStatus = async (leadId: number) => {
    const savedStatus = String(newLeadStatus || "").trim();
    if (!savedStatus) return;

    const nextStatuses = normalizeUniqueStatuses([...customLeadStatuses, savedStatus]);
    setCustomLeadStatuses(nextStatuses);
    saveCustomLeadStatuses(nextStatuses);
    setNewLeadStatus("");
    setCustomStatusLeadId(null);
    await handleStatusChange(leadId, savedStatus);
  };

  const handleContactedChange = async (lead: any, contacted: boolean) => {
    try {
      await updateLeadContacted(lead.id, contacted);
      setLeads((prev) =>
        prev.map((item) =>
          item.id === lead.id
            ? {
              ...item,
              contacted,
              status: contacted && item.status === "NEW" ? "CONTACTED" : item.status,
            }
            : item,
        ),
      );
    } catch (err) {
      console.error("Əlaqə statusu yenilənmədi:", err);
      alert("Əlaqə statusu yenilənmədi!");
    }
  };

  const handlePromoSave = async (lead: any) => {
    const promoCode = promoDrafts[lead.id] ?? lead.promoCode ?? "";
    try {
      await updateLeadPromo(lead.id, promoCode, lead.message || "");
      setLeads((prev) =>
        prev.map((item) => (item.id === lead.id ? { ...item, promoCode, status: promoCode ? "PROMO_SENT" : item.status } : item)),
      );
    } catch (err) {
      console.error("Promokod saxlanmadı:", err);
      alert("Promokod saxlanmadı!");
    }
  };

  const getReferrerIcon = (ref: string) => {
    switch (ref?.toUpperCase()) {
      case "INSTAGRAM": return <Instagram size={14} className="text-pink-600" />;
      case "FACEBOOK": return <Facebook size={14} className="text-blue-600" />;
      case "TIKTOK": return <Video size={14} className="text-black" />;
      case "WHATSAPP": return <MessageCircle size={14} className="text-emerald-600" />;
      default: return <Globe size={14} className="text-slate-400" />;
    }
  };

  const statusOptions = useMemo(() => {
    const dynamicStatuses = leads
      .map((lead) => String(lead.status || "").trim())
      .filter(Boolean)
      .filter((status) => !STATUS_OPTIONS.some((option) => option.value === status || option.label === status));

    const customOptions = normalizeUniqueStatuses([...customLeadStatuses, ...dynamicStatuses]).map((status) => ({
      value: status,
      label: status,
    }));

    return [...STATUS_OPTIONS, ...customOptions];
  }, [customLeadStatuses, leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        String(lead.fullName || lead.name || "").toLowerCase().includes(query) ||
        String(lead.phone || "").includes(searchQuery) ||
        String(lead.email || "").toLowerCase().includes(query) ||
        String(lead.requestedProducts || "").toLowerCase().includes(query) ||
        String(lead.likedProductsSummary || lead.likedProducts || "").toLowerCase().includes(query) ||
        String(lead.likedProductLinks || "").toLowerCase().includes(query) ||
        String(lead.message || "").toLowerCase().includes(query);
      const matchesSocial = selectedSocial === "ALL" || String(lead.referrer || "").toUpperCase() === selectedSocial;
      return matchesSearch && matchesSocial;
    });
  }, [leads, searchQuery, selectedSocial]);

  const handleOpenMessageModal = (lead: any) => {
    const promoCode = promoDrafts[lead.id] ?? lead.promoCode ?? "";
    setMessageLead({
      ...lead,
      promoCode,
    });
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessageLead(null);
  };

  const handleSavePromoFromModal = async (lead: any, promoCode: string, message: string) => {
    await updateLeadPromo(lead.id, promoCode, message);
    setLeads((prev) =>
      prev.map((item) =>
        item.id === lead.id
          ? { ...item, promoCode, message, status: promoCode ? "PROMO_SENT" : item.status }
          : item,
      ),
    );
    setPromoDrafts((prev) => ({
      ...prev,
      [lead.id]: promoCode,
    }));
  };

  const openLeadImage = (lead: any) => {
    // Backend’deki dosya adı
    const filename = lead.visualizationImageUrl || lead.visualization_image_url || lead.imageUrl || lead.image_url;

    if (!filename) {
      alert("Şəkil mövcud deyil!");
      return;
    }

    const imageUrl = getImageUrl(filename);

    const img = new Image();
    img.onerror = () => alert("Şəkil yüklənə bilmir!");
    img.src = imageUrl;

    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#C5A059]/20"
            placeholder="Müştəri, email, nömrə və ya məhsul axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
          {[
            { id: "ALL", icon: <Globe size={14} />, label: "Hamısı" },
            { id: "INSTAGRAM", icon: <Instagram size={14} />, label: "Insta" },
            { id: "FACEBOOK", icon: <Facebook size={14} />, label: "FB" },
            { id: "TIKTOK", icon: <Video size={14} />, label: "TikTok" },
            { id: "WHATSAPP", icon: <MessageCircle size={14} />, label: "WP" },
            { id: "WEB", icon: <Globe size={14} />, label: "Web" },
            { id: "WEBSITE", icon: <Globe size={14} />, label: "Website" },
          ].map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => setSelectedSocial(platform.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedSocial === platform.id
                ? "bg-[#0A1128] text-[#C5A059] shadow-md"
                : "text-slate-400 hover:bg-white"
                }`}
            >
              {platform.icon}
              <span className="hidden md:inline">{platform.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-x-auto shadow-sm relative">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#C5A059]" size={32} />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-sm font-bold text-red-500">
            {error}
          </div>
        ) : (
          <table className="w-full text-left min-w-[1780px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5">Müştəri</th>
                <th className="px-6 py-5">Şəkil</th>
                <th className="px-6 py-5">Tarix</th>
                <th className="px-6 py-5">Mənbə</th>
                <th className="px-6 py-5">Növü</th>
                <th className="px-6 py-5">Seçilən modellər</th>
                <th className="px-6 py-5">Ürək qoyduğu</th>
                <th className="px-6 py-5">Məbləğ</th>
                <th className="px-6 py-5">Əlaqə</th>
                <th className="px-6 py-5">Promokod</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Göndər</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => {
                const imageUrl = getImageUrl(lead.visualizationImageUrl || lead.visualization_image_url || lead.imageUrl || lead.image_url || "");
                const requestedItems = normalizeLeadItems(lead.requestedProducts || lead.requested_products);
                const likedItems = normalizeLeadItems(lead.likedProductsSummary || lead.likedProducts || lead.liked_products_summary);
                const likedLinks = normalizeLeadItems(lead.likedProductLinks || lead.liked_product_links);

                return (
                  <tr key={lead.id} className={`hover:bg-slate-50/80 transition-all group ${lead.contacted ? "contacted-lead" : ""}`}>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#0A1128] group-hover:text-[#C5A059]">
                          {lead.fullName || lead.name || "Ads Müştərisi"}
                        </span>
                        <span className="text-xs text-blue-600 font-medium">{lead.phone || "-"}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{lead.email || "Email yoxdur"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {imageUrl ? (
                        <button
                          type="button"
                          onClick={() => openLeadImage(lead)}
                          className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm"
                          title="Şəkli aç"
                        >
                          <img src={imageUrl} loading="lazy" alt="lead" className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{formatLeadDate(lead)}</span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit">
                        {getReferrerIcon(lead.referrer)}
                        <span className="text-[10px] font-bold text-slate-600 uppercase">
                          {lead.referrer || "WEBSITE"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {lead.source || "ALL"}
                      </span>
                    </td>

                    <td className="px-6 py-5 align-top">
                      {renderLeadItems(requestedItems, "Səbət boşdur")}
                    </td>

                    <td className="px-6 py-5 align-top">
                      {renderLeadItems(likedItems, "Ürək yoxdur", likedLinks)}
                    </td>

                    <td className="px-6 py-5 font-black text-[#0A1128]">
                      {Number(lead.totalAmount || 0).toFixed(2)} ₼
                    </td>

                    <td className="px-6 py-5">
                      <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={Boolean(lead.contacted)}
                          onChange={(e) => handleContactedChange(lead, e.target.checked)}
                        />
                        Əlaqə saxlanıldı
                      </label>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <input
                          value={promoDrafts[lead.id] ?? lead.promoCode ?? ""}
                          onChange={(e) =>
                            setPromoDrafts((prev) => ({
                              ...prev,
                              [lead.id]: e.target.value,
                            }))
                          }
                          placeholder="PROMO10"
                          className="w-28 px-3 py-2 bg-slate-50 rounded-xl text-xs outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => handlePromoSave(lead)}
                          className="p-2 bg-[#0A1128] text-[#C5A059] rounded-xl"
                          title="Promokodu saxla"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status || "NEW"}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="px-3 py-2 bg-slate-50 rounded-xl text-xs font-bold outline-none"
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomStatusLeadId(customStatusLeadId === lead.id ? null : lead.id);
                            setNewLeadStatus("");
                          }}
                          className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:text-[#C5A059]"
                          title="Yeni status əlavə et"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {customStatusLeadId === lead.id && (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            value={newLeadStatus}
                            onChange={(e) => setNewLeadStatus(e.target.value)}
                            placeholder="Yeni status"
                            className="w-32 px-3 py-2 bg-slate-50 rounded-xl text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddLeadStatus(lead.id)}
                            className="px-3 py-2 bg-[#0A1128] text-[#C5A059] rounded-xl text-[10px] font-black"
                          >
                            OK
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenMessageModal(lead)}
                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block hover:bg-emerald-600 hover:text-white transition-all"
                        title="Promo mesajı aç"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <MessageModal
        lead={messageLead}
        isOpen={isMessageModalOpen}
        onClose={handleCloseMessageModal}
        onSavePromo={handleSavePromoFromModal}
      />
    </div>
  );
};

export default LeadsTable;
