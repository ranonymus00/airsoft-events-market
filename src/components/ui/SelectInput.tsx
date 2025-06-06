import React from "react";
import FormFieldWrapper from "./FormFieldWrapper";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  children,
  ...props
}) => (
  <FormFieldWrapper label={label} error={error} containerClassName={containerClassName}>
    <select
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  </FormFieldWrapper>
);

export default SelectInput;