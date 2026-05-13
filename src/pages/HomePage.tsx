import { useState } from "react";
import Hero from "./Hero";
import Shop from "./Shop";
import PromoSlider from "./PromoSlider";
import About from "./About"; // About komponenti
import ReviewsCarousel from "./ReviewsCarousel"; // Reviews komponenti
import LeadModal from "../components/LeadModal";
import { submitLead } from "../utils/services";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  const openLeadModal = (type) => {
    setBackendErrors({});
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleConfirm = async (formData) => {
    try {
      const data = new FormData();
      data.append("phone", formData.phone);
      data.append("source", modalType);
      if (formData.fullName) data.append("fullName", formData.fullName);
      if (formData.image) data.append("image", formData.image);

      await submitLead(data);

      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
      }, 2500);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setBackendErrors(error.response.data);
      }
    }
  };

  return (
    <div className="relative bg-white overflow-x-hidden">
      {/* 1. Hero Bölməsi */}
      <Hero />

      <div id="promos">
        <PromoSlider onOpenLeadModal={openLeadModal} />
      </div>

      {/* ID-ləri bura əlavə edirik */}
      <div id="about">
        <About />
      </div>

      <div id="shop">
        <Shop />
      </div>

      <div id="testimonials">
        <ReviewsCarousel />
      </div>

      {/* Lead Modal - Bütün çağırışlar üçün tək modal */}
      <LeadModal
        isOpen={isModalOpen}
        type={modalType}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        isSuccess={isSuccess}
        errors={backendErrors}
      />
    </div>
  );
};

export default HomePage;
