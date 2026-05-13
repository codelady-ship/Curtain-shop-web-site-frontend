import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MessageCircle,
  Instagram,
  Facebook,
  Globe,
  Download,
  X,
  Loader2,
  Video,
  Send,
} from "lucide-react";
import { getLeads, updateLeadContacted, updateLeadPromo, updateLeadStatus } from "../utils/services";

const BACKEND_URL = "http://localhost:8080";

const LeadsTable = ({ filter = "ALL" }: { filter?: string }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSocial, setSelectedSocial] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [promoDrafts, setPromoDrafts] = useState<Record<number, string>>({});

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const source = filter && filter !== "ALL" ? filter : "ALL";
      const res = await getLeads({ source });
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lead siyahısı yüklənmədi:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateLeadStatus(id, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    } catch {
      alert("Status yenilənmədi!");
    }
  };

  const handleContactedChange = async (lead: any, contacted: boolean) => {
    await updateLeadContacted(lead.id, contacted);
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, contacted, status: contacted && l.status === "YENİ" ? "ZƏNG EDİLDİ" : l.status } : l)));
  };

  const handlePromoSave = async (lead: any) => {
    const promoCode = promoDrafts[lead.id] ?? lead.promoCode ?? "";
    await updateLeadPromo(lead.id, promoCode);
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, promoCode } : l)));
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

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        String(l.fullName || "").toLowerCase().includes(query) ||
        String(l.phone || "").includes(searchQuery) ||
        String(l.requestedProducts || "").toLowerCase().includes(query);
      const matchesSocial = selectedSocial === "ALL" || String(l.referrer || "").toUpperCase() === selectedSocial;
      return matchesSearch && matchesSocial;
    });
  }, [leads, searchQuery, selectedSocial]);

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#C5A059]/20"
            placeholder="Müştəri, nömrə və ya məhsul axtar..."
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
          ].map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedSocial(platform.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedSocial === platform.id ? "bg-[#0A1128] text-[#C5A059] shadow-md" : "text-slate-400 hover:bg-white"
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
        ) : (
          <table className="w-full text-left min-w-[1050px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5">Müştəri</th>
                <th className="px-6 py-5">Mənbə</th>
                <th className="px-6 py-5">Növü</th>
                <th className="px-6 py-5">Məbləğ</th>
                <th className="px-6 py-5">Əlaqə saxlanıldı</th>
                <th className="px-6 py-5">Promokod</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Əlaqə</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-slate-50/80 transition-all group ${lead.contacted ? 'contacted-lead' : ''}`}>
                  <td className="px-6 py-5 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0A1128] group-hover:text-[#C5A059]">{lead.fullName || "Ads Müştərisi"}</span>
                      <span className="text-xs text-blue-600 font-medium">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit">
                      {getReferrerIcon(lead.referrer)}
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{lead.referrer || "WEB"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className="text-[10px] font-bold text-slate-400 uppercase">{lead.source}</span></td>
                  <td className="px-6 py-5 font-black text-[#0A1128]">{Number(lead.totalAmount || 0).toFixed(2)} ₼</td>
                  <td className="px-6 py-5">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                      <input type="checkbox" checked={Boolean(lead.contacted)} onChange={(e) => handleContactedChange(lead, e.target.checked)} />
                      Əlaqə saxlanıldı
                    </label>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <input
                        value={promoDrafts[lead.id] ?? lead.promoCode ?? ""}
                        onChange={(e) => setPromoDrafts((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                        placeholder="PROMO10"
                        className="w-28 px-3 py-2 bg-slate-50 rounded-xl text-xs outline-none"
                      />
                      <button onClick={() => handlePromoSave(lead)} className="p-2 bg-[#0A1128] text-[#C5A059] rounded-xl">
                        <Send size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <select
                      value={lead.status || "YENİ"}
                      className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-slate-50 outline-none cursor-pointer"
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                      <option value="YENİ">YENİ</option>
                      <option value="ZƏNG EDİLDİ">ZƏNG EDİLDİ</option>
                      <option value="TAMAMLANDI">TAMAMLANDI</option>
                      <option value="LƏĞV EDİLDİ">LƏĞV EDİLDİ</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <a href={`https://wa.me/${String(lead.phone || "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block hover:bg-emerald-600 hover:text-white transition-all">
                      <MessageCircle size={18} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A1128]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-[#0A1128]">{selectedLead.fullName || "Ads Lead"}</h3>
              <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white rounded-full"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {selectedLead.visualizationImageUrl && (
                <div className="space-y-3">
                  <img
                    src={`${BACKEND_URL}${selectedLead.visualizationImageUrl}`}
                    className="w-full h-64 object-cover rounded-3xl border"
                    alt="Room"
                    onClick={() => window.open(`${BACKEND_URL}${selectedLead.visualizationImageUrl}`, '_blank')}
                  />
                  <a
                    href={`${BACKEND_URL}${selectedLead.visualizationImageUrl}`}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-[#0A1128]"
                  >
                    <Download size={14} /> Şəkli yüklə
                  </a>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Platforma</p><div className="flex items-center justify-center gap-1 font-bold mt-1">{getReferrerIcon(selectedLead.referrer)}{selectedLead.referrer || "WEB"}</div></div>
                <div className="p-4 bg-slate-50 rounded-2xl border text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Növü</p><p className="font-bold mt-1">{selectedLead.source}</p></div>
                <div className="p-4 bg-slate-50 rounded-2xl border text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Məbləğ</p><p className="font-bold mt-1">{Number(selectedLead.totalAmount || 0).toFixed(2)} ₼</p></div>
                <div className="p-4 bg-slate-50 rounded-2xl border text-center"><p className="text-[9px] font-black text-slate-400 uppercase">Tarix</p><p className="font-bold mt-1">{selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleDateString() : "-"}</p></div>
              </div>
              {selectedLead.requestedProducts && <pre className="bg-slate-50 rounded-2xl p-4 text-xs whitespace-pre-wrap border"><b>Səbət məhsulları:</b>{"\n"}{selectedLead.requestedProducts}</pre>}
              {selectedLead.likedProductsSummary && <pre className="bg-rose-50 rounded-2xl p-4 text-xs whitespace-pre-wrap border border-rose-100"><b>Ürək qoyulan modellər:</b>{"\n"}{selectedLead.likedProductsSummary}</pre>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;