import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardCharts from './DashboardCharts';

const DashboardView = () => {
  const [stats, setStats] = useState({
    weeklyVisits: [],
    monthlyOrders: 0,
    yearlyStats: [] // Backend-dən gələcək illik data
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Backend-dən analitika datalarını çəkirik
        const response = await axios.get('http://localhost:8080/api/analytics/dashboard');
        setStats(response.data);
        
        // 2. Ziyarəti qeyd etmək üçün (isteğe bağlı, admin panelə giriş ziyarət sayılmaya da bilər)
        // await axios.post('http://localhost:8080/api/analytics/hit');
        
      } catch (error) {
        console.error("Analitika datası yüklənmədi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center font-serif">Yüklənir...</div>;

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#0A1128]">Ümumi Analitika</h2>
      </div>

      {/* Dataları alt komponentə props olaraq ötürürük */}
      <DashboardCharts 
        weeklyData={stats.weeklyVisits} 
        yearlyData={stats.yearlyStats} 
      />

      <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
        <h3 className="text-lg font-bold text-[#0A1128] mb-6">
          İllik Performans Trendi (2026)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.yearlyStats.map((item: any, index: number) => (
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