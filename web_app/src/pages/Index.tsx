import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SupportedObjectsSection from "@/components/SupportedObjectsSection";
import UseCasesSection from "@/components/UseCasesSection";
import CounterTool from "@/components/CounterTool";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <SupportedObjectsSection />
      <UseCasesSection />
      <CounterTool />
      <Footer />
    </div>
  );
};

export default Index;
