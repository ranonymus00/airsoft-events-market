import React from "react";
import { PlusCircle } from "lucide-react";

interface EmptySectionProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  buttonText: string;
}

const EmptySection: React.FC<EmptySectionProps> = ({
  icon,
  title,
  description,
  buttonText,
}) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      {icon}
      <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200 mx-auto">
        <PlusCircle className="h-5 w-5" />
        <span>{buttonText}</span>
      </button>
    </div>
  );
};

export default EmptySection;
