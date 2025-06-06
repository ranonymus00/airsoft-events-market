import React from "react";

interface FormFieldWrapperProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  error,
  containerClassName = "",
  children,
}) => (
  <div className={containerClassName}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default FormFieldWrapper;