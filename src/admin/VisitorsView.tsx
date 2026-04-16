import AdminStats from './AdminStatus'; 
import LeadsTable from './LeadsTable';  
import useAdminStore from '../store/adminStore.js';

const VisitorsView = () => {
  const activeFilter = useAdminStore((state) => state.activeFilter);

  return (
    <div className="space-y-6 p-4 animate-in slide-in-from-right-5">
      

      {/* Statistika Düymələri (Filterlər) */}
      <AdminStats />
      
      {/* Müştəri Cədvəli */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
        <LeadsTable filter={activeFilter} />
      </div>
    </div>
  );
};

export default VisitorsView;