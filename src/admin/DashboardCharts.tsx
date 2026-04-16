import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartData as weeklyData } from '../store/adminPanelData';
import useAdminStore from '../store/adminStore.js';

const DashboardCharts = () => {
  const yearlyData = useAdminStore((state) => state.yearlyStats);

  return (
    <div className="space-y-8 px-4 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div style={{ width: '100%', height: 300 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-80">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Həftəlik Ziyarət</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <XAxis dataKey="name" hide />
              <Tooltip />
              <Area type="monotone" dataKey="ziyaret" stroke="#C5A059" fill="#C5A059" fillOpacity={0.1} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0A1128] p-8 rounded-[2.5rem] shadow-xl h-80">
          <h3 className="text-xs font-black text-[#C5A059] uppercase tracking-[0.2em] mb-6">Cari Ayın Sifarişləri</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <Bar dataKey="sifaris" fill="#C5A059" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-serif text-[#0A1128] mb-8">İllik Performans Trendi (2026)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip />
              <Line type="monotone" dataKey="ziyaret" stroke="#C5A059" strokeWidth={4} dot={{r: 6}} />
              <Line type="monotone" dataKey="sifaris" stroke="#0A1128" strokeWidth={4} dot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default DashboardCharts;