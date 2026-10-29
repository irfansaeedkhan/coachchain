"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
          // Round 1: smooth scrolling back to top could leave the
          // pinned Journey canvas superimposed over the hero while
          // ScrollTrigger caught up. Jump instantly instead so the
          // hero is the only thing on screen after the click.
          onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
          className="fixed bottom-5 right-5 z-[70] rounded-full px-4 py-2 text-white transition duration-300 gradient-btn"
        >
          Back to Top
        </button>
      ) : null}
    </>
  );
};

export default LandingEnhancements;
