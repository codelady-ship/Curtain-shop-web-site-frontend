import { useState } from "react";
import PromoSlider from "./PromoSlider";
import DiscountedProducts from "./DiscountedProducts";
import Shop from "./Shop";
import About from "./About";
import ReviewsCarousel from "./ReviewsCarousel";
import PartnersCarousel from "./PartnersCarousel";
import LeadModal from "../components/LeadModal";
import SEO from "../components/SEO";
import { submitLead } from "../utils/services";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  const openLeadModal = (type: string) => {
    setBackendErrors({});
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleConfirm = async (formData: any) => {
    try {
      await submitLead({
        phone: formData.phone,
        fullName: formData.fullName,
        email: formData.email,
        source: modalType,
        image: formData.image,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
      }, 2500);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setBackendErrors(error.response.data);
      }
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-white dark:bg-slate-950">
      <SEO />
      <PromoSlider />
      <DiscountedProducts />
      <Shop compactHome />
      <div id="about">
        <About />
      </div>
      <div id="customers">
        <ReviewsCarousel />
        <PartnersCarousel />
      </div>
      <LeadModal
        isOpen={isModalOpen}
        modalType={modalType}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        isSuccess={isSuccess}
        errors={backendErrors}
      />
    </div>
  );
};

export default HomePage;
