"use client";

import React, { useRef } from "react";
import Image from "next/image";

interface CardProps {
  title: string;
  subTitle?: string;
  icon: string;
  text?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ className = "", icon, title, subTitle, text }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Round 1: these cards open nothing, so the 3D tilt on hover
  // that made them read as clickable buttons is removed. They
  // are display cards; the icon hover animation in CSS stays as
  // decoration only.
  return (
    <div
      ref={cardRef}
      className={`flex flex-col relative font-montserrat text-secondary
      rounded-[20px] lg:gap-[30px] px-[34px] pb-[28px]
      shadow-inner cursor-default
      core-methods-card-container
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
