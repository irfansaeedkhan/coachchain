import Container from "@/components/ui-kit/Container";
import Navigation from "@/components/ui-kit/common/navs/Navigation";
import AboutUs from "@/components/landing/AboutUs";
import InvestmentOpportunities from "@/components/landing/InvestmentOpportunities";
import ContactUs from "@/components/landing/ContactUs";
import LazyOurApproach from "@/components/landing/LazyOurApproach";
import LazyCoreMethods from "@/components/landing/LazyCoreMethods";
import Image from "next/image";
import FooterLayout from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import LazyJourney from "@/components/landing/LazyJourney";
import LandingEnhancements from "@/components/landing/LandingEnhancements";
import Loader from "@/components/landing/Loader";

export default function Home() {
  return (
    <>
      <Loader />
      <LandingEnhancements />

      <div className="overflow-hidden relative z-10">
        <Navigation />
        <HeroSection />
        <LazyJourney />

        <div className="relative w-full" data-story-section>
          <div id="particles-container">
            <div className="floating-particle particle-1"></div>
            <div className="floating-particle particle-2"></div>
            <div className="floating-particle particle-3"></div>
            <div className="floating-particle particle-4"></div>
          </div>
          <Container id="about-us">
            <AboutUs />
          </Container>
        </div>

        <div data-story-section>
          <Container id="our_approach">
            <LazyOurApproach />
          </Container>
        </div>

        <Container>
          <div className="divider-stage relative overflow-hidden rounded-[100px] lg:rounded-[100px]">
            <div className="bg-gradient-to-b lg:bg-gradient-to-r from-[#514BFF] to-[#A376FE] absolute top-0 left-0 right-0 bottom-0"></div>
            <div data-story-parallax>
              <Image
                src="/images/divider.webp"
                alt=""
                width={1120}
                height={628}
                sizes="(min-width: 1120px) 1120px, 100vw"
                className="mix-blend-luminosity divider-parallax"
              />
            </div>
          </div>
        </Container>

        <div data-story-section>
          <Container id="core_methods_tools">
            <LazyCoreMethods />
          </Container>
        </div>

        <div data-story-section>
          <Container id="invest_in_innovation">
            <InvestmentOpportunities />
          </Container>
        </div>

        <div data-story-section>
          <Container id="contact_us">
            <ContactUs />
          </Container>
        </div>

        <FooterLayout />

      </div>
    </>
  );
}
