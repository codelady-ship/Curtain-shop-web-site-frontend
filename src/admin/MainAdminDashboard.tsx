import { useEffect, useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import LeadsTable from './LeadsTable';
import AddProduct from './AddProduct';
import useAdminStore from '../store/adminStore.js';
import AllModels from '../components/AllModels';
import VisitorsView from './VisitorsView';
import DashboardView from './DashboardView';
import AdminLogin from './AdminLogin';
import BannerManager from './BannerManager';
import AdminSettings from './AdminSettings';

const MainAdminDashboard = () => {
  const activeTab = useAdminStore((state: any) => state.activeTab);
  const storeAdminUser = useAdminStore((state: any) => state.adminUser);
  const checkAndReset = useAdminStore((state: any) => state.checkAndReset);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    if (typeof checkAndReset === 'function') checkAndReset();
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('adminUser');
    if (token) {
      try { setAdminUser(storedUser ? JSON.parse(storedUser) : storeAdminUser); }
      catch { setAdminUser(storeAdminUser); }
    }
  }, [checkAndReset, storeAdminUser]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  const titles: { [key: string]: string } = {
    dashboard: 'Ümumi Analitika',
    'all-models': 'Bütün Modellər',
    visitors: 'Ziyarətçi və Müraciətlər',
    'add-model': 'Yeni Model Əlavə Et',
    orders: 'Sifariş İdarəetməsi',
    banners: 'Banner İdarəetməsi',
    settings: 'Admin Tənzimləmələri',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'all-models': return <AllModels isAdmin={true} />;
      case 'visitors': return <VisitorsView filter="ALL" />;
      case 'add-model': return <AddProduct />;
      case 'banners': return <BannerManager />;
      case 'settings': return <AdminSettings onLogout={logout} />;
      case 'orders': return <div className="bg-white rounded-[2rem] border overflow-hidden"><LeadsTable filter="ALL" /></div>;
      default: return <DashboardView />;
    }
  };

  if (!adminUser) return <AdminLogin onLogin={setAdminUser} />;

  const displayName = adminUser?.name || adminUser?.username || storeAdminUser?.name || 'Admin';
  const displayRole = adminUser?.role || storeAdminUser?.role || 'ADMIN';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {sidebarOpen && <button aria-label="Bağla" className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="h-20 bg-white border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 rounded-2xl bg-slate-50 text-[#0A1128]"><Menu size={20} /></button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#0A1128]">{titles[activeTab] || 'Admin Panel'}</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Perde.az Management v2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 border-l pl-3 md:pl-6">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-[#0A1128]">{displayName}</p>
              <p className="text-[10px] text-[#C5A059] font-bold">{displayRole}</p>
            </div>
            <div className="w-10 h-10 bg-[#0A1128] rounded-xl flex items-center justify-center border-2 border-[#C5A059]">
              <span className="text-[#C5A059] font-bold">{String(displayName).charAt(0).toUpperCase()}</span>
            </div>
            <button type="button" onClick={logout} title="Çıxış" className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600"><LogOut size={18} /></button>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="animate-in fade-in duration-500">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default MainAdminDashboard;
