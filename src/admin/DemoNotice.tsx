import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import { DEMO_NOTICE_EVENT } from '../utils/api';

type Props = { user: any };

// "Demo mode" strip for the public demo admin, plus a toast for every refused demo write
// (403 { demo: true } from the API or the in-browser sandbox; see utils/api.js).
const storedUser = (fallback: any) => {
  try {
    return JSON.parse(localStorage.getItem('adminUser') || 'null') || fallback;
  } catch {
    return fallback;
  }
};

const DemoNotice = ({ user: initialUser }: Props) => {
  const [toast, setToast] = useState('');
  // Re-read on each notice: api.js may switch a server demo session to the sandbox.
  const [user, setUser] = useState(() => storedUser(initialUser));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = (event: Event) => {
      setUser(storedUser(initialUser));
      setToast(String((event as CustomEvent).detail || 'Demo rejimi: dəyişikliklər saxlanılmır.'));
      clearTimeout(timer);
      timer = setTimeout(() => setToast(''), 4500);
    };
    window.addEventListener(DEMO_NOTICE_EVENT, show);
    return () => {
      window.removeEventListener(DEMO_NOTICE_EVENT, show);
      clearTimeout(timer);
    };
  }, [initialUser]);

  return (
    <>
      {user?.demo && (
        <div className="bg-amber-50 text-amber-800 border-b border-amber-100 px-4 md:px-8 py-2 text-xs md:text-sm font-bold">
          {user.sandbox
            ? 'Demo rejimi — dəyişikliklər saxlanılmır (yalnız bu brauzer tabında qalır).'
            : 'Demo rejimi — yalnız baxış: dəyişikliklər saxlanılmır, müştəri məlumatları gizlədilib.'}
        </div>
      )}
      {toast && (
        <div role="status" aria-live="polite" className="fixed z-[60] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm rounded-2xl bg-[#0A1128] text-white shadow-2xl px-4 py-3 flex items-start gap-3">
          <Info size={18} className="text-[#C5A059] shrink-0 mt-0.5" />
          <p className="text-sm font-bold flex-1">{toast}</p>
          <button type="button" aria-label="Bağla" onClick={() => setToast('')} className="-m-2 p-3 rounded-xl hover:bg-white/10"><X size={16} /></button>
        </div>
      )}
    </>
  );
};

export default DemoNotice;
