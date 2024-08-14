import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import ImageGallery from './ImageGallery';
import ImageDetails from './ImageDetails';

import './output.css';

function App() {
  return (
    <Router>
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-col text-center justify-center py-8">
        <h1 className='text-xl font-bold'>ChallengePixels</h1>
        <p>Challenge yourself to unlock premium images.</p>
      </header>
      <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ImageGallery />} />
            <Route path="/download/:id" element={<ImageDetails />} />
          </Routes>
        </main>
      <div className="text-center text-sm">
        Created by Your Name
      </div>
    </div>
    </Router>
  );
}

export default App;