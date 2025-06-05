import React from "react";
import { PlusCircle } from "lucide-react";
import Button from "./Button";

interface EmptySectionProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const EmptySection: React.FC<EmptySectionProps> = ({
  icon,
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      {icon}
      <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <Button
        variant="link"
        leftIcon={<PlusCircle className="h-5 w-5" />}
        onClick={onButtonClick}
        className="m-auto"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptySection;
