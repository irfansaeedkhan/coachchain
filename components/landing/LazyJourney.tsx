"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const JourneyExperience = dynamic(
  () => import("@/components/landing/journey/JourneyExperience"),
  { ssr: false }
);

const LazyJourney = () => {
  const [showJourney, setShowJourney] = useState(false);
  const gateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = () => setShowJourney(true);

    const warmup = () => {
      void import("@/components/landing/journey/JourneyExperience");
      reveal();
    };

    let idleId: number;
    const usedIdleCallback = "requestIdleCallback" in window;

    if (usedIdleCallback) {
      idleId = window.requestIdleCallback(warmup, { timeout: 1500 });
    } else {
      idleId = window.setTimeout(warmup, 600);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { rootMargin: "200px 0px 90% 0px", threshold: 0 }
    );

    if (gateRef.current) observer.observe(gateRef.current);

    return () => {
      observer.disconnect();
      if (usedIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  return (
    <div id="journey" ref={gateRef}>
      {showJourney ? (
        <JourneyExperience />
      ) : (
        <section
          className="relative h-[650vh] bg-[#070412]"
          aria-label="CoachChain cinematic journey"
        />
      )}
    </div>
  );
};

export default LazyJourney;
