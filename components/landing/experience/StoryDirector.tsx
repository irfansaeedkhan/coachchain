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

      // Round 1: the caption used to be derived from whole-page scroll
      // progress, while the dot rail is derived from section triggers,
      // so the two never reliably agreed. Drive the caption from the
      // same section triggers as the rail, with one line per section.
      const caption = document.querySelector(".story-caption-text");
      if (caption) {
        const lines: Record<string, string> = {
          home: "Chapter I: Find your direction",
          journey: "Chapter II: Explore the path",
          "about-us": "Chapter III: Grow with confidence",
          our_approach: "Chapter IV: A personal approach",
          core_methods_tools: "Chapter V: Tools that support progress",
          invest_in_innovation: "Chapter VI: Back ideas that matter",
          contact_us: "Chapter VII: Start your journey",
        };
        let last = "";
        const show = (target: string) => {
          const line = lines[target];
          if (!line || line === last) return;
          last = line;
          gsap.to(caption, {
            opacity: 0,
            y: -8,
            duration: 0.22,
            onComplete: () => {
              caption.textContent = line;
              gsap.to(caption, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
            },
          });
        };
        Object.keys(lines).forEach((target) => {
          ScrollTrigger.create({
            trigger: `#${target}`,
            start: "top center",
            end: "bottom center",
            onEnter: () => show(target),
            onEnterBack: () => show(target),
          });
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
