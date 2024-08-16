import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import WordleGame from './WordleGame';

const images = [
  {
    id: 1,
    src: `${process.env.PUBLIC_URL + "/images/image1.jpg"}`,
    title: 'City Lights at Dusk',
    description: 'Capture the vibrant energy of the city as the evening sets in. This footage showcases the bustling streets illuminated by the warm glow of streetlights and neon signs, perfect for urban-themed projects.',
    keywords: ['city', 'night', 'streetlights', 'urban', 'neon', 'evening']
  },
  {
    id: 2,
    src: `${process.env.PUBLIC_URL + "/images/image2.jpg"}`,
    title: 'Blossom Elegance',
    description: 'A stunning close-up of blooming purple peonies against a dark background. This footage highlights the intricate details of the petals, making it ideal for nature, beauty, or floral-themed content.',
    keywords: ['flowers', 'peonies', 'blossom', 'nature', 'floral', 'beauty']
  },
  {
    id: 3,
    src: `${process.env.PUBLIC_URL + "/images/image3.jpg"}`,
    title: 'Tropical Paradise',
    description: 'Experience the tranquility of a secluded beach with turquoise waters and towering palm trees. This footage is perfect for projects focused on travel, relaxation, or tropical destinations.',
    keywords: ['beach', 'tropical', 'paradise', 'palm trees', 'ocean', 'travel']
  },
  {
    id: 4,
    src: `${process.env.PUBLIC_URL + "/images/image4.jpg"}`,
    title: 'Majestic Tiger in Focus',
    description: 'A powerful and graceful tiger prowling with an intense gaze. This footage captures the raw beauty and strength of one of nature\'s most magnificent creatures, making it a perfect fit for wildlife, adventure, or conservation themes.',
    keywords: ['tiger', 'wildlife', 'animal', 'majestic', 'nature', 'predator']
  },
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
    setShowGame(true);
  };

  const handleGameSuccess = () => {
    setShowGame(false); // Close the game popup
  
    // Start the download process immediately
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
  
    // Show the success message with the link
    const successMessage = document.createElement('div');
    successMessage.style.position = 'fixed';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.backgroundColor = '#fff';
    successMessage.style.padding = '20px';
    successMessage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    successMessage.style.borderRadius = '8px';
    successMessage.style.textAlign = 'center';
    successMessage.style.zIndex = '1000';
  
    const messageText = document.createElement('p');
    messageText.innerText = 'Congratulations! You solved the puzzle! Check out how to access the .meme files ';
    
    const link = document.createElement('a');
    link.href = 'https://github.com/adityakotha03/meme/tree/main?tab=readme-ov-file#how-to-use-the-meme-files';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerText = 'here';
    link.style.color = '#3498db';
    link.style.textDecoration = 'underline';
    
    messageText.appendChild(link);
    successMessage.appendChild(messageText);
    
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#3498db';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
  
    closeButton.addEventListener('click', () => {
      document.body.removeChild(successMessage);
    });
  
    successMessage.appendChild(closeButton);
    document.body.appendChild(successMessage);
  };  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="relative w-full max-w-[600px] mb-8">
        <img src={image.src} alt={image.title} className="w-full h-auto rounded-2xl shadow-lg" />
      </div>
      <header className="flex flex-col text-center justify-center py-8">
        <h1 className="text-2xl font-bold">{image.title}</h1>
        <p className="text-lg text-gray-700 mt-2 max-w-2xl">{image.description}</p>
      </header>
      {/* <div className="flex flex-wrap justify-center items-center mt-8 gap-2">
        {image.keywords.map((keyword, index) => (
          <div key={index} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium py-1 px-3 rounded-full shadow-sm">
            <Tag className="mr-1 w-4 h-4 text-gray-600" />
            {keyword}
          </div>
        ))}
      </div> */}
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