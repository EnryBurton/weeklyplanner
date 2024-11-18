import React from 'react';
import { format } from 'date-fns';
import { useWorkStore } from '../store';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { WEEKLY_TARGETS } from '../types';
import { ProgressBar } from './ProgressBar';

export function Dashboard() {
  const { objectives, outputs, toggleObjective, getWeeklyMetrics } = useWorkStore();
  const weeklyMetrics = getWeeklyMetrics(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6 text-blue-600">Weekly Activity</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Cold Calls</h3>
              <ProgressBar
                value={weeklyMetrics.calls}
                max={WEEKLY_TARGETS.calls}
                color="bg-blue-500"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Emails</h3>
              <ProgressBar
                value={weeklyMetrics.emails}
                max={WEEKLY_TARGETS.emails}
                color="bg-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-green-600">Weekly Objectives</h2>
          <div className="space-y-4">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => toggleObjective(objective.id)}
              >
                {objective.completed ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-gray-400" />
                )}
                <span className={objective.completed ? 'line-through text-gray-500' : ''}>
                  {objective.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6 text-purple-600">Meetings Booked</h2>
          <ProgressBar
            value={weeklyMetrics.meetings}
            max={WEEKLY_TARGETS.meetings}
            color="bg-purple-500"
          />
          <div className="mt-4 space-y-4">
            {outputs
              .filter((output) => output.type === 'meeting')
              .map((output) => (
                <div key={output.id} className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm text-gray-500">
                    {format(new Date(output.date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-gray-600">{output.name}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6 text-orange-600">Opportunities</h2>
          <ProgressBar
            value={weeklyMetrics.opportunities}
            max={WEEKLY_TARGETS.opportunities}
            color="bg-orange-500"
          />
          <div className="mt-4 space-y-4">
            {outputs
              .filter((output) => output.type === 'opportunity')
              .map((output) => (
                <div key={output.id} className="border-l-4 border-orange-500 pl-4">
                  <p className="text-sm text-gray-500">
                    {format(new Date(output.date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-gray-600">{output.name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}