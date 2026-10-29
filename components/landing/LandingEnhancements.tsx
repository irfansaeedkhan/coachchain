"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSharedLenis } from "@/lib/lenis-instance";

const SmoothScroll = dynamic(
  () => import("@/components/landing/experience/SmoothScroll"),
  { ssr: false }
);
const StoryDirector = dynamic(
  () => import("@/components/landing/experience/StoryDirector"),
  { ssr: false }
);
const ChapterRail = dynamic(
  () => import("@/components/landing/experience/ChapterRail"),
  { ssr: false }
);
const CustomCursor = dynamic(
  () => import("@/components/landing/experience/CustomCursor"),
  { ssr: false }
);
const StoryProgress = dynamic(
  () => import("@/components/landing/experience/StoryProgress"),
  { ssr: false }
);

const LandingEnhancements = () => {
  const [active, setActive] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const activate = () => {
      setActive(true);
      window.removeEventListener("pointermove", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("keydown", activate);
    };
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);

    window.addEventListener("pointermove", activate, { passive: true });
    window.addEventListener("touchstart", activate, { passive: true });
    window.addEventListener("keydown", activate);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("keydown", activate);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {active ? (
        <>
          <SmoothScroll />
          <StoryProgress />
          <CustomCursor />
          <ChapterRail />
          <StoryDirector />
        </>
      ) : null}

      {showBackToTop ? (
        <button
          type="button"
          onClick={() => {
            // Round 3: scroll through Lenis when it owns scrolling.
            // A native smooth scroll under an active Lenis instance
            // could leave ScrollTrigger's pinned Journey canvas
            // desynced, its frozen last frame fixed over the hero.
            // Lenis scrollTo keeps the same smooth feel and keeps
            // ScrollTrigger in sync. Without Lenis (reduced motion),
            // the native smooth scroll is unchanged.
            const lenis = getSharedLenis();
            if (lenis) {
              lenis.scrollTo(0, { duration: 1.15 });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="fixed bottom-5 right-5 z-[70] rounded-full px-4 py-2 text-white transition duration-300 gradient-btn"
        >
          Back to Top
        </button>
      ) : null}
    </>
  );
};

export default LandingEnhancements;
