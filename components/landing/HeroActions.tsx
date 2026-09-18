"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Tuber from "@/components/ui-kit/common/button/Tuber";

const RotatingModel = dynamic(() => import("@/components/landing/RotatingModel"), {
  ssr: false,
});

export const HeroCta = () => {
  const btnRef = useRef<HTMLDivElement>(null);

  const clickHandler = () => {
    document.getElementById("journey")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleBtnMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0)`;
  };

  const handleBtnLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div className="hero-cta flex flex-col items-center lg:items-start gap-[28px] lg:gap-[22px]">
      <span className="text-[16px] lg:text-[20px] font-medium leading-normal">
        See how CoachChain works
      </span>
      <div
        ref={btnRef}
        onMouseMove={handleBtnMove}
        onMouseLeave={handleBtnLeave}
        className="inline-block will-change-transform transition-transform duration-300 ease-out"
      >
        <Tuber
          onClick={() => clickHandler()}
          text="Explore the journey"
          className="hero-btn rounded-[5px] px-[24px] py-[10px] max-w-[200px] text-[14px] font-medium leading-normal transition-colors duration-300 hover:bg-gray-200 hover:text-[#333]"
        />
      </div>
    </div>
  );
};

export const HeroModel = () => {
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    const reveal = () => {
      setShowModel(true);
      window.removeEventListener("pointermove", reveal);
      window.removeEventListener("touchstart", reveal);
      window.removeEventListener("keydown", reveal);
    };
    window.addEventListener("pointermove", reveal, { passive: true });
    window.addEventListener("touchstart", reveal, { passive: true });
    window.addEventListener("keydown", reveal);
    return () => {
      window.removeEventListener("pointermove", reveal);
      window.removeEventListener("touchstart", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, []);

  return (
    <div className="hero-model flex h-[300px] w-[300px] shrink-0 justify-center px-[55px] sm:h-[500px] sm:w-[500px] lg:px-0">
      {showModel ? <RotatingModel /> : null}
    </div>
  );
};
