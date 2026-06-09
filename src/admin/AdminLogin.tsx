import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { adminLogin } from "../utils/services";

type Props = {
  onLogin: (user: any) => void;
};

const AdminLogin = ({ onLogin }: Props) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin1978");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await adminLogin(password, username);
      const data = response.data || {};
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("adminUser", JSON.stringify(data.user || { username }));
      onLogin(data.user || { username });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Admin giriş məlumatları yanlışdır.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0A1128] text-[#C5A059] flex items-center justify-center">
            <Lock size={26} />
          </div>
          <h1 className="text-2xl font-black text-[#0A1128]">Admin Panel</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">perde.az idarəetmə girişi</p>
        </div>

        {error && <div className="rounded-2xl bg-red-50 text-red-600 px-4 py-3 text-sm font-bold">{error}</div>}

        <label className="block space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">İstifadəçi adı</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C5A059]/30"
            placeholder="admin"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-black uppercase text-slate-500">Şifrə</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C5A059]/30"
            placeholder="admin1978"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#0A1128] text-[#C5A059] py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Daxil ol
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
