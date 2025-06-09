import React from "react";

interface AvatarUploadProps {
  src: string;
  alt?: string;
  onChange: (url: string) => void;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ src, alt = "Avatar", onChange, className = "" }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await import("../../lib/upload").then(m => m.uploadToSupabase(file, "avatars"));
        onChange(url);
      } catch {
        // Optionally handle error
      }
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img src={src} alt={alt} className="w-32 h-32 rounded-full object-cover" />
      <button
        type="button"
        onClick={handleClick}
        className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-200"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
