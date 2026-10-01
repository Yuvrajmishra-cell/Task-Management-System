import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import RolesSection from "../components/landing/RolesSection";
import SecuritySection from "../components/landing/SecuritySection";
import FaqSection from "../components/landing/FaqSection";
import CtaSection from "../components/landing/CtaSection";
import LandingFooter from "../components/landing/LandingFooter";
import { usePageTitle } from "../hooks/usePageTitle";

import "../components/landing/Landing.css";

function Landing() {
  usePageTitle("TaskFlow | Effortless Task Management for Every Team");
  return (
    <div className="landing-page">
      {/* 1. Sticky Navigation */}
      <LandingNav />

      <main>
        {/* 2. Hero Section with Faux Dashboard Preview */}
        <HeroSection />

        {/* 3. Features Grid */}
        <FeaturesSection />

        {/* 4. How It Works Steps */}
        <HowItWorksSection />

        {/* 5. Roles Separation */}
        <RolesSection />

        {/* 6. Security Pillars */}
        <SecuritySection />

        {/* 7. FAQ Accordion */}
        <FaqSection />

        {/* 8. Final CTA Band */}
        <CtaSection />
      </main>

      {/* 9. Footer */}
      <LandingFooter />
    </div>
  );
}

export default Landing;
