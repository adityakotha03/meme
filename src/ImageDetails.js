import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WordleGame from './WordleGame';

const images = [
  { id: 1, src: `${process.env.PUBLIC_URL + "/images/image1.jpg"}`, title: 'Game 1', description: 'this is how you play game 1' },
  { id: 2, src: `${process.env.PUBLIC_URL + "/images/image2.jpg"}`, title: 'Game 2', description: 'this is how you play game 2' },
  { id: 3, src: `${process.env.PUBLIC_URL + "/images/image3.jpg"}`, title: 'Game 3', description: 'this is how you play game 3' },
  { id: 4, src: `${process.env.PUBLIC_URL + "/images/image4.jpg"}`, title: 'Game 4', description: 'this is how you play game 4' },
];

const ImageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showGame, setShowGame] = useState(false);
  const image = images.find((img) => img.id === parseInt(id));

  if (!image) {
    return <div>Image not found</div>;
  }

  const handleDownload = () => {
    setShowGame(true); // Show the Wordle game when the download button is clicked
  };

  const handleGameSuccess = () => {
    setShowGame(false); // Close the game popup

    fetch(image.src)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageDataUrl = reader.result;
          const base64Data = imageDataUrl.split(',')[1];

          // Convert base64 data back to binary
          const binary = atob(base64Data);
          const array = [];
          for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          const newBlob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });

          // Create a download link
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(newBlob);
          downloadLink.download = `${image.title}.meme`;
          downloadLink.click();
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => console.error('Error while fetching the image:', err));
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="relative w-full max-w-[600px] mb-4">
        <img src={image.src} alt={image.title} className="w-full h-auto rounded-2xl" />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* <div className="watermark"></div> */}
        </div>
      </div>
      
      <h2 className="text-2xl mb-2">{image.title}</h2>
      <p>{image.description}</p>
      <div className="flex flex-col md:flex-row gap-2 mt-6">
        <button
          onClick={handleDownload}
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded"
        >
          Download as .meme
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-black py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
      {showGame && (
        <WordleGame
          onClose={() => setShowGame(false)}
          onGameSuccess={handleGameSuccess}
        />
      )}
    </div>
  );
};

export default ImageDetails;