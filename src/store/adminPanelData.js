// Statistika Kartları 
export const stats = [
  { id: 'ALL', label: "Hamısı", value: "20", iconName: "eye", trend: "Canlı", isPositive: true, bgColor: "bg-slate-50" },
  { id: 'DISCOUNT', label: "Endirim Kodu", value: "124", iconName: "ticket", trend: "Yeni", isPositive: true, bgColor: "bg-red-50" },
  { id: 'VISUAL', label: "Vizualizasiya", value: "38", iconName: "image", trend: "+12", isPositive: true, bgColor: "bg-blue-50" },
  { id: 'CART', label: "Səbətə Atanlar", value: "28", iconName: "shopping", trend: "+5", isPositive: true, bgColor: "bg-purple-50" },
  { id: 'HEART', label: "Ürək Qoyanlar", value: "156", iconName: "heart", trend: "+12", isPositive: true, bgColor: "bg-rose-50" },
  { id: 'MEASURE', label: "Ölçü Alımı", value: "12", iconName: "ruler", trend: "Yeni", isPositive: true, bgColor: "bg-amber-50" }
];

// Müştərilərin Aktivlik Datası
export const leadsData = [
  { id: 1, fullName: "Əliyev Məmməd", phone: "050-123-45-67", status: "YENİ", date: "27.03.2026", fullDate: "2026-03-27T10:00:00", source: 'CART', customerImage: null, wishlist: ["Qızılı Tül"], cart: ["Antrasit Velvet"] },
  { id: 2, fullName: "Nigar Həsənova", phone: "070-987-65-43", status: "ZƏNG EDİLDİ", date: "28.03.2026", fullDate: "2026-03-28T14:30:00", source: 'VISUAL', customerImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400", wishlist: [], cart: ["Qızılı Tül"] },
  { id: 3, fullName: "Vüqar Səmədov", phone: "055-444-22-11", status: "YENİ", date: "29.03.2026", fullDate: "2026-03-29T09:15:00", source: 'DISCOUNT', customerImage: null, wishlist: [], cart: [] },
  { id: 4, fullName: "Aysel Kərimova", phone: "010-222-33-44", status: "YENİ", date: "29.03.2026", fullDate: "2026-03-29T11:00:00", source: 'MEASURE', customerImage: null, wishlist: ["Kətan Pərdə"], cart: [] },
  { id: 5, fullName: "Rauf Abbasov", phone: "050-555-66-77", status: "ZƏNG EDİLDİ", date: "30.03.2026", fullDate: "2026-03-30T12:00:00", source: 'CART', customerImage: null, wishlist: ["Zebra Store"], cart: ["Zebra Store"] },
  { id: 6, fullName: "Leyla Məlikova", phone: "077-333-44-55", status: "YENİ", date: "30.03.2026", fullDate: "2026-03-30T15:45:00", source: 'HEART', customerImage: null, wishlist: ["İpək Tül", "Məxmər Pərdə"], cart: [] },
  { id: 7, fullName: "Tural Qasımov", phone: "051-111-22-33", status: "YENİ", date: "31.03.2026", fullDate: "2026-03-31T09:00:00", source: 'VISUAL', customerImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", wishlist: [], cart: [] },
  { id: 8, fullName: "Fidan Hüseynova", phone: "055-777-88-99", status: "ZƏNG EDİLDİ", date: "31.03.2026", fullDate: "2026-03-31T16:20:00", source: 'DISCOUNT', customerImage: null, wishlist: ["Modern Jalüz"], cart: [] },
  { id: 9, fullName: "Orxan Zeynalov", phone: "070-444-55-66", status: "YENİ", date: "01.04.2026", fullDate: "2026-04-01T10:30:00", source: 'MEASURE', customerImage: null, wishlist: [], cart: ["Ofis Jalüzü"] },
  { id: 10, fullName: "Günay Əhədova", phone: "050-888-99-00", status: "YENİ", date: "01.04.2026", fullDate: "2026-04-01T14:10:00", source: 'HEART', customerImage: null, wishlist: ["Uşaq Otağı Pərdəsi"], cart: [] },
  { id: 11, fullName: "Elnur Paşayev", phone: "055-666-55-44", status: "ZƏNG EDİLDİ", date: "02.04.2026", fullDate: "2026-04-02T11:50:00", source: 'CART', customerImage: null, wishlist: [], cart: ["Bambuk Pərdə"] },
  { id: 12, fullName: "Səbinə Rüstəmova", phone: "010-999-88-77", status: "YENİ", date: "02.04.2026", fullDate: "2026-04-02T17:00:00", source: 'VISUAL', customerImage: "https://images.unsplash.com/photo-1536104968055-4d61aa56f46a?w=400", wishlist: ["Gümüşü Fon"], cart: [] },
  { id: 13, fullName: "Kamil Bağırov", phone: "051-444-33-22", status: "YENİ", date: "03.04.2026", fullDate: "2026-04-03T08:30:00", source: 'DISCOUNT', customerImage: null, wishlist: [], cart: [] },
  { id: 14, fullName: "Zəhra Vəliyeva", phone: "077-222-11-00", status: "ZƏNG EDİLDİ", date: "03.04.2026", fullDate: "2026-04-03T13:45:00", source: 'HEART', customerImage: null, wishlist: ["Klassik Tül"], cart: [] },
  { id: 15, fullName: "Anar Məmmədov", phone: "050-333-22-11", status: "YENİ", date: "04.04.2026", fullDate: "2026-04-04T10:00:00", source: 'MEASURE', customerImage: null, wishlist: [], cart: [] },
  { id: 16, fullName: "Nərmin Sadıqova", phone: "055-111-00-99", status: "YENİ", date: "04.04.2026", fullDate: "2026-04-04T15:20:00", source: 'CART', customerImage: null, wishlist: ["Blackout Pərdə"], cart: ["Blackout Pərdə"] },
  { id: 17, fullName: "Fuad Əliyev", phone: "070-555-44-33", status: "ZƏNG EDİLDİ", date: "05.04.2026", fullDate: "2026-04-05T12:10:00", source: 'VISUAL', customerImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400", wishlist: [], cart: [] },
  { id: 18, fullName: "Aytən Quliyeva", phone: "051-666-77-88", status: "YENİ", date: "05.04.2026", fullDate: "2026-04-05T16:40:00", source: 'DISCOUNT', customerImage: null, wishlist: ["Taxta Stor"], cart: [] },
  { id: 19, fullName: "Samir Cavadov", phone: "050-222-11-33", status: "YENİ", date: "06.04.2026", fullDate: "2026-04-06T09:15:00", source: 'MEASURE', customerImage: null, wishlist: ["Şifon Pərdə"], cart: [] },
  { id: 20, fullName: "Lalə İsmayılova", phone: "055-333-44-22", status: "ZƏNG EDİLDİ", date: "06.04.2026", fullDate: "2026-04-06T14:50:00", source: 'HEART', customerImage: null, wishlist: ["Fransız Tülü"], cart: [] }
];

export const yearlyStats = [
  { month: 'Yanvar', ziyaret: 450, sifaris: 12 },
  { month: 'Fevral', ziyaret: 520, sifaris: 18 },
  { month: 'Mart', ziyaret: 610, sifaris: 25 },
  { month: 'Aprel', ziyaret: 800, sifaris: 32 },
  { month: 'May', ziyaret: 0, sifaris: 0 },
  { month: 'İyun', ziyaret: 0, sifaris: 0 },
  { month: 'İyul', ziyaret: 0, sifaris: 0 },
  { month: 'Avqust', ziyaret: 0, sifaris: 0 },
  { month: 'Sentyabr', ziyaret: 0, sifaris: 0 },
  { month: 'Oktyabr', ziyaret: 0, sifaris: 0 },
  { month: 'Noyabr', ziyaret: 0, sifaris: 0 },
  { month: 'Dekabr', ziyaret: 0, sifaris: 0 }
];

export const chartData = [
  { name: 'B.e', ziyaret: 400, sifaris: 24 },
  { name: 'Ç.a', ziyaret: 300, sifaris: 13 },
  { name: 'Ç', ziyaret: 200, sifaris: 98 },
  { name: 'C.a', ziyaret: 278, sifaris: 39 },
  { name: 'C', ziyaret: 189, sifaris: 48 },
  { name: 'Ş', ziyaret: 239, sifaris: 38 },
  { name: 'B', ziyaret: 349, sifaris: 43 },
];