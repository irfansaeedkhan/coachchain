import Typography from "@/components/ui-kit/common/typography/Typography";
import SectionContainer from "@/components/ui-kit/SectionContainer";
import ContactUsForm from "@/components/landing/ContactUsForm";

const ContactUs: React.FC = () => {
  const pageMeta = {
    title: "Start a Conversation",
    subTitle: "",
    content: {
      title: "Tell Us What You Want to Build",
      items: [
        {
          text: "CoachChain brings proven coaching principles into modern learning environments.",
        },
        {
          text: "We use Montessori principles, AI, and immersive tools to create practical learning experiences.",
        },
      ],
    },
  };

  return (
    <div className="flex flex-col items-center mb-[15rem] lg:mb-[30%]">
      <div data-story-title className="perspective-[800px] pb-14">
        <Typography
          text={"Start a Conversation"}
          className="text-center text-[32px] lg:text-[40px] text-[#514BFF] leading-normal font-semibold"
        />
      </div>
      <SectionContainer
        className="relative min-h-[70rem] lg:min-h-[60rem] pt-[40px] lg:pt-2 px-[20px] lg:px-[168px] shadow-custom rounded-[30px] lg:rounded-[100px] contact-container text-white"
        title={""}
        text={pageMeta.subTitle}
      >
        <div className="flex flex-col items-center gap-[34px] max-[380px]:mt-[-26px]">
          <div className="text-center flex flex-col gap-[25px]">
            <Typography
              className=" text-[14px] lg:text-[16px] font-medium"
              text="Looking for coaching, a project partner, or an investment opportunity? Tell us what you have in mind."
            />

            <Typography
              className="text-[20px] lg:text-[24px] font-medium max-w-[689px]"
              text="Let’s see what we can build together."
            />

            <Typography
              className="px]:text-[10px] text-[14px] lg:text-[16px] font-medium"
              text="We work with individuals and organizations that care about better coaching and learning. Share your goals with us, and we’ll help you find the right next step."
            />
          </div>
        </div>

        {/* Move ContactUsForm Out of the Container */}
        <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-[50px] z-10 w-[95%] lg:w-[80%]">
          <ContactUsForm className="rounded-[20px] px-[14px] lg:px-[40px]  w-full lg:max-w-[592px] form-box text-white mx-auto relative" />
        </div>
      </SectionContainer>
    </div>
  );
};

export default ContactUs;
