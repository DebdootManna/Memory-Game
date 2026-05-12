import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Brain } from 'lucide-react';
import { Card } from './components/Card';
import { shuffleArray } from './utils/shuffle';
import { symbols } from './constants/symbols';
import { Confetti } from './components/Confetti';

function App() {
  const [cards, setCards] = useState<Array<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeGame = () => {
    const cardPairs = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setMatches(0);
    setAttempts(0);
    setIsWon(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isProcessing || cards[index].isFlipped || cards[index].isMatched || flippedCards.length >= 2) {
      return;
    }

    setCards(prev => {
      const newCards = [...prev];
      newCards[index] = { ...newCards[index], isFlipped: true };
      return newCards;
    });

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      setAttempts(prev => prev + 1);

      // We need the symbol of the first card from the current state
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Match found
        setCards(prev => {
          const matchedCards = [...prev];
          matchedCards[firstIndex] = { ...matchedCards[firstIndex], isMatched: true };
          matchedCards[secondIndex] = { ...matchedCards[secondIndex], isMatched: true };
          return matchedCards;
        });
        setFlippedCards([]);
        setMatches(prev => {
          const newMatches = prev + 1;
          if (newMatches === symbols.length) {
            setIsWon(true);
          }
          return newMatches;
        });
      } else {
        // No match
        setIsProcessing(true);
        setTimeout(() => {
          setCards(prev => {
            const resetCards = [...prev];
            resetCards[firstIndex] = { ...resetCards[firstIndex], isFlipped: false };
            resetCards[secondIndex] = { ...resetCards[secondIndex], isFlipped: false };
            return resetCards;
          });
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  // Create a 4x4 grid structure
  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        const cardIndex = i * 4 + j;
        const card = cards[cardIndex];
        if (card) {
          row.push(
            <div key={`${i}-${j}`} className="w-full">
              <Card
                symbol={card.symbol}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(cardIndex)}
              />
            </div>
          );
        }
      }
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-4 gap-3 sm:gap-4">
          {row}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="min-h-screen bg-navy p-4 sm:p-8">
      {isWon && <Confetti />}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Memory Game</h1>
            </div>
            <button
              onClick={initializeGame}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-300">Attempts:</span>
              <span className="font-bold text-red-500">{attempts}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-slate-300">Matches:</span>
              <span className="font-bold text-red-500">{matches}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {renderGrid()}
          </div>

          {isWon && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-2">Congratulations! 🎉</h2>
              <p className="text-slate-300">You won in {attempts} attempts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;