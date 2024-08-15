import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './WordleGame.module.css';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const TARGET_WORD = "CRAZE";

const WordleGame = ({ onClose, onGameSuccess }) => {
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, currentRow, gameOver]);

  const handleKeyDown = (event) => {
    if (gameOver) return;
    
    if (event.key === 'Enter') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      }
    } else if (event.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(event.key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + event.key.toUpperCase());
    }
  };

  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === TARGET_WORD) {
      setGameOver(true);
      onGameSuccess();
    } else if (currentRow === MAX_GUESSES - 1) {
      setGameOver(true);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentGuess("");
    }
  };

  const getTileClass = (letter, index, row) => {
    if (row > currentRow) return styles.tile;
    if (!letter) return styles.tile;

    if (letter === TARGET_WORD[index]) {
      return `${styles.tile} ${styles.correct}`;
    }

    if (TARGET_WORD.includes(letter)) {
      // Count occurrences of the letter in the target word
      const targetCount = TARGET_WORD.split(letter).length - 1;
      // Count correct positions of this letter before this index
      const correctPositions = guesses[row]
        .slice(0, index)
        .split('')
        .filter((l, i) => l === letter && TARGET_WORD[i] === letter).length;
      // Count yellow positions of this letter before this index
      const yellowPositions = guesses[row]
        .slice(0, index)
        .split('')
        .filter((l, i) => l === letter && TARGET_WORD[i] !== letter && TARGET_WORD.includes(l)).length;

      if (correctPositions + yellowPositions < targetCount) {
        return `${styles.tile} ${styles.present}`;
      }
    }

    return `${styles.tile} ${styles.absent}`;
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
        <div className={styles.grid}>
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const letter = guess[colIndex] || "";
                const tileClass = getTileClass(letter, colIndex, rowIndex);
                return (
                  <div
                    key={colIndex}
                    className={`${tileClass} ${rowIndex === currentRow ? styles.activeTile : ""}`}
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
            <p className={styles.message}>{currentGuess === TARGET_WORD ? "Congratulations!" : `The word was ${TARGET_WORD}`}</p>
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