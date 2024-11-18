import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
}

export function ProgressBar({ value, max, color }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return color;
  };

  return (
    <div className="relative pt-1">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
            Progress
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-blue-600">
            {value}/{max}
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
        <div
          style={{ width: `${percentage}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor()} transition-all duration-500`}
        />
      </div>
    </div>
  );
}