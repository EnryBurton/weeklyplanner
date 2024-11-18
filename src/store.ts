import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeeklyActivity, Objective, Output, WeeklyGoals, WEEKLY_TARGETS } from './types';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

interface WorkStore {
  activities: WeeklyActivity[];
  objectives: Objective[];
  outputs: Output[];
  addBulkActivities: (activities: { calls: number; emails: number; date: string }) => void;
  addObjective: (objective: Objective) => void;
  addOutput: (output: Output) => void;
  toggleObjective: (id: string) => void;
  getWeeklyMetrics: (date: Date) => WeeklyGoals;
  getQuarterlyMetrics: () => WeeklyGoals[];
}

export const useWorkStore = create<WorkStore>()(
  persist(
    (set, get) => ({
      activities: [],
      objectives: [],
      outputs: [],
      addBulkActivities: ({ calls, emails, date }) =>
        set((state) => ({
          activities: [
            ...state.activities,
            {
              id: `calls-${Date.now()}`,
              date,
              type: 'call',
              count: calls,
            },
            {
              id: `emails-${Date.now()}`,
              date,
              type: 'email',
              count: emails,
            },
          ],
        })),
      addObjective: (objective) =>
        set((state) => ({
          objectives: [...state.objectives, objective],
        })),
      addOutput: (output) =>
        set((state) => ({
          outputs: [...state.outputs, output],
        })),
      toggleObjective: (id) =>
        set((state) => ({
          objectives: state.objectives.map((obj) =>
            obj.id === id ? { ...obj, completed: !obj.completed } : obj
          ),
        })),
      getWeeklyMetrics: (date: Date) => {
        const state = get();
        const weekStart = startOfWeek(date);
        const weekEnd = endOfWeek(date);

        const weeklyActivities = state.activities.filter((activity) =>
          isWithinInterval(new Date(activity.date), { start: weekStart, end: weekEnd })
        );

        const weeklyOutputs = state.outputs.filter((output) =>
          isWithinInterval(new Date(output.date), { start: weekStart, end: weekEnd })
        );

        return {
          calls: weeklyActivities
            .filter((a) => a.type === 'call')
            .reduce((sum, a) => sum + (a.count || 0), 0),
          emails: weeklyActivities
            .filter((a) => a.type === 'email')
            .reduce((sum, a) => sum + (a.count || 0), 0),
          meetings: weeklyOutputs.filter((o) => o.type === 'meeting').length,
          opportunities: weeklyOutputs.filter((o) => o.type === 'opportunity').length,
        };
      },
      getQuarterlyMetrics: () => {
        const state = get();
        const now = new Date();
        const weeks: WeeklyGoals[] = [];
        
        for (let i = 0; i < 13; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - (i * 7));
          weeks.push(get().getWeeklyMetrics(date));
        }
        
        return weeks.reverse();
      },
    }),
    {
      name: 'work-tracker-storage',
    }
  )
);