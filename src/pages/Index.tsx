import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { CommunityImpactSection } from "@/components/home/CommunityImpactSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ProTestimonialSection } from "@/components/home/ProTestimonialSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <CommunityImpactSection />
        <PricingSection />
        <TestimonialsSection />
        <ProTestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
