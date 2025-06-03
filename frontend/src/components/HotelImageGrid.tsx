import { memo } from "react";


const HotelImageGrid = memo(({images,onImageClick}: {
  images: string[];
  onImageClick: (image: string) => void;
}) => (

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {images.map((image, index) => (
      <div className="h-[300px] relative group" key={index}>
        <img
          src={image}
          alt="Hotel"
          className="rounded-md w-full h-full object-cover object-center"
          loading="eager"
        />
        <div
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-md flex items-center justify-center"
          onClick={() => onImageClick(image)}
        >
          <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
            View
          </p>
        </div>
      </div>
    ))}
  </div>
));

export default HotelImageGrid;