import { LayoutDashboard, PlusCircle, UsersIcon, Layers, Image, Settings, X } from 'lucide-react';
import useAdminStore from '../store/adminStore.js';

type Props = { isOpen?: boolean; onClose?: () => void };

const AdminSidebar = ({ isOpen = true, onClose }: Props) => {
  const { activeTab, setActiveTab } = useAdminStore();

  const menuItems = [
    { id: 'dashboard', name: 'Admin Panel', icon: <LayoutDashboard size={20}/> },
    { id: 'visitors', name: 'Müraciətlər', icon: <UsersIcon size ={20}/>},
    { id: 'all-models', name: 'Bütün Modellər', icon: <Layers size={20}/> },
    { id: 'add-model', name: 'Model Əlavə Et', icon: <PlusCircle size={20}/> },
    { id: 'banners', name: 'Reklamlar', icon: <Image size={20}/> },
    { id: 'settings', name: 'Tənzimləmələr', icon: <Settings size={20}/> },
  ];

  const selectTab = (id: string) => {
    setActiveTab(id);
    onClose?.();
  };

  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 w-72 bg-black h-screen p-6 text-white flex flex-col transition-transform duration-300`}>
      <div className="mb-10 px-2 flex items-center justify-between">
        <div className="text-[#C5A059] font-serif text-2xl font-bold tracking-tighter">PERDE.AZ</div>
        <button type="button" onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-white/10"><X size={18} /></button>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => selectTab(item.id)}
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
