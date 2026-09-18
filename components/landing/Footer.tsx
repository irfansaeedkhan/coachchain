import Image from "next/image";
import Container from "../ui-kit/Container";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/socials";

const FooterLayout: React.FC = () => {

  return (
    <div className="text-white bg-gradient-to-r from-[#514BFF] to-[#A376FE]">
      <Container>
        <div className="flex flex-col gap-[36px] pt-[40px] pb-[26px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-center lg:justify-between">
              <Image
                src="/images/logos/main-logo.svg"
                alt=""
                width={170}
                height={40}
              />
            </div>

            <div className="hidden md:flex gap-[8px]">
              {SOCIAL_LINKS.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[50%]"
                  aria-label={item.title}
                >
                  <Image src={item.icon} alt="" width={24} height={24} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-[55px] items-center text-center lg:text-left justify-between">
          <p className="max-w-[455px] text-[12px] leading-normal font-montserrat font-medium">
            CoachChain combines personal coaching, Montessori principles, AI,
            and immersive learning. We use each tool with a clear purpose: to
            help people practise useful skills, understand their progress, and
            grow with confidence.
          </p>

          <div className="flex flex-col lg:flex-row gap-[34px] lg:gap-[150px] xl:mr-[64px]">
            <div className="flex flex-col gap-[20px]">
              <span className="font-medium text-[14px]">Legal</span>
              <div className="flex flex-col gap-[6px]">
                <Link href="/privacy" className="font-medium text-[12px] leading-[20px]">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="font-medium text-[12px] leading-[20px]">
                  Terms & Conditions
                </Link>
                <Link href="/cookies" className="font-medium text-[12px] leading-[20px]">
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="md:hidden flex gap-[16px] mt-[26px]">
              {SOCIAL_LINKS.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[50%]"
                  aria-label={item.title}
                >
                  <Image src={item.icon} alt="" width={24} height={24} />
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-[20px]">
              <span className="font-medium text-[14px]">
                Contact Information
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-[12px] leading-[20px]">
                  Email: admin@coachchain.io
                </span>
                <span className="font-medium text-[12px] leading-[20px]">
                  Phone: +971 0235568890
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-[100%] bg-white"></div>
        <div className="py-[26px]">
          <span className="block text-center text-white text-[14px] leading-normal font-montserrat font-medium">
            © 2026 CoachChain. All Rights Reserved.
          </span>
        </div>
      </Container>
    </div>
  );
};

export default FooterLayout;
