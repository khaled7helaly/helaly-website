import FAQSection from "../features/home/components/FAQSection";
import FinalCTASection from "../features/home/components/FinalCTASection";
import HeroSection from "../features/home/components/HeroSection";
import SelectedProjects from "../features/home/components/SelectedProjects";
import ServicesPreview from "../features/home/components/ServicesPreview";
import OurProcess from "../features/home/components/OurProcess";
import WhyChooseUs from "../features/home/components/WhyChooseUs";

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <SelectedProjects />
      <WhyChooseUs />
      <OurProcess />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}

export default HomePage;
