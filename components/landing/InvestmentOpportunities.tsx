import Image from "next/image";
import Typography from "@/components/ui-kit/common/typography/Typography";
import SectionContainer from "@/components/ui-kit/SectionContainer";

const InvestmentOpportunities: React.FC = () => {
  const pageMeta = {
    title: "Investment Opportunities",
    subTitle: "",
    content: {
      title: "Back Better Ways to Learn and Grow",
      subtitle:
        "We support practical ideas that improve coaching, learning, and personal development.",
      items: [
        {
          text: "CoachChain goes beyond coaching. We invest in thoughtful projects that help people learn, build confidence, and understand their potential.",
        },
        {
          text: "That may mean better learning technology, more useful immersive tools, or a new venture built around human development. We look for work that can make a real difference to individuals and communities.",
        },
      ],
    },
  };

  return (
    <SectionContainer
      title={pageMeta.title}
      text={pageMeta.subTitle}
      className="my-[65px] lg:my-[125px]"
    >
      <div className="flex flex-col gap-[30px] lg:gap-[60px]">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[20px]">
          <div className="flex-1 flex flex-col gap-[24px] lg:max-w-[550px]">
            <div className="flex flex-col gap-[24px]">
              <Typography
                text={pageMeta.content.title}
                className="text-center lg:text-left text-[24px] font-medium leading-normal"
              />

              <Typography
                text={pageMeta.content.subtitle}
                className="text-center lg:text-left text-[16px] font-medium leading-normal"
              />
            </div>

            <div className="flex flex-col gap-[19px]">
              {pageMeta.content.items.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-[10px] text-center lg:text-left border border-[#514BFF] px-[18px] lg:px-[32px] py-[12px] lg:py-[16px] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(81,75,255,0.12)]"
                  >
                    <Typography
                      text={item.text}
                      className="text-[14px] lg:text-[16px] font-medium leading-normal"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex rounded-[20px] overflow-hidden relative group">
            <div className="bg-gradient-to-b lg:bg-gradient-to-r from-[#514BFF] to-[#A376FE] absolute top-0 left-0 right-0 bottom-0 opacity-90 mix-blend-normal z-[1] transition-opacity duration-500 group-hover:opacity-75"></div>
            <Image
              src="/images/image-02.webp"
              alt="CoachChain investment collaboration"
              width={550}
              height={418}
              sizes="(min-width: 1024px) 550px, 100vw"
              className="relative h-[204px] w-full object-cover mix-blend-luminosity transition-transform duration-700 ease-out group-hover:scale-105 lg:h-auto"
            />
          </div>
        </div>

        <div className="text-center">
          <Typography
            text="Help us support ideas that give more people the tools and confidence to grow."
            className="text-[20px] lg:text-[24px] text-[#514BFF] lg:px-[60px] font-medium leading-normal"
          />
        </div>
      </div>
    </SectionContainer>
  );
};

export default InvestmentOpportunities;
