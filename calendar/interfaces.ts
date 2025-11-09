import { CalendarViewType } from "./types";

export interface Event {
  id: string;
  user_id: string;
  name: string;
  category: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  name: string;
  category: string;
  start_date: Date | null;
  end_date: Date | null;
  description: string;
}

export interface CalendarViewOption {
  value: CalendarViewType;
  title: string;
  icon: React.ElementType;
}

export interface CalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
