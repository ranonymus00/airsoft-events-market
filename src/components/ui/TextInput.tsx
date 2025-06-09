import React from "react";
import FormFieldWrapper from "./FormFieldWrapper";

/**
 * TextInput component for all text input fields.
 * Supports label, error, and containerClassName props for consistent styling.
 */
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional label for the text input field.
   */
  label?: string;
  /**
   * Optional error message for the text input field.
   */
  error?: string;
  /**
   * Optional class name for the container element.
   */
  containerClassName?: string;
}

/**
 * Renders a text input field with a label and error message.
 * 
 * @param props TextInputProps
 * @returns JSX.Element
 */
const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => (
  <FormFieldWrapper label={label} error={error} containerClassName={containerClassName}>
    <input
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...props}
    />
  </FormFieldWrapper>
);

export default TextInput;