import React, { useEffect, useMemo, useState } from 'react';
import { Eye, ShoppingBag, Ticket, Image as ImageIcon, Heart, Ruler, TrendingUp } from 'lucide-react';
import useAdminStore from '../store/adminStore.js';
import { extractList, getLeadStats } from '../utils/services';

const STAT_CARDS = [
  { id: 'ALL', label: 'Hamısı', iconName: 'eye', isPositive: true, bgColor: 'bg-slate-50' },
  { id: 'ORDER', label: 'SİFARİŞLƏR', iconName: 'shopping', isPositive: true, bgColor: 'bg-purple-50' },
  { id: 'DISCOUNT', label: 'Endirim Kodu', iconName: 'ticket', isPositive: true, bgColor: 'bg-red-50' },
  { id: 'VISUAL', label: 'Vizualizasiya', iconName: 'image', isPositive: true, bgColor: 'bg-blue-50' },
  { id: 'MEASURE', label: 'Ölçü Alımı', iconName: 'ruler', isPositive: true, bgColor: 'bg-amber-50' },
  { id: 'HEART', label: 'Ürək Qoyanlar', iconName: 'heart', isPositive: true, bgColor: 'bg-rose-50' },
];

const toNumber = (value: unknown) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const normalizeStatId = (value: unknown) => {
  const id = String(value || 'ALL').trim().toUpperCase();

  switch (id) {
    case 'ORDERS':
    case 'CART':
    case 'BASKET':
      return 'ORDER';
    case 'PROMO':
    case 'PROMO_CODE':
      return 'DISCOUNT';
    case 'VISUALIZATION':
    case 'VISUALISATION':
      return 'VISUAL';
    case 'MEASUREMENT':
      return 'MEASURE';
    case 'WISHLIST':
    case 'FAVORITE':
    case 'FAVORITES':
      return 'HEART';
    default:
      return id;
  }
};

const AdminStatus = () => {
  const activeFilter = useAdminStore((state) => state.activeFilter);
  const setActiveFilter = useAdminStore((state) => state.setActiveFilter);
  const [stats, setStats] = useState(() => STAT_CARDS.map((stat) => ({ ...stat, value: 0 })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getLeadStats();
        const apiStats = extractList(response.data);
        const counts = apiStats.reduce<Record<string, number>>((acc, item: any) => {
          acc[normalizeStatId(item?.id)] = toNumber(item?.value ?? item?.count ?? item?.total);
          return acc;
        }, {});

        if (!cancelled) {
          setStats(STAT_CARDS.map((stat) => ({
            ...stat,
            value: counts[stat.id] ?? 0,
          })));
        }
      } catch (err) {
        console.error('Statistika kartları yüklənmədi:', err);
        if (!cancelled) {
          setError('Statistika yüklənmədi');
          setStats(STAT_CARDS.map((stat) => ({ ...stat, value: 0 })));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedStats = useMemo(() => stats.map((stat) => ({
    ...stat,
    displayValue: loading ? '...' : stat.value.toLocaleString('az-AZ'),
  })), [stats, loading]);

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
    <div className="space-y-3 px-4">
      {error && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
          {error}. Backend /api/leads/stats sorğusunu yoxlayın.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {formattedStats.map((stat) => {
          const isActive = activeFilter === stat.id;

          return (
            <button
              key={stat.id}
              onClick={() => {
                setActiveFilter(activeFilter === stat.id ? 'ALL' : stat.id);
              }}
              className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col gap-4 text-left group ${isActive
                  ? 'bg-[#0A1128] border-[#C5A059] shadow-xl transform scale-[1.03]'
                  : 'bg-white border-slate-100 hover:border-[#C5A059]/30 hover:shadow-md'
                }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className={`p-3 rounded-2xl transition-colors ${isActive ? 'bg-white/10' : stat.bgColor}`}>
                  {getIcon(stat.iconName, isActive)}
                </div>
                <span className={`text-xl font-black leading-none ${isActive ? 'text-white' : 'text-[#0A1128]'}`}>
                  {stat.displayValue}
                </span>
              </div>

              <div>
                <p className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                  {stat.label}
                </p>
                <p className={`mt-1 text-[10px] font-bold ${isActive ? 'text-white/60' : 'text-slate-300'}`}>
                  real müraciət sayı
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminStatus;
