import React, { ReactNode, HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, ...props }) => {
  return (
    <div className="max-w-[1120px] mx-auto px-4" {...props}>
      {children}
    </div>
  );
};

export default Container;
