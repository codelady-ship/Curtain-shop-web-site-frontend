import React from 'react';
import { Eye, ShoppingBag, Ticket, Image as ImageIcon, Heart, Ruler, TrendingUp } from 'lucide-react';
import useAdminStore from '../store/adminStore.js'; 
import { stats as statsData } from '../store/adminPanelData'; 

const AdminStatus = () => {
  const activeFilter = useAdminStore((state) => state.activeFilter);
  const setActiveFilter = useAdminStore((state) => state.setActiveFilter);

  // İkonları ID və ya iconName-ə görə eşləşdiririk
  const getIcon = (iconName: string, isActive: boolean) => {
    const size = 22;
    const colorClass = isActive ? 'text-white' : '';
    
    const icons: { [key: string]: React.ReactNode } = {
      eye: <Eye size={size} className={isActive ? colorClass : 'text-slate-600'} />,
      shopping: <ShoppingBag size={size} className={isActive ? colorClass : 'text-purple-600'} />,
      ticket: <Ticket size={size} className={isActive ? colorClass : 'text-rose-600'} />,
      image: <ImageIcon size={size} className={isActive ? colorClass : 'text-blue-600'} />,
      heart: <Heart size={size} className={isActive ? colorClass : 'text-red-500'} />,
      ruler: <Ruler size={size} className={isActive ? colorClass : 'text-amber-600'} />
    };
    
    return icons[iconName] || <TrendingUp size={size} className={isActive ? colorClass : 'text-slate-400'} />;
  };

  return (
    // Sənin dizayndakı kimi 6-lı və ya 7-li grid strukturuna uyğun
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 px-4">
      {statsData.map((stat) => {
        const isActive = activeFilter === stat.id;
        
        return (
          <button
            key={stat.id}
            onClick={() => {
              // Əgər artıq aktivdirsə, Hamısına (ALL) qaytar, deyilsə həmin ID-ni seç
              setActiveFilter(activeFilter === stat.id ? 'ALL' : stat.id); 
            }}
            className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 text-left group ${
              isActive 
                ? 'bg-[#0A1128] border-[#C5A059] shadow-xl transform scale-[1.03]' 
                : 'bg-white border-slate-100 hover:border-[#C5A059]/30 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-3 rounded-2xl transition-colors ${isActive ? 'bg-white/10' : stat.bgColor}`}>
                {getIcon(stat.iconName, isActive)}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : (stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')
              }`}>
                {stat.trend}
              </span>
            </div>
            
            <div>
              <p className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                {stat.label}
              </p>
              <h3 className={`text-2xl font-serif mt-1 ${isActive ? 'text-white' : 'text-[#0A1128]'}`}>
                {stat.value}
              </h3>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AdminStatus;