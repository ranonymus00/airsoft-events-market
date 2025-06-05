import React from "react";

const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 ${className}`}></div>
);

export default Spinner;
