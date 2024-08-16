import React from 'react';
import { useNavigate } from 'react-router-dom';

const images = [
    { id: 1, src: `${process.env.PUBLIC_URL + "/images/image1.jpg"}`, title: 'Image 1' },
    { id: 2, src: `${process.env.PUBLIC_URL + "/images/image2.jpg"}`, title: 'Image 2' },
    { id: 3, src: `${process.env.PUBLIC_URL + "/images/image3.jpg"}`, title: 'Image 3' },
    { id: 4, src: `${process.env.PUBLIC_URL + "/images/image4.jpg"}`, title: 'Image 4' },
  ];

const ImageGallery = () => {
  const navigate = useNavigate();

  const handleDownloadClick = (image) => {
    navigate(`/download/${image.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <img width={200} height={200} src={image.src} alt={image.title} className="w-full h-auto rounded-2xl" />

          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
            <button
              onClick={() => handleDownloadClick(image)}
              className="bg-white text-black py-2 px-4 rounded-lg"
            >
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;