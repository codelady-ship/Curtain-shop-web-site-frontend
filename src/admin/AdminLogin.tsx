import React, { useState } from "react";
import { Lock, Loader2, Eye } from "lucide-react";
import { adminLogin, forgotAdminPassword, resetAdminPassword } from "../utils/services";
import { IS_DEMO } from "../utils/api";
// Loaded on demand (also lazily by api.js), so the sandbox stays out of the main bundle.
const loadSandbox = () => import("../utils/adminSandbox");
import SEO from "../components/SEO";

const DEMO_MESSAGE = "Server hazırda cavab vermir (Render pulsuz serveri oyanır). Bir az sonra yenidən cəhd edin və ya \"Demo admin\" ilə baxın.";

// Public read-only demo account (backend Liquibase 9.1). The password is public by design.
export const DEMO_LOGIN = { username: "demo", password: "demo1234" };
// The "Demo admin" button: on the GitHub Pages demo build, or any build with VITE_ADMIN_DEMO=true.
const SHOW_DEMO_BUTTON = IS_DEMO || import.meta.env.VITE_ADMIN_DEMO === "true";

const isUnavailable = (err: any) =>
  Boolean(err?.isDemo) || !err?.response || !String(err.response.headers?.["content-type"] || "").includes("json");

type Props = {
  onLogin: (user: any) => void;
};

const AdminLogin = ({ onLogin }: Props) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [recovery, setRecovery] = useState({ name: "", email: "", phone: "", channel: "phone" });
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [demoLoading, setDemoLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    (await loadSandbox()).endSandboxSession();
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
      setError(isUnavailable(err) ? DEMO_MESSAGE : err?.response?.data?.message || "Admin giriş məlumatları yanlışdır");
    } finally {
      setLoading(false);
    }
  };

  // The "Demo admin" button opens the in-browser sandbox (adminSandbox.js) directly. It sends
  // nothing to the API, so there is no failed login in the console and no wait for a sleeping
  // Render instance.
  const enterDemo = async () => {
    setDemoLoading(true);
    setError("");
    setMessage("");
    try {
      const sandbox = await loadSandbox();
      sandbox.endSandboxSession();
      onLogin(sandbox.startSandboxSession());
    } finally {
      setDemoLoading(false);
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
      setError(err?.isDemo ? DEMO_MESSAGE : err?.response?.data?.message || "Reset kod göndərilmədi");
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
    if (newPassword.trim().length < 12) {
      setError("Yeni şifrə ən azı 12 simvol olmalıdır");
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
      setError(err?.isDemo ? DEMO_MESSAGE : err?.response?.data?.message || "Şifrə yenilənmədi");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] flex items-center justify-center px-4 py-10">
      <SEO title="Admin panel | Perde.az" path="/admin" noindex />
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[2rem] p-8 space-y-5 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0A1128] text-[#C5A059] flex items-center justify-center">
            <Lock size={26} />
          </div>
          <h1 className="text-2xl font-black text-[#0A1128]">Admin Panel</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Təhlükəsiz giriş</p>
        </div>

        {SHOW_DEMO_BUTTON && (
          <div className="space-y-2">
            <button type="button" onClick={enterDemo} disabled={demoLoading} className="w-full min-h-[44px] rounded-2xl bg-[#C5A059] text-[#0A1128] py-4 font-black flex items-center justify-center gap-2 disabled:opacity-60">
              {demoLoading ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
              Demo admin
            </button>
            <p className="text-center text-xs text-slate-500 font-bold">
              Demo giriş: {DEMO_LOGIN.username} / {DEMO_LOGIN.password} — yalnız baxış, dəyişikliklər saxlanılmır.
            </p>
          </div>
        )}
        {message && <div className="rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-bold">{message}</div>}
        {error && <div className="rounded-2xl bg-red-50 text-red-600 px-4 py-3 text-sm font-bold">{error}</div>}

        <label className="block space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">İstifadəçi adı</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none" placeholder="admin" />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Şifrə / kod</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none" placeholder="••••••••••••" autoComplete="current-password" />
        </label>

        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#0A1128] text-[#C5A059] py-4 font-black flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="animate-spin" size={18} />}
          Daxil ol
        </button>

        <button type="button" onClick={() => setRecoveryOpen((value) => !value)} className="w-full min-h-[44px] text-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#0A1128]">
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
