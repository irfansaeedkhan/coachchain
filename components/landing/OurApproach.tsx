"use client";

import { useRef } from "react";
import Image from "next/image";
import Typography from "@/components/ui-kit/common/typography/Typography";
import SectionContainer from "@/components/ui-kit/SectionContainer";
import gsap from "gsap";

const OurApproach: React.FC = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;

    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = ((centerY - y) / centerY) * 6;

    const iconWrap = card.querySelector(".approach-icon-wrap") as HTMLElement | null;
    const glow = card.querySelector(".approach-icon-glow") as HTMLElement | null;

    gsap.to(card, {
      rotateX,
      rotateY,
      y: -10,
      duration: 0.45,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center center",
    });

    if (iconWrap) {
      const mx = ((x - centerX) / centerX) * 10;
      const my = ((y - centerY) / centerY) * 10;
      gsap.to(iconWrap, { x: mx, y: my, duration: 0.35, ease: "power2.out" });
    }

    if (glow) {
      gsap.to(glow, { opacity: 1, scale: 1.15, duration: 0.35, ease: "power2.out" });
    }
  };

  const handleCardLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const iconWrap = card.querySelector(".approach-icon-wrap") as HTMLElement | null;
    const glow = card.querySelector(".approach-icon-glow") as HTMLElement | null;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.55)",
    });

    if (iconWrap) {
      gsap.to(iconWrap, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }

    if (glow) {
      gsap.to(glow, { opacity: 0.45, scale: 1, duration: 0.45, ease: "power2.out" });
    }
  };

  const pageMeta = {
    title: "Our Approach",
    subTitle: "Coaching that adapts to the person",
    content: {
      title: "A clear approach to meaningful progress",
      items: [
        {
          title: "Coaching Built Around You",
          icon: "/images/icons/7.svg",
          text: "Your goals, pace, and way of learning shape the program.",
        },
        {
          title: "Immersive Engagement",
          icon: "/images/icons/6.svg",
          text: "Practise new skills in interactive sessions that keep learning active.",
        },
        {
          title: "Montessori Values for Modern Coaching",
          icon: "/images/icons/8.svg",
          text: "Build curiosity, independence, and confidence through Montessori-inspired coaching.",
        },
      ],
    },
  };

  return (
    <SectionContainer
      className="my-[65px] lg:my-[125px] pt-[62px] pb-[80px] px-[20px] lg:px-[168px] shadow-custom rounded-[30px] lg:rounded-[100px]"
      title={pageMeta.title}
      text={pageMeta.subTitle}
    >
      <div className="flex flex-col gap-[30px] lg:gap-[30px]">
        <Typography
          text="We combine thoughtful coaching with practical tools, then adapt the experience to the person."
          className="pt-[32px] text-center block text-[16px] font-medium"
        />

        <div className="lg:h-[362px] lg:relative approach-cards-stage">
          <div className="lg:absolute lg:w-[100dvw] left-0 lg:left-[50%] transform lg:-translate-x-1/2 flex flex-col lg:flex-row gap-[30px] lg:gap-[20px]">
            {pageMeta.content.items.map((item, index) => {
              return (
                <div
                  key={index}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  onMouseMove={(e) => handleCardMove(e, index)}
                  onMouseLeave={() => handleCardLeave(index)}
                  className={`approach-card flex flex-col items-center bg-primary text-white px-[54px] pt-[30px] pb-[26px] w-full lg:w-1/3 gap-[34px] rounded-full will-change-transform
                  ${
                    index === 0
                      ? "card-left"
                      : index === 2
                        ? "card-right"
                        : "card-center"
                  }
                  `}
                >
                  <div className="relative flex justify-center items-center icon-container approach-icon-wrap">
                    <span className="approach-icon-glow" aria-hidden />
                    <span className="approach-icon-ring" aria-hidden />
                    <span className="approach-icon-ring approach-icon-ring--delay" aria-hidden />
                    <div className="approach-icon-inner relative z-10">
                      <Image
                        src={item.icon}
                        alt=""
                        width={72}
                        height={72}
                        className="relative z-10 approach-icon-img"
                      />
                    </div>
                  </div>
                  <Typography
                    text={item.title}
                    className="text-center font-bold text-[16px]"
                  />

                  <Typography
                    text={item.text}
                    className="text-center font-medium text-[16px]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col text-center gap-[20px]">
          <Typography
            text="You get a clear approach that connects learning, practice, and real progress."
            className="text-[16px] font-medium"
          />

          <Typography
            text="Build confidence that carries into your work and life."
            className="text-[24px] font-medium text-[#514BFF]"
          />
        </div>
      </div>
    </SectionContainer>
  );
};

export default OurApproach;
