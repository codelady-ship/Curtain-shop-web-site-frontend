import DashboardCharts from './DashboardCharts';
import { yearlyStats } from '../store/adminPanelData'; // Buradan çəkirik

const DashboardView = () => {
  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#0A1128]">Ümumi Analitika</h2>
      </div>

      <DashboardCharts />

      <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
        <h3 className="text-lg font-bold text-[#0A1128] mb-6">
          İllik Performans Trendi (2026)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {yearlyStats.map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[#C5A059] font-bold text-xs uppercase">{item.month}</p>
              <div className="flex justify-between mt-2">
                <span className="text-slate-500 text-xs">Ziyarət: {item.ziyaret}</span>
                <span className="text-slate-500 text-xs">Sifariş: {item.sifaris}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;