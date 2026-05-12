import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ symbol, isFlipped, isMatched, onClick }) => {
  return (
    <motion.div
      className="aspect-square cursor-pointer perspective-1000"
      whileHover={{ scale: isFlipped || isMatched ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-full h-full transform-style-3d"
      >
        {/* Front of card (Hidden) */}
        <div className="absolute w-full h-full backface-hidden">
          <div
            className={`w-full h-full rounded-xl flex items-center justify-center bg-slate-800 shadow-lg border-2 border-slate-700 hover:border-red-500/50 transition-colors`}
          >
            <span className="text-3xl sm:text-4xl">❓</span>
          </div>
        </div>

        {/* Back of card (Symbol) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div
            className={`w-full h-full rounded-xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${
              isMatched 
                ? 'bg-green-500/20 border-green-500 shadow-green-500/20' 
                : 'bg-slate-700 border-slate-600'
            }`}
          >
            <span className="text-4xl sm:text-5xl select-none pointer-events-none drop-shadow-sm">
              {symbol}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};