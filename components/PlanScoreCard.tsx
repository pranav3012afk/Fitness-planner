import React from 'react';
import { TrophyIcon } from './icons/TrophyIcon';

interface PlanScoreCardProps {
  score: number;
  message: string;
}

export const PlanScoreCard: React.FC<PlanScoreCardProps> = ({ score, message }) => {
  const circumference = 2 * Math.PI * 54; // 2 * pi * radius
  const offset = circumference - (score / 100) * circumference;

  const scoreColor = score > 85 ? 'text-green-400' : score > 70 ? 'text-yellow-400' : 'text-orange-400';
  const strokeColor = score > 85 ? 'stroke-green-400' : score > 70 ? 'stroke-yellow-400' : 'stroke-orange-400';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="72"
            cy="72"
            r="54"
            stroke="currentColor"
            strokeWidth="10"
            className="text-gray-700"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r="54"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${strokeColor}`}
            fill="transparent"
          />
        </svg>
        <span className={`absolute text-4xl font-extrabold ${scoreColor}`}>
          {score}
        </span>
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <TrophyIcon className="w-7 h-7 text-amber-400" />
            Your Plan Score
        </h3>
        <p className="mt-2 text-gray-300 italic">"{message}"</p>
      </div>
    </div>
  );
};
