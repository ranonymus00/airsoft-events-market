import React from 'react';

interface AdSpaceProps {
  className?: string;
  width: string;
  height: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ className = '', width, height }) => {
  return (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <p className="text-gray-400 text-sm">Advertisement Space</p>
    </div>
  );
};

export default AdSpace;