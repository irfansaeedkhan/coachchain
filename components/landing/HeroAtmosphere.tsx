"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const StoryCanvas = dynamic(
  () => import("@/components/landing/experience/StoryCanvas"),
  { ssr: false }
);

const HeroAtmosphere = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pointerFrame = 0;

    const moveBackground = (event: PointerEvent) => {
      if (!backgroundRef.current || window.innerWidth < 768) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * -14;
        const y = (event.clientY / window.innerHeight - 0.5) * -10;
        backgroundRef.current?.style.setProperty(
          "transform",
          `translate3d(${x}px, ${y}px, 0) scale(1.035)`
        );
      });
    };

    window.addEventListener("pointermove", moveBackground, { passive: true });

    return () => {
      cancelAnimationFrame(pointerFrame);
      window.removeEventListener("pointermove", moveBackground);
    };
  }, []);

  return (
    <>
      <div
        ref={backgroundRef}
        className="absolute -inset-5 z-0 transition-transform duration-700 ease-out will-change-transform"
      >
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={55}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#514BFF]/50 to-[#A376FE]/45 lg:bg-gradient-to-r" />
      <div className="hero-noise pointer-events-none absolute inset-0 z-[2] opacity-[0.04]" />
      <StoryCanvas />
      <div className="hero-text-scrim pointer-events-none absolute inset-0 z-[4]" />
    </>
  );
};

export default HeroAtmosphere;
