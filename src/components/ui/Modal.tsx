import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  height?: string;
  onClose?: () => void;
}

/**
 * Modal dialog component for displaying content in an overlay.
 * Includes accessibility attributes and keyboard handling.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  maxWidth = "max-w-2xl",
  height = "h-[90dvh]",
  onClose,
}) => {
  // Always call hooks at the top
  React.useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Close modal on background click
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
    >
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