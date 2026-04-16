import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Phone, User } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; phone: string }) => void;
  isSuccess: boolean;
}

const LeadModal = ({ isOpen, onClose, onConfirm, isSuccess }: LeadModalProps) => {
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    };
    onConfirm(data);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Arxa fon (Overlay) */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modalın özü */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-10 md:p-16 text-center">
              {/* Bağlama düyməsi */}
              <button 
                onClick={onClose} 
                className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10"
                >
                  <CheckCircle2 size={48} className="text-green-600 mx-auto mb-6" />
                  <h2 className="text-4xl font-serif mb-4">Uğurludur!</h2>
                  <p className="text-gray-500 leading-relaxed">Tezliklə sizinlə əlaqə saxlayacağıq.</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-4xl font-serif mb-10 text-black">Sifariş Formu</h2>
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="relative group text-left">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-yellow-600 transition-colors" size={20} />
                      <input 
                        name="name"
                        required 
                        type="text" 
                        placeholder="Adınız" 
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 focus:border-yellow-600 focus:bg-white outline-none transition-all text-black" 
                      />
                    </div>
                    
                    <div className="relative group text-left">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-yellow-600 transition-colors" size={20} />
                      <input 
                        name="phone"
                        required 
                        type="tel" 
                        placeholder="Nömrəniz" 
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 focus:border-yellow-600 focus:bg-white outline-none transition-all text-black" 
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-yellow-600 transition-all duration-300 shadow-lg"
                    >
                      Göndər
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadModal;