import Image from "next/image";
import Typography from "@/components/ui-kit/common/typography/Typography";
import SectionContainer from "@/components/ui-kit/SectionContainer";

const AboutUs: React.FC = () => {
  const pageMeta = {
    title: "About Us",
    subTitle: "",
    content: {
      title: "Timeless learning principles, built for today",
      items: [
        {
          text: "CoachChain brings proven coaching and Montessori principles into modern learning environments.",
        },
        {
          text: "We use AI and immersive tools where they add real value, helping people practise, reflect, and grow with confidence.",
        },
      ],
    },
  };

  return (
    <SectionContainer
      title={pageMeta.title}
      text={pageMeta.subTitle}
      className="my-[65px] lg:my-[125px] relative"
    >
      <div className="flex flex-col gap-[30px] lg:gap-[60px] relative z-10 pb-10">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[20px]">
          <div className="flex-1 flex flex-col gap-[47px] lg:max-w-[550px]">
            <Typography
              text={pageMeta.content.title}
              className="text-[24px] font-medium leading-normal"
            />

            <div className="flex flex-col gap-[19px]">
              {pageMeta.content.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[10px] text-center lg:text-left border border-[#514BFF] px-[18px] lg:px-[32px] py-[12px] lg:py-[30px] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(81,75,255,0.12)]"
                >
                  <Typography
                    text={item.text}
                    className="text-[14px] lg:text-[16px] font-medium leading-normal"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex rounded-[20px] overflow-hidden relative group">
            <div className="bg-gradient-to-b lg:bg-gradient-to-r from-[#514BFF] to-[#A376FE] absolute top-0 left-0 right-0 bottom-0 opacity-90 mix-blend-normal z-[1] transition-opacity duration-500 group-hover:opacity-75"></div>
            <Image
              src="/images/image-01.webp"
              alt="CoachChain learning session"
              width={550}
              height={358}
              sizes="(min-width: 1024px) 550px, 100vw"
              className="relative h-full w-full object-cover mix-blend-luminosity transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        <div className="text-center">
          <Typography
            text="Whether you are seeking personal development, professional coaching, or innovative educational methods for children, CoachChain offers tailored solutions for every stage of life."
            className="text-[16px] font-medium leading-normal"
          />
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutUs;
