"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_CHAPTERS } from "./particleShapes";

gsap.registerPlugin(ScrollTrigger);

const ChapterRail = () => {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const triggers = STORY_CHAPTERS.map((chapter, index) =>
      ScrollTrigger.create({
        trigger: `#${chapter.target}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      })
    );

    gsap.fromTo(
      railRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 1, delay: 2.6, ease: "power3.out" }
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const goTo = (target: string) => {
    const element = document.getElementById(target);
    if (!element) return;
    const offset = target === "home" ? 0 : -120;
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.history.pushState(null, "", `#${target}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      ref={railRef}
      className="chapter-rail fixed right-4 lg:right-7 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col gap-4 opacity-0"
      aria-label="Story chapters"
    >
      {STORY_CHAPTERS.map((chapter, index) => (
        <button
          key={chapter.id}
          type="button"
          onClick={() => goTo(chapter.target)}
          className="group relative flex items-center justify-end gap-3"
          aria-label={chapter.label}
          aria-current={active === index}
        >
          <span
            className={`chapter-label text-[10px] tracking-[0.18em] uppercase font-montserrat font-semibold transition-all duration-500 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
              active === index
                ? "opacity-100 translate-x-0 text-white"
                : "opacity-0 translate-x-2 group-hover:opacity-80 group-hover:translate-x-0 text-white/90"
            }`}
          >
            {chapter.label}
          </span>
          <span
            className={`block rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,0,0,0.35)] ${
              active === index
                ? "w-2.5 h-2.5 bg-white shadow-[0_0_14px_rgba(255,255,255,0.55)]"
                : "w-1.5 h-1.5 bg-white/60 group-hover:bg-white/95"
            }`}
          />
        </button>
      ))}
      <div className="absolute right-[4px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent -z-10" />
    </nav>
  );
};

export default ChapterRail;
