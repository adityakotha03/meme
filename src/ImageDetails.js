import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const images = [
  { id: 1, src: `${process.env.PUBLIC_URL + "/images/image1.jpg"}`, title: 'Game 1', description: 'this is how you play game 1' },
  { id: 2, src: `${process.env.PUBLIC_URL + "/images/image2.jpg"}`, title: 'Game 2', description: 'this is how you play game 2' },
  { id: 3, src: `${process.env.PUBLIC_URL + "/images/image3.jpg"}`, title: 'Game 3', description: 'this is how you play game 3' },
  { id: 4, src: `${process.env.PUBLIC_URL + "/images/image4.jpg"}`, title: 'Game 4', description: 'this is how you play game 4' },
];

const ImageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const image = images.find((img) => img.id === parseInt(id));

  if (!image) {
    return <div>Image not found</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <img src={image.src} alt={image.title} className="w-full h-auto mb-4 rounded-2xl max-w-[600px]" />
      <h2 className="text-2xl mb-2">{image.title}</h2>
      <p>{image.description}</p>
      <div className="flex flex-col md:flex-row gap-2 mt-6">
        <a
            href={image.src}
            download
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded"
        >
            Download
        </a>
        <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black py-2 px-4 rounded"
        >
            Back
        </button>
      </div>
    </div>
  );
};

export default ImageDetails;