import React from 'react';
import { useWorkStore } from '../store';
import { WEEKLY_TARGETS } from '../types';

export function QuarterlySummary() {
  const quarterlyMetrics = useWorkStore((state) => state.getQuarterlyMetrics());

  const getProgressColor = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Quarterly Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(WEEKLY_TARGETS).map(([key, target]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 capitalize">{key}</h3>
            <div className="space-y-4">
              {quarterlyMetrics.map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Week {index + 1}</span>
                    <span>{week[key as keyof typeof week]}/{target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getProgressColor(week[key as keyof typeof week], target)} h-2 rounded-full`}
                      style={{
                        width: `${Math.min((week[key as keyof typeof week] / target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}