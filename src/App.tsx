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
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [error, setError] = useState('');

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
    setFirstInput('');
    setSecondInput('');
    setError('');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const validateAndFlipCards = () => {
    setError('');
    
    // Convert inputs to numbers (subtract 1 to match array indexing)
    const first = parseInt(firstInput) - 1;
    const second = parseInt(secondInput) - 1;
    
    // Validate inputs
    if (isNaN(first) || isNaN(second) || 
        first < 0 || first > 15 || 
        second < 0 || second > 15) {
      setError('Please enter valid card numbers (1-16)');
      return;
    }

    if (first === second) {
      setError('Please select two different cards');
      return;
    }

    if (cards[first].isMatched || cards[second].isMatched) {
      setError('One or both cards are already matched');
      return;
    }

    // Flip cards
    const newCards = [...cards];
    newCards[first].isFlipped = true;
    newCards[second].isFlipped = true;
    setCards(newCards);
    setAttempts(prev => prev + 1);

    // Check for match
    if (cards[first].symbol === cards[second].symbol) {
      newCards[first].isMatched = true;
      newCards[second].isMatched = true;
      setCards(newCards);
      setMatches(prev => {
        const newMatches = prev + 1;
        if (newMatches === symbols.length) {
          setIsWon(true);
        }
        return newMatches;
      });
    } else {
      setTimeout(() => {
        newCards[first].isFlipped = false;
        newCards[second].isFlipped = false;
        setCards(newCards);
      }, 300); // Changed from 1000 to 300 milliseconds
    }

    // Reset inputs
    setFirstInput('');
    setSecondInput('');
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
            <div key={`${i}-${j}`} className="w-full relative">
              <Card
                symbol={card.symbol}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => {}} // Disabled clicking
              />
              <div className="absolute top-1 left-1 bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">
                {cardIndex + 1}
              </div>
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

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={firstInput}
                  onChange={(e) => setFirstInput(e.target.value)}
                  placeholder="First card (1-16)"
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 w-40"
                />
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={secondInput}
                  onChange={(e) => setSecondInput(e.target.value)}
                  placeholder="Second card (1-16)"
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 w-40"
                />
              </div>
              <button
                onClick={validateAndFlipCards}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Flip Cards
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p>
            )}
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