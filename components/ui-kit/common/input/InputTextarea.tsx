import React from "react";
interface InputTextareaProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  label: string;
  id: string;
}

const InputTextarea: React.FC<InputTextareaProps> = ({ placeholder, label, id }) => {
  return (
    <div className="relative">
      <textarea
        id={id}
        placeholder={placeholder}
        className="peer px-[14px] lg:px-[28px] py-[20px] w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[10px] lg:text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-300/30 focus:border-gray-300/30 bg-transparent placeholder:text-black/30"
      />

      <label
        htmlFor={id}
        className="absolute left-3 top-0 transform -translate-y-1/2  text-[10px] lg:text-[14px] font-montserrat font-medium px-[8px] py-2 bg-[#9c83ff] rounded-2xl"
      >
        {label}
      </label>
    </div>
  );
};

export default InputTextarea;
