import { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import LeadsTable from './LeadsTable';
import AddProduct from './AddProduct';
import useAdminStore from '../store/adminStore.js';
import AllModels from './AllModels';
import VisitorsView from './VisitorsView';
import DashboardView from './DashboardView';

const MainAdminDashboard = () => {
  const activeTab = useAdminStore((state) => state.activeTab);
  const adminUser = useAdminStore((state) => state.adminUser);
  const checkAndReset = useAdminStore((state) => state.checkAndReset);

  useEffect(() => {
    if (typeof checkAndReset === 'function') {
      checkAndReset();
    }
  }, [checkAndReset]);

  const titles: { [key: string]: string } = {
    'dashboard': 'Ümumi Analitika',
    'all-models': 'Bütün Modellər',
    'visitors': 'Ziyarətçi və Müraciətlər',
    'add-model': 'Yeni Model Əlavə Et',
    'orders': 'Sifariş İdarəetməsi'
  };

  // 2. Kontent üçün Switch məntiqi
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'all-models':
        return <AllModels />;
      case 'visitors':
        return <VisitorsView filter="ALL" />;
      case 'add-model':
        return <AddProduct />;
      case 'orders':
        return (
          <div className="bg-white rounded-[2rem] border overflow-hidden">
            <LeadsTable filter="ALL" />
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-[#0A1128]">
              {titles[activeTab] || 'Admin Panel'}
            </h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Properde Management v1.0
            </p>
          </div>

          <div className="flex items-center gap-4 border-l pl-6">
            <div className="text-right">
              <p className="text-sm font-black text-[#0A1128]">
                {adminUser?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-[#C5A059] font-bold">
                {adminUser?.role}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#0A1128] rounded-xl flex items-center justify-center border-2 border-[#C5A059]">
              <span className="text-[#C5A059] font-bold">
                {adminUser?.name?.charAt(0)}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainAdminDashboard;