/**
 * Button component for consistent UI actions
 */
interface ButtonProps {
  variant?: "primary" | "secondary" | "cancel" | "link";
  title?: string;
  size?: "normal" | "small" | "link";
  type?: "button" | "submit";
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  title,
  size = "normal",
  type = "button",
  disabled,
  leftIcon,
  rightIcon,
  className,
  onClick,
  children,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      default:
      case "primary":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      case "secondary":
        return "bg-slate-800 hover:bg-slate-700 text-white";
      case "link":
        return "text-orange-500 hover:text-orange-600";
      case "cancel":
        return "text-gray-700 border border-gray-300  hover:bg-gray-50";
    }
  };

  const getButtonSize = () => {
    switch (size) {
      default:
      case "normal":
        return "py-3 px-8";
      case "small":
        return "py-2 px-4";
      case "link":
        return "";
    }
  };

  return (
    <button
      title={title}
      type={type}
      className={`flex items-center justify-center gap-2 ${getButtonStyle()} ${getButtonSize()} rounded-md font-bold transition-colors duration-200 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIcon && leftIcon}
      <span>{children}</span>
      {rightIcon && rightIcon}
    </button>
  );
};

export default Button;
