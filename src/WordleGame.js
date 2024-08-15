import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './WordleGame.module.css';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const WordleGame = ({ onClose, onGameSuccess }) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetchTargetWord();
  }, []);

  useEffect(() => {
    if (targetWord) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentGuess, currentRow, gameOver, targetWord]);

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

  if (!targetWord) return <div>Loading...</div>;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Wordle</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
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
      </div>
    </div>
  );
};

export default WordleGame;