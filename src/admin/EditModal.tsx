import React, { useState } from 'react';
import { X, CheckCircle2, Ruler, Layers, Image as ImageIcon, Trash2 } from 'lucide-react';

interface EditModalProps {
  product: any;
  onClose: () => void;
  onSave: (updatedProduct: any) => void;
}

const EditModal = ({ product, onClose, onSave }: EditModalProps) => {
  // Mövcud məlumatla dolan state
  const [formData, setFormData] = useState({
    ...product,
    sizeOptions: product.sizeOptions || product.sizes || [{ size: "", price: "", oldPrice: "" }],
    colors: product.colors || [{ hex: "#ffffff", name: "", image: null }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorChange = (index: number, key: string, value: any) => {
    const updatedColors = [...formData.colors];
    updatedColors[index][key] = value;
    setFormData({ ...formData, colors: updatedColors });
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleColorChange(index, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (index: number, key: string, value: string) => {
    const updatedSizes = [...formData.sizeOptions];
    updatedSizes[index][key] = value;
    // Əsas qiyməti də dinamik yenilə
    if (index === 0 && key === 'price') {
        formData.price = value;
    }
    setFormData({ ...formData, sizeOptions: updatedSizes });
  };

  const handleSubmit = () => {
    // Validation etmək olar
    if (!formData.name || formData.sizeOptions.length === 0) return;
    onSave(formData); // Store funksiyasını çağırır
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:p-10 overflow-hidden">
      {/* Blur Fon - TAM EKRAN */}
      <div 
        className="fixed inset-0 bg-[#0A1128]/80 backdrop-blur-xl h-screen w-screen" 
        onClick={onClose}
      ></div>
      
      {/* Modal Kart - Responsiv hündürlük */}
      <div className="bg-white rounded-[3rem] p-8 lg:p-12 w-full max-w-4xl relative shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500 z-10 custom-scrollbar">
        
        {/* Bağla Düyməsi */}
        <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all"><X size={24}/></button>
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-8 mt-2 lg:mt-0">
          <h2 className="text-3xl font-black text-[#0A1128]">Modelə Düzəliş Et</h2>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">ID: {product.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Əsas Məlumatlar */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Modelin Adı</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-[#C5A059] outline-none transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Təsvir</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-[#C5A059] outline-none min-h-[150px] resize-none font-medium leading-relaxed" />
            </div>
          </div>

          {/* Kateqoriya və Status */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Kateqoriya</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none font-bold text-[#0A1128] cursor-pointer">
                        <option>Tüllər</option><option>Fonluqlar</option><option>Jalüzlər</option><option>Aksesuarlar</option><option>Kornizlər</option><option>Günəşliklər</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Otaq Türü</label>
                    <select name="room" value={formData.room || formData.roomType} onChange={handleChange} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none font-bold text-[#0A1128] cursor-pointer">
                        <option>Qonaq Otağı</option><option>Yataq Otağı</option><option>Uşaq Otağı</option><option>Mətbəx</option><option>Ofis</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none font-bold text-[#0A1128] cursor-pointer">
                <option>Popular</option><option>Yeni</option><option>Endirimli</option><option>Normal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ölçülər və Qiymətlər - Boz Arxa Fon */}
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 shadow-inner mt-10">
          <div className="flex items-center gap-2 text-black font-black uppercase text-xs tracking-widest border-b border-slate-100 pb-3">
            <Ruler size={16} /> <span>Ölçülər və Qiymət Siyasəti</span>
          </div>
          {formData.sizeOptions.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input value={s.size} onChange={(e)=>handleSizeChange(i, 'size', e.target.value)} placeholder="Ölçü" className="flex-1 p-4 rounded-2xl border-0 shadow-sm outline-none font-medium bg-white" />
              <input value={s.price} onChange={(e)=>handleSizeChange(i, 'price', e.target.value)} placeholder="Qiymət" className="w-28 p-4 rounded-2xl border-0 shadow-sm outline-none font-bold text-[#0A1128] bg-white" />
              <input value={s.oldPrice} onChange={(e)=>handleSizeChange(i, 'oldPrice', e.target.value)} placeholder="Köhnə" className="w-32 p-4 rounded-2xl border-0 shadow-sm outline-none text-slate-400 italic bg-white" />
              <button onClick={()=>setFormData({...formData, sizeOptions: formData.sizeOptions.filter((_,idx)=>idx!==i)})} className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-all shrink-0">
                <Trash2 size={20}/>
              </button>
            </div>
          ))}
          <button onClick={()=>setFormData({...formData, sizeOptions: [...formData.sizeOptions, {size:"", price:"", oldPrice:""}]})} className="text-xs font-black text-[#C5A059] tracking-widest hover:underline px-2 pt-2">+ YENİ ÖLÇÜ ƏLAVƏ ET</button>
        </div>

        {/* Rənglər - Boz Arxa Fon */}
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 shadow-inner mt-8">
          <label className="text-xs font-black uppercase text-black flex items-center gap-2 tracking-widest border-b border-slate-100 pb-3">
            <Layers size={16}/> Rəng Seçimləri və Modellər
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <input type="color" value={color.hex || color.code} onChange={(e)=>handleColorChange(index, 'hex', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 shrink-0" />
                <input value={color.name} onChange={(e)=>handleColorChange(index, 'name', e.target.value)} placeholder="Rəng adı" className="flex-1 text-sm outline-none font-medium text-[#0A1128]" />
                <input type="file" className="hidden" id={`edit-file-${index}`} onChange={(e)=>handleImageChange(index, e)} />
                <label htmlFor={`edit-file-${index}`} className="cursor-pointer p-2 bg-slate-50 hover:bg-[#C5A059]/10 rounded-xl shrinkage-0">
                  {(color.image || color.preview || color.mainImage) ? <img src={color.image || color.preview || color.mainImage} className="w-6 h-6 rounded object-cover shadow-inner" /> : <ImageIcon size={18} className="text-slate-400" />}
                </label>
                <button onClick={()=>setFormData({...formData, colors: formData.colors.filter((_,idx)=>idx!==i)})} className="p-2 text-slate-300 hover:text-rose-500 shift-0"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
          <button onClick={()=>setFormData({...formData, colors: [...formData.colors, {hex:"#ffffff", name:"", image:null}]})} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:border-[#C5A059] hover:text-[#C5A059] transition-all bg-white/50">+ Yeni Rəng Sahəsi</button>
        </div>

        {/* Yadda Saxla */}
        <button 
          onClick={handleSubmit} 
          className="w-full bg-[#0A1128] text-white py-6 rounded-[2rem] font-black text-lg mt-12 hover:bg-[#C5A059] hover:shadow-2xl transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <CheckCircle2 size={22} /> DƏYİŞİKLİKLƏRİ YADDA SAXLA
        </button>
      </div>
    </div>
  );
};

export default EditModal;