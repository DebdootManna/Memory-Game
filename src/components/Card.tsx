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
      whileHover={{ scale: isFlipped ? 1 : 1.05 }}
      onClick={onClick}
    >
      <motion.div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute w-full h-full backface-hidden">
          <div
            className={`w-full h-full rounded-xl flex items-center justify-center ${
              isMatched ? 'bg-green-900' : 'bg-slate-800'
            } shadow-md border-2 ${isMatched ? 'border-green-700' : 'border-slate-700'}`}
          >
            <span className="text-2xl">❓</span>
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div
            className={`w-full h-full rounded-xl flex items-center justify-center ${
              isMatched ? 'bg-green-900' : 'bg-slate-700'
            } shadow-md border-2 ${isMatched ? 'border-green-700' : 'border-slate-700'}`}
          >
            <span className="text-4xl select-none pointer-events-none">{symbol}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}