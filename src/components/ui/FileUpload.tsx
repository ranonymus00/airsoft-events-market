import React from "react";
import FormFieldWrapper from "./FormFieldWrapper";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => (
  <FormFieldWrapper label={label} error={error} containerClassName={containerClassName}>
    <input
      type="file"
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...props}
    />
  </FormFieldWrapper>
);

export default FileUpload;