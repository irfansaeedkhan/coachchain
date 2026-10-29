"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import LoaderIcon from "./LoaderIcon";

const LOADER_SEEN_KEY = "coachchain-loader-seen";

const Loader = () => {
  // Round 1: the splash ran on every fresh load, including returning
  // from a legal page, so every visit started with a full black
  // screen. Show it once per browser session only. Respect reduced
  // motion by skipping it entirely.
  const [seen] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return (
        window.sessionStorage.getItem(LOADER_SEEN_KEY) === "1" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (seen) {
      setLoading(false);
      return;
    }
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setLoading(false);
        document.body.style.overflow = "auto";
        try {
          window.sessionStorage.setItem(LOADER_SEEN_KEY, "1");
        } catch {
          // Session storage unavailable: splash simply runs again.
        }
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

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [seen]);

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
