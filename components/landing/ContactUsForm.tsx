import React, { ReactNode, FormHTMLAttributes } from "react";

import Tuber from "@/components/ui-kit/common/button/Tuber";
import Typography from "../ui-kit/common/typography/Typography";
import InputText from "@/components/ui-kit/common/input/InputText";
import InputTextarea from "@/components/ui-kit/common/input/InputTextarea";

interface ContactUsFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children?: ReactNode;
}

const ContactUsForm: React.FC<ContactUsFormProps> = ({ ...props }) => {
  return (
    <form className="rounded-[20px] border border-[#514BFF] px-[24px] lg:px-[40px] max-w-[592px]" {...props}>
      <div className="flex flex-col gap-[34px] my-[24px]">
        <div className="text-center flex flex-col gap-[14px]">
          <Typography
            text="Fill out the form below and tell us what interests you most."
            className="px-[10px] lg:px-0 text-[14px] lg:text-[16px] font-medium"
          />
          <Typography text="Let’s shape the future together." className="text-[20px] lg:text-[24px] font-medium" />
        </div>

        <div className="flex flex-col gap-[34px]">
          <InputText placeholder="Enter your full name" label="Full Name *" id="fullname" />
          <InputText placeholder="Enter your email address" label="Email Address *" id="email" />
          <InputText placeholder="Enter your phone number" label="Phone Number" id="phone" />
          <InputText placeholder="Coaching programs" label="What Are You Interested In?" id="interest" />
          <InputTextarea placeholder="Enter your message" label="Message" id="message" />
          <Tuber
            text="Get in Touch"
            type="submit"
            className="bg-primary text-white py-[16px] font-medium text-[16px] lg:text-[24px] mb-[24px] rounded-[10px] gradient-btn transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
          />
        </div>
      </div>
    </form>
  );
};

export default ContactUsForm;
