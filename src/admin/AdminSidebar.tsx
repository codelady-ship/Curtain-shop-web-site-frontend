import { LayoutDashboard, ShoppingCart, PlusCircle,UsersIcon, Layers } from 'lucide-react';
import useAdminStore from '../store/adminStore.js';

const AdminSidebar = () => {
  const { activeTab, setActiveTab } = useAdminStore();

  const menuItems = [
    { id: 'dashboard', name: 'Admin Panel', icon: <LayoutDashboard size={20}/> },
    { id: 'orders', name: 'Sifarişlər', icon: <ShoppingCart size={20}/> },
    { id: 'visitors', name: 'Müraciətlər', icon: <UsersIcon size ={20}/>},
    { id: 'all-models', name: 'Bütün Modellər', icon: <Layers size={20}/> },
    { id: 'add-model', name: 'Model Əlavə Et', icon: <PlusCircle size={20}/> },
  ];

  return (
    <aside className="w-72 bg-black h-screen sticky top-0 p-6 text-white flex flex-col">
      <div className="mb-12 px-2 text-[#C5A059] font-serif text-2xl font-bold tracking-tighter">PROPERDE</div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
              activeTab === item.id ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' : 'hover:bg-white/5 text-slate-400'
            }`}
          >
            {item.icon} <span className="font-bold text-sm">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
export default AdminSidebar;