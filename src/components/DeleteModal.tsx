import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal = ({ onConfirm, onCancel }: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      {/* Arxa fon (Blur) - Kliklədikdə bağlanması üçün */}
      <div 
        className="fixed inset-0 bg-[#0A1128]/80 backdrop-blur-xl h-screen w-screen" 
        onClick={onCancel}
      ></div>

      {/* Modal pəncərəsi */}
      <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full relative shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300 z-10">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <AlertTriangle size={40} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-[#0A1128]">Model Silinsin?</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Bu model bütün rəng və ölçüləri ilə birlikdə sistemdən **həmişəlik** silinəcək.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="button"
            onClick={onCancel} 
            className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
          >
            Ləğv et
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              onConfirm();
            }} 
            className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95"
          >
            Bəli, Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;