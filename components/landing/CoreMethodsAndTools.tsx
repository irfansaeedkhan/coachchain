"use client";

import Typography from "@/components/ui-kit/common/typography/Typography";
import SectionContainer from "@/components/ui-kit/SectionContainer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import Card from "@/components/ui-kit/common/card/Card";

const CoreMethodsAndTools: React.FC = () => {
  // const pageMeta = {
  //   title: "Core Methods and Tools",
  //   subTitle: "Unlock Potential with Advanced Coaching Tools",
  //   content: {
  //     title:
  //       "Experience a transformative journey powered by cutting-edge methodologies and technologies. CoachChain integrates traditional coaching principles with innovative tools, ensuring a personalized, impactful, and future-ready approach to growth",
  //     items: [
  //       {
  //         title: "Personalized AI Insights",
  //         subTitle: "Tailored Strategies with AI",
  //         text: "Advanced Artificial Intelligence analyzes your unique goals, behaviors, and preferences to designa coaching experience just for you. AI provides actionable insights, real-time feedback, and adaptive strategies, making growth measurable and continuous",
  //         icon: "/images/icons/1.svg",
  //       },
  //       {
  //         title: "Immersive Metaverse Experiences",
  //         subTitle: "Virtual Worlds, Real Growth",
  //         text: "Step into the metaverse to participate in dynamic coaching sessions. Engage in virtual simulations, role-playing exercises, and interactive workshops that create a rich, immersive environment for learning and transformation",
  //         icon: "/images/icons/2.svg",
  //       },
  //       {
  //         title: "Gamification for Motivation",
  //         subTitle: "Fun Meets Achievement",
  //         text: "Stay motivated with gamified elements that make your journey engaging and rewarding. Track your progress, unlock milestones, and achieve your goals through challenges designed to foster active participation.",
  //         icon: "/images/icons/3.svg",
  //       },
  //       {
  //         title: "Holistic Coaching Frameworks",
  //         subTitle: "Balancing Growth and Well-Being",
  //         text: "Our approach blends Montessori-inspired methods, emotional intelligence training, and mindfulness practices to nurture both professional growth and personal well-being. Achieve sustainable success with a balanced framework tailored to your needs.",
  //         icon: "/images/icons/4.svg",
  //       },
  //       {
  //         title: "Innovative Growth Investments",
  //         subTitle: "Beyond Coaching: Invest in Transformation",
  //         text: "Expand your horizons with opportunities to engage in forward-thinking projects aligned with your growth goals. CoachChain supports innovation-driven initiatives that complement personal and organizational development.",
  //         icon: "/images/icons/5.svg",
  //       },
  //     ],
  //   },
  // };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const pageMeta = {
    title: "Core Methods and Tools",
    subTitle: "Practical tools for lasting progress",
    content: {
      title:
        "CoachChain combines personal coaching, AI feedback, immersive practice, and Montessori-inspired learning. Each tool has a clear purpose: help you understand where you are, practise what matters, and keep moving.",
      items: [
        {
          title: "Personal AI Insights",
          subTitle: "Feedback Based on Your Goals",
          text: "AI helps identify patterns in your goals, habits, and progress. You receive useful feedback that your coach can turn into clear next steps.",
          icon: "/images/icons/1.svg",
        },
        {
          title: "Immersive Practice",
          subTitle: "A Safe Place to Try New Skills",
          text: "Use virtual simulations, role-play, and interactive workshops to practise real situations before facing them at work or in daily life.",
          icon: "/images/icons/2.svg",
        },
        {
          title: "Progress You Can See",
          subTitle: "Small Wins Build Momentum",
          text: "Track milestones, take on focused challenges, and see how far you have come. Clear progress makes it easier to stay engaged.",
          icon: "/images/icons/3.svg",
        },
        {
          title: "Whole-Person Coaching",
          subTitle: "Growth That Fits Your Life",
          text: "Montessori-inspired learning, emotional intelligence, and mindfulness support your work, well-being, and long-term development.",
          icon: "/images/icons/4.svg",
        },
        {
          title: "Investment in Better Learning",
          subTitle: "Support Ideas with a Purpose",
          text: "Take part in projects that improve how people learn, coach, and grow. We support ideas with practical value for individuals and organizations.",
          icon: "/images/icons/5.svg",
        },
      ],
    },
  };

  return (
    <SectionContainer
      title={pageMeta.title}
      text=""
      className="my-[60px] md:my-[125px]"
    >
      <div className="flex flex-col items-center">
        <Typography
          text={pageMeta.content.title}
          className="max-w-[877px] text-center text-[14px] md:text-[16px] font-medium leading-normal mt-[38px] mb-[22px]"
        />
      </div>
      <div className="py-[22px]">
        <Slider {...settings} className="slider-container">
          {pageMeta.content.items.map((item, index) => {
            return (
              <Card
                key={index}
                title={item.title}
                subTitle={item.subTitle}
                text={item.text}
                icon={item.icon}
                className="text-center  w-[100%] mt-[112px]"
              />
            );
          })}
        </Slider>
      </div>
    </SectionContainer>
  );
};

export default CoreMethodsAndTools;
