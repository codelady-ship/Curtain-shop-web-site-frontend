import { useState, useEffect } from 'react';
import DashboardCharts from './DashboardCharts';
import { getDashboardData } from '../utils/services';

const EMPTY_STATS = {
  weeklyVisits: [],
  monthlyOrders: 0,
  yearlyStats: [],
  totalLeads: 0,
};

const normalizeDashboardStats = (data: any) => ({
  weeklyVisits: Array.isArray(data?.weeklyVisits) ? data.weeklyVisits : [],
  monthlyOrders: Number.isFinite(Number(data?.monthlyOrders)) ? Number(data.monthlyOrders) : 0,
  yearlyStats: Array.isArray(data?.yearlyStats) ? data.yearlyStats : [],
  totalLeads: Number.isFinite(Number(data?.totalLeads)) ? Number(data.totalLeads) : 0,
});

const DashboardView = () => {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getDashboardData();
        if (!cancelled) {
          setStats(normalizeDashboardStats(response.data));
        }
      } catch (err) {
        console.error('Analitika datası yüklənmədi:', err);
        if (!cancelled) {
          setStats(EMPTY_STATS);
          setError('Analitika datası yüklənmədi. Backend /api/analytics/dashboard sorğusunu yoxlayın.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="p-10 text-center font-serif">Yüklənir...</div>;

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif text-[#0A1128]">Ümumi Analitika</h2>
          <p className="mt-1 text-xs font-bold text-slate-400">
            Ümumi müraciət sayı: {stats.totalLeads.toLocaleString('az-AZ')}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">
          {error}
        </div>
      )}

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
                <span className="text-slate-500 text-xs">Ziyarət: {item.ziyaret ?? 0}</span>
                <span className="text-slate-500 text-xs">Sifariş: {item.sifaris ?? 0}</span>
              </div>
            </div>
          ))}
          {!stats.yearlyStats.length && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-400">
              Hələ analitika datası yoxdur.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
