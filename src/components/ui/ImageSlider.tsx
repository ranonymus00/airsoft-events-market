import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ImageSliderProps {
  images: string[];
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, className }) => {
  if (!images || images.length === 0) return null;
  return (
    <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} className={className}>
      {images.map((url, idx) => (
        <div key={idx}>
          <img src={url} alt={`Slider image ${idx + 1}`} className="w-full h-64 object-cover rounded" />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
