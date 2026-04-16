import React from 'react';
import { Eye, ShoppingBag, TrendingUp, Heart, Ticket, Image as ImageIcon, Ruler, PhoneCall, Users } from 'lucide-react';
import useAdminStore from '../store/adminStore.js'; 
import { stats as statsData } from '../store/adminPanelData'; 

const AdminStatus = () => {
  const activeFilter = useAdminStore((state) => state.activeFilter);
  const setActiveFilter = useAdminStore((state) => state.setActiveFilter);

  const getIcon = (iconName: string, isActive: boolean) => {
    const size = 22;
    const colorClass = isActive ? 'text-white' : '';
    const icons: { [key: string]: React.ReactNode } = {
      eye: <Eye size={size} className={isActive ? colorClass : 'text-blue-500'} />,
      shopping: <ShoppingBag size={size} className={isActive ? colorClass : 'text-purple-500'} />,
      trend: <TrendingUp size={size} className={isActive ? colorClass : 'text-orange-500'} />,
      ticket: <Ticket size={size} className={isActive ? colorClass : 'text-rose-500'} />,
      image: <ImageIcon size={size} className={isActive ? colorClass : 'text-blue-600'} />,
      heart: <Heart size={size} className={isActive ? colorClass : 'text-red-500'} />,
      ruler: <Ruler size={size} className={isActive ? colorClass : 'text-amber-600'} />,
      phone: <PhoneCall size={size} className={isActive ? colorClass : 'text-blue-500'} />,
      users: <Users size={size} className={isActive ? colorClass : 'text-green-500'} />
    };
    return icons[iconName] || <Eye size={size} />;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 px-4">
      {statsData.map((stat) => {
        const isActive = activeFilter === stat.id;
        return (
          <button
            key={stat.id}
            onClick={() => {
            if (activeFilter === stat.id) {
               setActiveFilter('ALL'); 
            } else {
               setActiveFilter(stat.id); 
            }
          }}
            className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 text-left group ${
              isActive ? 'bg-[#0A1128] border-[#C5A059] shadow-xl transform scale-[1.03]' : 'bg-white border-slate-100 hover:border-[#C5A059]/30 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-3 rounded-2xl ${isActive ? 'bg-white/10' : stat.bgColor}`}>
                {getIcon(stat.iconName, isActive)}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-white/10 text-white' : (stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase ${isActive ? 'text-[#C5A059]' : 'text-slate-400'}`}>{stat.label}</p>
              <h3 className={`text-2xl font-serif mt-1 ${isActive ? 'text-white' : 'text-[#0A1128]'}`}>{stat.value}</h3>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AdminStatus;