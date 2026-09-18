"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StoryDirector = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      document.querySelectorAll("[data-story-title]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-story-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: -48, scale: 1.06 },
          {
            y: 48,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-story-section]").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.4, y: 80 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 95%",
              end: "top 45%",
              scrub: 1.2,
            },
          }
        );
      });

      const divider = document.querySelector(".divider-stage");
      if (divider) {
        gsap.fromTo(
          divider,
          { scale: 0.9, filter: "saturate(0.7)" },
          {
            scale: 1,
            filter: "saturate(1)",
            ease: "none",
            scrollTrigger: {
              trigger: divider,
              start: "top 90%",
              end: "center center",
              scrub: true,
            },
          }
        );
      }

      const caption = document.querySelector(".story-caption-text");
      if (caption) {
        const lines = [
          "Chapter I: Find your direction",
          "Chapter II: Explore the path",
          "Chapter III: Grow with confidence",
          "Chapter IV: A personal approach",
          "Chapter V: Tools that support progress",
          "Chapter VI: Back ideas that matter",
          "Chapter VII: Start your journey",
        ];
        let last = -1;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const idx = Math.min(lines.length - 1, Math.floor(self.progress * lines.length));
            if (idx === last) return;
            last = idx;
            gsap.to(caption, {
              opacity: 0,
              y: -8,
              duration: 0.22,
              onComplete: () => {
                caption.textContent = lines[idx];
                gsap.to(caption, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
              },
            });
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="story-caption fixed left-4 lg:left-7 bottom-6 z-[55] hidden md:block pointer-events-none">
      <p className="story-caption-text font-montserrat text-[10px] tracking-[0.22em] uppercase text-[#514BFF]/70">
        Chapter I: Find your direction
      </p>
    </div>
  );
};

export default StoryDirector;
