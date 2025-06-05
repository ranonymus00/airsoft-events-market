import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 ${className}`}>{children}</div>
);

export default Card;
