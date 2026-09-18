import React from 'react';

interface TuberProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  type?: 'button' | 'submit' | 'reset'; // محدود کردن type به یکی از این مقادیر
  className?: string;
}

const Tuber: React.FC<TuberProps> = ({ text, type='button', className = 'rounded-[5px]', ...props }) => {
  return (
    <button
      type={type}
      className={`w-auto border border-white font-montserrat ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Tuber;
