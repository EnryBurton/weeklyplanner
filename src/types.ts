export interface WeeklyActivity {
  id: string;
  date: string;
  type: 'call' | 'email';
  count: number;
}

export interface Objective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Output {
  id: string;
  date: string;
  type: 'meeting' | 'opportunity';
  name: string;
}

export interface WeeklyGoals {
  calls: number;
  emails: number;
  meetings: number;
  opportunities: number;
}

export const WEEKLY_TARGETS: WeeklyGoals = {
  calls: 100,
  emails: 60,
  meetings: 7,
  opportunities: 5,
};