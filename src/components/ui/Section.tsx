import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>{children}</div>
);

export default Section;
