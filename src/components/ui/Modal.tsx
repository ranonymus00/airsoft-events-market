import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  height?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
  height = "h-[90dvh]",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${maxWidth} w-full mx-4 overflow-auto ${height}`}>
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;