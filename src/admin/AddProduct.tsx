import React, { useState } from 'react';
import { Image as ImageIcon, Trash2, Ruler, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import useAdminStore from '../store/adminStore'; 

const AddProduct = () => {
  const addProduct = useAdminStore((state: any) => state.addProduct);
  const setActiveTab = useAdminStore((state: any) => state.setActiveTab);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Yeni: Dublikatın qarşısını alır
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tüllər");
  const [status, setStatus] = useState("Popular");
  const [room, setRoom] = useState("Qonaq Otağı");
  const [fabric, setFabric] = useState("");
  const [colors, setColors] = useState([{ hex: "#ffffff", name: "", preview: null }]);
  const [sizes, setSizes] = useState([{ size: "", price: "", oldPrice: "" }]);

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newColors = [...colors];
        newColors[index].preview = reader.result as any;
        setColors(newColors);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmSave = () => {
    // Əgər artıq yadda saxlanılırsa, funksiyanı dayandır
    if (isSaving) return;

    if (!name || sizes.length === 0 || !sizes[0].price) {
      alert("Zəhmət olmasa adı və qiyməti doldurun.");
      setShowConfirm(false);
      return;
    }

    setIsSaving(true); // Yadda saxlama prosesini başlat

    const productData = {
      name,
      description,
      category,
      status,
      roomType: room,
      fabricType: fabric,
      sizeOptions: sizes.map(s => ({
        size: s.size,
        price: Number(s.price),
        oldPrice: s.oldPrice ? Number(s.oldPrice) : null
      })),
      colors: colors.map(c => ({ 
        hex: c.hex, 
        name: c.name, 
        image: c.preview,
        mainImage: c.preview 
      })),
      price: Number(sizes[0].price),
      oldPrice: sizes[0].oldPrice ? Number(sizes[0].oldPrice) : null,
      rating: "5.0",
    };

    try {
      addProduct(productData);
      setShowConfirm(false);
      setActiveTab('all-models');
    } catch (error) {
      console.error("Məhsul əlavə edilərkən xəta:", error);
    } finally {
      setIsSaving(false); // Proses bitdi
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      <div className={`p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-5xl mx-auto space-y-8 transition-all duration-500 ${showConfirm ? 'blur-md pointer-events-none' : ''}`}>
        
        {/* Üst Məlumatlar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black uppercase tracking-wider">Modelin Adı və Haqqında</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-[#C5A059] outline-none font-medium" placeholder="Modelin adı..." />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-[#C5A059] outline-none min-h-[120px] resize-none" placeholder="Model haqqında geniş məlumat..." />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none font-bold text-[#0A1128]">
                <option value="Tüllər">Tüllər</option>
                <option value="Aksesuarlar">Aksesuarlar</option>
                <option value="Kornizlər">Kornizlər</option>
                <option value="Fonluqlar">Fonluqlar</option>
                <option value="Jalüzlər">Jalüzlər</option>
                <option value="Günəşliklər">Günəşliklər</option>
              </select>
              <input value={fabric} onChange={(e) => setFabric(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none font-medium" placeholder="Parça növü (Kətan...)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold text-[#0A1128]">
                <option>Popular</option><option>Yeni</option><option>Endirimli</option>
              </select>
              <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold text-[#0A1128]">
                <option>Qonaq Otağı</option>
                <option>Yataq Otağı</option>
                <option>Uşaq Otağı</option>
                <option>Mətbəx</option>
                <option>Ofis</option>
              </select>
            </div>
          </div>
        </div>

        {/* ÖLÇÜLƏR VƏ QİYMƏTLƏR */}
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-black"><Ruler size={16} /> Ölçülər və Qiymətlər</div>
          {sizes.map((s, i) => (
            <div key={i} className="flex gap-3 items-center animate-in slide-in-from-left-2 duration-300">
              <input placeholder="Ölçü (200x300)" className="flex-1 p-4 rounded-2xl bg-white border-0 shadow-sm" value={s.size} onChange={(e) => { const n = [...sizes]; n[i].size = e.target.value; setSizes(n); }} />
              <input placeholder="Qiymət" className="w-28 p-4 rounded-2xl bg-white border-0 shadow-sm font-bold text-[#0A1128]" value={s.price} onChange={(e) => { const n = [...sizes]; n[i].price = e.target.value; setSizes(n); }} />
              <input placeholder="Köhnə Qiymət" className="w-32 p-4 rounded-2xl bg-white border-0 shadow-sm text-slate-400 italic" value={s.oldPrice} onChange={(e) => { const n = [...sizes]; n[i].oldPrice = e.target.value; setSizes(n); }} />
              <button onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20}/></button>
            </div>
          ))}
          <button onClick={() => setSizes([...sizes, {size: "", price: "", oldPrice: ""}])} className="text-xs font-black text-[#C5A059] tracking-widest px-2">+ YENİ ÖLÇÜ VƏ QİYMƏT ƏLAVƏ ET</button>
        </div>

        {/* RƏNGLƏR */}
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
          <label className="text-xs font-black uppercase text-black flex items-center gap-2 tracking-widest"><Layers size={16}/> Rənglər və Şəkillər</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <input type="color" value={color.hex} onChange={(e) => { const n = [...colors]; n[index].hex = e.target.value; setColors(n); }} className="w-10 h-10 rounded-xl cursor-pointer" />
                <input placeholder="Rəng adı" value={color.name} onChange={(e) => { const n = [...colors]; n[index].name = e.target.value; setColors(n); }} className="flex-1 text-sm outline-none font-medium" />
                <input type="file" className="hidden" id={`file-${index}`} onChange={(e) => handleImageChange(index, e)} />
                <label htmlFor={`file-${index}`} className="cursor-pointer p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                  {color.preview ? <img src={color.preview as string} className="w-6 h-6 rounded object-cover shadow-inner" /> : <ImageIcon size={18} className="text-slate-400" />}
                </label>
                <button onClick={() => setColors(colors.filter((_, i) => i !== index))} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setColors([...colors, {hex: "#ffffff", name: "", preview: null}])} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:border-[#C5A059] transition-all bg-white/50">+ Yeni Rəng Sahəsi</button>
        </div>

        <button 
          onClick={() => setShowConfirm(true)} 
          disabled={isSaving}
          className={`w-full bg-[#0A1128] text-white py-6 rounded-[2rem] font-black text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 shadow-lg ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSaving ? "GÖNDƏRİLİR..." : <><CheckCircle2 size={22} /> MODELLİ SİSTEMƏ YERLƏŞDİR</>}
        </button>
      </div>

      {/* Təsdiq Modalı */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#0A1128]/60 backdrop-blur-xl" onClick={() => setShowConfirm(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300 z-10">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto"><AlertCircle size={40} className="text-[#C5A059]" /></div>
            <div>
              <h3 className="text-2xl font-black text-[#0A1128]">Təsdiq edirsiniz?</h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">Model bütün qiymətləri ilə kataloqa əlavə olunacaq.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Geri</button>
              <button 
                onClick={confirmSave} 
                disabled={isSaving}
                className="flex-1 py-4 bg-[#0A1128] text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
              >
                {isSaving ? "Gözləyin..." : "Bəli, Təsdiqlə"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;