import React from "react";
import FormFieldWrapper from "./FormFieldWrapper";

interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => (
  <FormFieldWrapper label={label} error={error} containerClassName={containerClassName}>
    <textarea
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...props}
    />
  </FormFieldWrapper>
);

export default TextareaInput;