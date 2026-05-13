import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  showConfirm: boolean;
  isSaving: boolean;
  setShowConfirm: (val: boolean) => void;
  confirmSave: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  showConfirm,
  isSaving,
  setShowConfirm,
  confirmSave,
}) => {
  return (
    <AnimatePresence>
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-6 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertCircle size={34} />
            </div>
            <h3 className="text-2xl font-black text-slate-950">
              Təsdiq edirsiniz?
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Məhsul sistemə əlavə olunacaq. Məlumatların düzgünlüyünə
              əminsinizsə, təsdiqləyin.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isSaving}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={confirmSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Yüklənir
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Təsdiqlə
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
