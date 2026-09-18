import Hero from "@/components/landing/Hero";
import HeroAtmosphere from "@/components/landing/HeroAtmosphere";
import Container from "@/components/ui-kit/Container";

const HeroSection = () => {
  return (
    <div
      id="home"
      className="relative z-10 min-h-[700px] overflow-hidden lg:h-screen"
      data-story-section
    >
      <HeroAtmosphere />

      <div className="relative z-[5] flex min-h-[700px] w-full items-center pt-[100px] lg:h-screen lg:min-h-0 lg:p-0">
        <Container>
          <Hero />
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;
