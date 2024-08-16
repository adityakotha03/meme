import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './WordleGame.module.css';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

const WordleGame = ({ onClose, onGameSuccess }) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true); // Add state to manage instructions modal

  useEffect(() => {
    fetchTargetWord();
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (targetWord && !isMobile && !showInstructions) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentGuess, currentRow, gameOver, targetWord, isMobile, showInstructions]);

  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const fetchTargetWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=1&length=5');
      const data = await response.json();
      setTargetWord(data[0].toUpperCase());
    } catch (error) {
      console.error('Error fetching target word:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (gameOver || !targetWord) return;

    if (event.key === 'Enter') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      }
    } else if (event.key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(event.key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + event.key.toUpperCase());
    }
  };

  const handleVirtualKeyPress = (key) => {
    if (gameOver || !targetWord) return;

    if (key === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameOver(true);
      onGameSuccess();
    } else if (currentRow === MAX_GUESSES - 1) {
      setGameOver(true);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentGuess('');
    }
  };

  const getTileClass = (letter, index, row) => {
    if (row > currentRow) return styles.tile;
    if (!letter) return styles.tile;

    if (letter === targetWord[index]) {
      return `${styles.tile} ${styles.correct}`;
    }

    if (targetWord.includes(letter)) {
      const targetCount = targetWord.split(letter).length - 1;
      const correctPositions = guesses[row]
        .slice(0, index)
        .split('')
        .filter((l, i) => l === letter && targetWord[i] === letter).length;
      const yellowPositions = guesses[row]
        .slice(0, index)
        .split('')
        .filter((l, i) => l === letter && targetWord[i] !== letter && targetWord.includes(l)).length;

      if (correctPositions + yellowPositions < targetCount) {
        return `${styles.tile} ${styles.present}`;
      }
    }

    return `${styles.tile} ${styles.absent}`;
  };

  const getKeyClass = (key) => {
    if (key === 'ENTER' || key === 'BACKSPACE') return styles.specialKey;
    
    for (let row = 0; row <= currentRow; row++) {
      const guess = guesses[row];
      const index = guess.indexOf(key);
      if (index !== -1) {
        return getTileClass(key, index, row);
      }
    }
    return styles.key;
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Wordle</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        {showInstructions ? (
          <div className={styles.instructions}>
            <h3 className={styles.title}>How to Play</h3>
            <ul>
              <li>Guess the 5-letter word.</li>
              <li>You have 6 attempts to guess the word.</li>
              <li><span className={`${styles.smallTile} ${styles.correct}`}></span> indicates the correct letter in the correct position.</li>
              <li><span className={`${styles.smallTile} ${styles.present}`}></span> indicates the correct letter in the wrong position.</li>
              <li><span className={`${styles.smallTile} ${styles.absent}`}></span> indicates the letter is not in the word.</li>
            </ul>
            <button onClick={closeInstructions} className={styles.startButton}>Start Game</button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {guesses.map((guess, rowIndex) => (
                <div key={rowIndex} className={styles.row}>
                  {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                    const letter = guess[colIndex] || '';
                    const tileClass = getTileClass(letter, colIndex, rowIndex);
                    return (
                      <div
                        key={colIndex}
                        className={`${tileClass} ${rowIndex === currentRow ? styles.activeTile : ''}`}
                      >
                        {rowIndex === currentRow && colIndex < currentGuess.length ? currentGuess[colIndex] : letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {isMobile && (
              <div className={styles.keyboard}>
                {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.keyboardRow}>
                    {row.map((key) => (
                      <button
                        key={key}
                        className={`${styles.key} ${getKeyClass(key)}`}
                        onClick={() => handleVirtualKeyPress(key)}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {gameOver && (
              <div className={styles.gameOver}>
                <p className={styles.message}>
                  {currentGuess === targetWord ? 'Congratulations!' : `The word was ${targetWord}`}
                </p>
                <button onClick={onClose} className={styles.closeButton}>
                  Close
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WordleGame;