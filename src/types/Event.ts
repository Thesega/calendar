export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: number; // in minutes
  color: string;
  type: 'one-day' | 'weekly' | 'monthly' | 'yearly';
  recurrence?: {
    daysOfWeek?: number[]; // 0-6, Sunday-Saturday
    dayOfMonth?: number; // 1-31
    dayAndMonth?: { day: number; month: number }; // for yearly
  };
  description?: string;
}

export interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}