import React, { useState } from "react";
import { KeyRound, Loader2, LogOut } from "lucide-react";
import { changeAdminPassword } from "../utils/services";

type Props = { onLogout: () => void };

const AdminSettings = ({ onLogout }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Şifrə yeniləndi. Növbəti girişdə yeni şifrədən istifadə edin.");
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
            <h2 className="text-xl font-black text-[#0A1128]">Admin şifrəsini dəyiş</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Default: admin1978</p>
          </div>
        </div>
        {message && <div className="rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-bold">{message}</div>}
        {error && <div className="rounded-2xl bg-red-50 text-red-600 px-4 py-3 text-sm font-bold">{error}</div>}
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Hazırkı şifrə" className="admin-input" />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yeni şifrə" className="admin-input" />
        <button disabled={saving || !currentPassword || !newPassword} className="px-6 py-3 rounded-2xl bg-[#0A1128] text-[#C5A059] font-black flex items-center gap-2 disabled:opacity-60">
          {saving && <Loader2 className="animate-spin" size={18} />}
          Şifrəni yenilə
        </button>
      </form>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-[#0A1128]">Sessiya</h3>
        <p className="text-sm text-slate-500">Admin panel route-ları JWT token ilə qorunur. Çıxış etdikdə local token silinir.</p>
        <button type="button" onClick={onLogout} className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-black flex items-center gap-2"><LogOut size={18} /> Çıxış</button>
      </div>
    </div>
  );
};

export default AdminSettings;
