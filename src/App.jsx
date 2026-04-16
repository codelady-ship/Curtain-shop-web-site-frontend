import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Shop from './pages/Shop';
import ProductDetailPage from './pages/ProductDetailPage';
import HomePage from './pages/HomePage';
import BasketAndFavorite from './pages/BasketAndFavorite';
import { CartProvider, useCart } from './components/CartContest';

// YENİ: Admin Panel Komponentini bura import edirik
import MainAdminDashboard from './admin/MainAdminDashboard'; 

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { setIsCartOpen } = useCart();
  const location = useLocation();

  // 1. Şərt: Məhsul detalı və səbət səhifələri (Köhnə şərtiniz)
  const isSpecialPage = location.pathname === '/basket' || location.pathname.startsWith('/product/');
  
  // 2. Şərt: Admin paneli olan səhifələrdə hər şeyi gizlət (YENİ)
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      
      {/* Əgər admin səhifəsi DEYİLSƏ və xüsusi səhifə DEYİLSƏ Navbar-ı göstər */}
      {!isSpecialPage && !isAdminPage && <Navbar onCartClick={() => setIsCartOpen(true)} />}

      <div className={(!isSpecialPage && !isAdminPage) ? "min-h-screen pt-20" : "min-h-screen"}>
        <Routes>
          {/* Müştəri tərəfi */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/basket" element={<BasketAndFavorite />} />

          {/* Admin tərəfi (YENİ) */}
          <Route path="/admin/*" element={<MainAdminDashboard />} />
        </Routes>
      </div>

      {/* Əgər admin səhifəsi DEYİLSƏ və xüsusi səhifə DEYİLSƏ Footer-i göstər */}
      {!isSpecialPage && !isAdminPage && (
        <div id="footer">
          <Footer />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;