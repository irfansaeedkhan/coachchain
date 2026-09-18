import { HeroCta, HeroModel } from "@/components/landing/HeroActions";

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-[97px] text-white font-montserrat pt-[68px] pb-[50px] lg:pb-[160px] lg:py-[163px]">
      <div className="flex flex-col gap-[65px] text-center lg:text-left">
        <div className="text-center flex flex-col lg:text-left lg:max-w-[455px] gap-[29px]">
          <span className="hero-eyebrow text-[11px] lg:text-[12px] font-medium uppercase tracking-[0.22em] text-white/80">
            Coaching built around how people learn
          </span>
          <h1 className="hero-line text-[32px] lg:text-[40px] font-semibold leading-normal">
            Grow with purpose. Shape what comes next.
          </h1>
          <p className="hero-line text-[14px] lg:text-[16px] font-medium leading-normal">
            Practical coaching that combines Montessori principles with AI and immersive learning.
          </p>
        </div>
        <HeroCta />
      </div>
      <HeroModel />
    </div>
  );
};

export default Hero;
