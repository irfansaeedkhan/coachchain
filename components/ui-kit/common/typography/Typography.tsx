import React from 'react';

interface Props {
  text: string;
  className?: string;
  as?: React.ElementType;
}

const Typography: React.FC<Props> = ({ text, className = '', as: Component = 'span', ...props }) => {
  return (
    <Component
      className={`font-montserrat ${className}`}
      {...props}
    >
      {text}
    </Component>
  );
};

export default Typography;