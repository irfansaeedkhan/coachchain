"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import LoaderIcon from "./LoaderIcon";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setLoading(false);
        document.body.style.overflow = "auto";
      },
    });

    tl.to("#layer", {
      y: "-100%",
      duration: 1.5,
      ease: "power2.inOut",
    })
      .to(
        ".loader-title",
        {
          opacity: 0,
          y: -20,
          letterSpacing: "0.5em",
          duration: 0.5,
          ease: "power2.in",
        },
        "-=0.6"
      )
      .to(
        ".loader-screen",
        {
          y: "-100%",
          duration: 0.85,
          ease: "power4.inOut",
        },
        "-=0.2"
      );
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-screen fixed inset-0 bg-[#020106] flex flex-col items-center justify-center gap-8 z-[100]">
      <div className="relative w-60 h-auto">
        <LoaderIcon />
      </div>
      <p className="loader-title font-montserrat text-white/70 text-[11px] tracking-[0.35em] uppercase">
        Entering CoachChain
      </p>
    </div>
  );
};

export default Loader;
