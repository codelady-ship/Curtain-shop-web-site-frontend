import React, { useState, useMemo } from 'react';
import { Phone, Heart, ShoppingCart, Calendar, Ticket, CheckCircle2, Clock, Search, Image as ImageIcon, Ruler } from 'lucide-react';
import { leadsData as initialData } from '../store/adminPanelData';
import useAdminStore from '../store/adminStore';

const LeadsTable = () => {
  const activeFilter = useAdminStore((state) => state.activeFilter);
  const [allLeads, setAllLeads] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStatus = (id: number) => {
    setAllLeads(prev => prev.map(item => {
      if (item.id === id) {
        const currentStatus = item.status.toUpperCase();
        return {
          ...item,
          status: (currentStatus === 'YENİ' || currentStatus === 'YENI') ? 'ZƏNG EDİLDİ' : 'YENİ'
        };
      }
      return item;
    }));
  };

  const filteredData = useMemo(() => {
    let result = [...allLeads];

    if (searchQuery) {
      result = result.filter(item => 
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.phone.includes(searchQuery)
      );
    }

    // FİLTRASİYA BURADA BAŞ VERİR (ID-lər Böyük hərflərlə uymalıdır)
    if (activeFilter && activeFilter !== 'ALL') {
      result = result.filter(item => {
        switch (activeFilter) {
          case 'CART':     return item.source === 'CART';
          case 'HEART':    return item.source === 'HEART';
          case 'DISCOUNT': return item.source === 'DISCOUNT';
          case 'VISUAL':   return item.source === 'VISUAL';
          case 'MEASURE':  return item.source === 'MEASURE';
          default: return true;
        }
      });
    }

    return result.sort((a, b) => new Date(b.fullDate || "").getTime() - new Date(a.fullDate || "").getTime());
  }, [allLeads, searchQuery, activeFilter]);

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20"
          />
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
        </div>
        <div className="hidden md:flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter:</span>
           <span className="px-3 py-1 bg-[#C5A059] text-white rounded-lg text-[10px] font-bold uppercase">
             {activeFilter === 'ALL' ? 'HAMISI' : activeFilter}
           </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
            <tr>
              <th className="px-8 py-5">Müştəri</th>
              <th className="px-8 py-5 text-center">Mənbə</th>
              <th className="px-8 py-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((lead) => {
              const isNew = lead.status.toUpperCase() === 'YENİ' || lead.status.toUpperCase() === 'YENI';
              return (
                <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className={`font-bold text-base ${!isNew ? 'text-slate-300 line-through' : 'text-[#0A1128]'}`}>
                        {lead.fullName}
                      </span>
                      <span className="text-blue-600 text-sm font-semibold">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                      {lead.source === 'VISUAL' ? <ImageIcon size={18} /> : lead.source === 'MEASURE' ? <Ruler size={18} /> : lead.source === 'CART' ? <ShoppingCart size={18} /> : <Ticket size={18} />}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => toggleStatus(lead.id)}
                      className={`px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest border transition-all ${
                        isNew ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}
                    >
                      {isNew ? 'YENİ' : 'ZƏNG EDİLDİ'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-medium">Bu filtr üzrə məlumat tapılmadı.</div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;