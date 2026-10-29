"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface CardProps {
  title: string;
  subTitle?: string;
  icon: string;
  text?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ className = "", icon, title, subTitle, text }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      y: -8,
      duration: 0.45,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center center",
    });

    const iconWrap = card.querySelector(".card-icon-magnet") as HTMLElement | null;
    if (iconWrap) {
      gsap.to(iconWrap, {
        x: x * 14,
        y: y * 14,
        rotateY: x * 18,
        rotateX: -y * 18,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.55)",
    });

    const iconWrap = card.querySelector(".card-icon-magnet") as HTMLElement | null;
    if (iconWrap) {
      gsap.to(iconWrap, {
        x: 0,
        y: 0,
        rotateY: 0,
        rotateX: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`flex flex-col relative font-montserrat text-secondary 
      rounded-[20px] lg:gap-[30px] px-[34px] pb-[28px] 
      shadow-inner transition-shadow duration-300 ease-out
      hover:shadow-card core-methods-card-container will-change-transform
      ${className}`}
    >
      <div className="card-container">
        <div className="gradient-circle"></div>
        <div className="card-orbit" aria-hidden />
        <div className="card-container-image card-icon-magnet">
          <Image src={icon} alt="" width={72} height={72} className="card-icon-img" />
        </div>
      </div>

      <div className="flex flex-col gap-[22px]">
        <span className="text-[24px] font-medium text-primary">{title}</span>
        <span className="text-[16px] font-semibold">{subTitle}</span>
      </div>
      <span className="text-[16px] font-medium">{text}</span>
    </div>
  );
};

export default Card;
