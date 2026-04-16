import { useState } from 'react';
import Hero from './Hero';
import Shop from './Shop'; 
import ReviewsCarousel from './ReviewsCarousel';
import About from './About';
import Openingpage from '../components/Openingpage'; // Sildiyin hissəni bərpa etdik
import LeadModal from '../components/LeadModal';
import Pagination from '../components/Pagination';
import PromoSlider from './PromoSlider';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts] = useState([]); 
  const productsPerPage = 8;

  const handleConfirm = (data: any) => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSuccess(false);
    }, 2500);
  };

  return (
    <Openingpage> {/* Animasiya burada başlayır */}
      <div className="relative min-h-screen flex flex-col bg-white">
        <main>
          <Hero onLeadModal={() => setIsModalOpen(true)} />
          
          <div id="promos" className="scroll-mt-20"> 
            <PromoSlider onOpenLeadModal={() => setIsModalOpen(true)} />
          </div>

          <div id="products">
            <Shop />
          </div>

          <div className="container mx-auto px-4 py-10">
             <Pagination 
                totalPages={Math.ceil(filteredProducts.length / productsPerPage) || 1} 
                currentPage={currentPage} 
                onPageChange={(page) => setCurrentPage(page)} 
              />
          </div>

          <ReviewsCarousel />
          
          <div id="about">
            <About />
          </div>
        </main>

        <LeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleConfirm}
          isSuccess={isSuccess}
        />
      </div>
    </Openingpage>
  );
};

export default HomePage;