import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { adminLogin, forgotAdminPassword, resetAdminPassword } from "../utils/services";

type Props = {
  onLogin: (user: any) => void;
};

const AdminLogin = ({ onLogin }: Props) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("huseyn1978");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [recovery, setRecovery] = useState({ name: "", email: "", phone: "", channel: "phone" });
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await adminLogin(password, username);
      const data = response.data || {};
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("adminUser", JSON.stringify(data.user || { username }));
      onLogin(data.user || { username });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Admin giriş məlumatları yanlışdır");
    } finally {
      setLoading(false);
    }
  };

  const requestRecoveryCode = async () => {
    setError("");
    setMessage("");

    const phone = recovery.phone.replace(/\D/g, "");
    const email = recovery.email.trim();
    const name = recovery.name.trim();

    if (recovery.channel === "phone" && !phone) {
      setError("Telefon ilə reset üçün telefon nömrəsi daxil edin");
      return;
    }

    if (recovery.channel === "email" && !email) {
      setError("Email ilə reset üçün email daxil edin");
      return;
    }

    setRecoveryLoading(true);
    try {
      const response = await forgotAdminPassword({ ...recovery, username, name, email, phone });
      const data = response.data || {};
      setMessage(data.message || "Reset kodu avtomatik göndərildi");
      if (data.delivered === false) {
        setError(data.deliveryError || "Reset kodu avtomatik göndərilmədi");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset kod göndərilmədi");
    } finally {
      setRecoveryLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");
    if (!resetCode.trim() || !newPassword.trim()) {
      setError("Reset kodu və yeni şifrə daxil edin");
      return;
    }
    if (newPassword.length < 6) {
      setError("Yeni şifrə ən azı 6 simvol olmalıdır");
      return;
    }

    setResetLoading(true);
    try {
      await resetAdminPassword({ code: resetCode.trim(), newPassword });
      setPassword(newPassword);
      setResetCode("");
      setNewPassword("");
      setMessage("Şifrə yeniləndi. Yeni şifrə ilə daxil ola bilərsiniz.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Şifrə yenilənmədi");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[2rem] p-8 space-y-5 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0A1128] text-[#C5A059] flex items-center justify-center">
            <Lock size={26} />
          </div>
          <h1 className="text-2xl font-black text-[#0A1128]">Admin Panel</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Təhlükəsiz giriş</p>
        </div>

        {message && <div className="rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-bold">{message}</div>}
        {error && <div className="rounded-2xl bg-red-50 text-red-600 px-4 py-3 text-sm font-bold">{error}</div>}

        <label className="block space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">İstifadəçi adı</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none" placeholder="admin" />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Şifrə / kod</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none" placeholder="huseyn1978" />
        </label>

        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#0A1128] text-[#C5A059] py-4 font-black flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="animate-spin" size={18} />}
          Daxil ol
        </button>

        <button type="button" onClick={() => setRecoveryOpen((value) => !value)} className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#0A1128]">
          Şifrəni / kodu unutdum
        </button>

        {recoveryOpen && (
          <div className="border-t pt-5 space-y-3">
            <input value={recovery.name} onChange={(e) => setRecovery({ ...recovery, name: e.target.value })} placeholder="Admin adı" className="admin-input" />
            <input value={recovery.email} onChange={(e) => setRecovery({ ...recovery, email: e.target.value })} placeholder="Admin email" className="admin-input" />
            <input value={recovery.phone} onChange={(e) => setRecovery({ ...recovery, phone: e.target.value })} placeholder="Admin telefon / WhatsApp" className="admin-input" />
            <select value={recovery.channel} onChange={(e) => setRecovery({ ...recovery, channel: e.target.value })} className="admin-input">
              <option value="phone">Telefon / WhatsApp</option>
              <option value="email">Email</option>
            </select>
            <button type="button" onClick={requestRecoveryCode} disabled={recoveryLoading} className="w-full rounded-2xl bg-emerald-600 text-white py-3 font-black flex items-center justify-center gap-2 disabled:opacity-60">
              {recoveryLoading && <Loader2 className="animate-spin" size={18} />}
              Reset kodu göndər
            </button>
            <input value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="Gələn reset kodu" className="admin-input" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yeni şifrə / kod" className="admin-input" />
            <button type="button" onClick={resetPassword} disabled={resetLoading} className="w-full rounded-2xl bg-[#0A1128] text-[#C5A059] py-3 font-black flex items-center justify-center gap-2 disabled:opacity-60">
              {resetLoading && <Loader2 className="animate-spin" size={18} />}
              Şifrəni yenilə
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
