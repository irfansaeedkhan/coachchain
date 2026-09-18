import React, { ReactNode } from "react";
import Typography from "@/components/ui-kit/common/typography/Typography";

interface Props {
  title: string;
  text: string;
  className?: string;
  children?: ReactNode;
}

const SectionContainer: React.FC<Props> = ({ children, title, text, className = "", ...props }) => {
  return (
    <div className={className} {...props}>
      <div className="flex flex-col items-center gap-[24px] lg:gap-[32px]">
        {title ? (
          <div data-story-title className="perspective-[800px]">
            <Typography
              text={title}
              className="text-center text-[32px] lg:text-[40px] text-[#514BFF] leading-normal font-semibold"
            />
          </div>
        ) : null}

        <Typography
          text={text}
          className="text-center text-[20px] lg:text-[24px] text-[#333] leading-normal font-medium"
        />
      </div>

      {children}
    </div>
  );
};

export default SectionContainer;
