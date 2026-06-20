import React, { useEffect, useState } from "react";
import { KeyRound, Loader2, LogOut, Save, UserCog } from "lucide-react";
import { changeAdminPassword, getAdminProfile, updateAdminProfile } from "../utils/services";

type Props = { onLogout: () => void };

type AdminProfile = {
  name: string;
  email: string;
  phone: string;
  resetCode: string;
  resetDeliveryStatus?: string;
  resetRequestedAt?: string;
};

const AdminSettings = ({ onLogout }: Props) => {
  const [profile, setProfile] = useState<AdminProfile>({ name: "", email: "", phone: "", resetCode: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const applyProfile = (data: any, fallback = profile) => {
    setProfile({
      name: data.name || data.username || fallback.name || "Admin",
      email: data.email || "",
      phone: data.phone || "",
      resetCode: data.resetCode || fallback.resetCode || "",
      resetDeliveryStatus: data.resetDeliveryStatus || "",
      resetRequestedAt: data.resetRequestedAt || "",
    });
  };

  useEffect(() => {
    getAdminProfile()
      .then((res) => applyProfile(res.data || {}, { name: "Admin", email: "", phone: "", resetCode: "" }))
      .catch(() => setProfile((prev) => ({ ...prev, name: prev.name || "Admin" })));
  }, []);

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileMessage("");
    setProfileError("");
    try {
      const res = await updateAdminProfile({ name: profile.name, email: profile.email, phone: profile.phone });
      const data = res.data || {};
      applyProfile(data);
      const storedUser = localStorage.getItem("adminUser");
      const user = storedUser ? JSON.parse(storedUser) : {};
      localStorage.setItem("adminUser", JSON.stringify({ ...user, ...data }));
      setProfileMessage("Admin məlumatları yeniləndi.");
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || "Admin məlumatları yenilənmədi.");
    } finally {
      setProfileSaving(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    setProfileMessage("");
    setProfileError("");
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      const data = res.data || {};
      setCurrentPassword("");
      setNewPassword("");
      applyProfile(data);
      setMessage("Şifrə/kod yeniləndi. Növbəti girişdə yeni koddan istifadə edin.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Şifrə yenilənmədi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1128] text-[#C5A059] flex items-center justify-center"><KeyRound size={22} /></div>
          <div>
            <h2 className="text-xl font-black text-[#0A1128]">Admin kodunu dəyiş</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Default: huseyn1978</p>
          </div>
        </div>
        {message && <div className="rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-bold">{message}</div>}
        {error && <div className="rounded-2xl bg-red-50 text-red-600 px-4 py-3 text-sm font-bold">{error}</div>}
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Hazırkı kod / şifrə" className="admin-input" />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yeni kod / şifrə" className="admin-input" />
        <button disabled={saving || !currentPassword || !newPassword} className="px-6 py-3 rounded-2xl bg-[#0A1128] text-[#C5A059] font-black flex items-center gap-2 disabled:opacity-60">
          {saving && <Loader2 className="animate-spin" size={18} />}
          Şifrəni yenilə
        </button>
        <div className="pt-6 border-t space-y-3">
          <h3 className="text-lg font-black text-[#0A1128]">Sessiya</h3>
          <p className="text-sm text-slate-500">Admin panel route-ları JWT token ilə qorunur. Çıxış etdikdə local token silinir.</p>
          <button type="button" onClick={onLogout} className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-black flex items-center gap-2"><LogOut size={18} /> Çıxış</button>
        </div>
      </form>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1128] text-[#C5A059] flex items-center justify-center"><UserCog size={22} /></div>
          <div>
            <h2 className="text-xl font-black text-[#0A1128]">Admin məlumatları</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ad, email, telefon və son reset kodu</p>
          </div>
        </div>
        {profileMessage && <div className="rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-bold">{profileMessage}</div>}
        {profileError && <div className="rounded-2xl bg-red-50 text-red-600 px-4 py-3 text-sm font-bold">{profileError}</div>}
        <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Admin adı" className="admin-input" />
        <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Admin email" className="admin-input" />
        <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Admin telefon / WhatsApp" className="admin-input" />
        <input value={profile.resetCode || ""} readOnly placeholder="Son reset kodu" className="admin-input bg-slate-100 text-slate-500" />
        <button type="button" onClick={saveProfile} disabled={profileSaving} className="px-6 py-3 rounded-2xl bg-[#0A1128] text-[#C5A059] font-black flex items-center gap-2 disabled:opacity-60">
          {profileSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Məlumatları saxla
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
