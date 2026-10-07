export interface Trip {
  id: string; // UUID
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  travelers: number;
  budget: number;
  note?: string | null;
  created_at?: string;
}

export interface Itinerary {
  id: string; // UUID
  trip_id: string; // UUID
  date: string; // YYYY-MM-DD
  time?: string | null; // HH:mm
  location: string;
  note?: string | null;
  created_at?: string;
}

export type ExpenseCategory =
  | 'Di chuyển'
  | 'Lưu trú'
  | 'Ăn uống'
  | 'Vé tham quan'
  | 'Mua sắm'
  | 'Khác';

export interface Expense {
  id: string; // UUID
  trip_id: string; // UUID
  category: ExpenseCategory | string;
  amount: number;
  expense_date: string; // YYYY-MM-DD
  note?: string | null;
  created_at?: string;
}

export type PlaceCategory = 'Check-in' | 'Thiên nhiên' | 'Văn hóa' | 'Ẩm thực';

export interface Place {
  id: string; // UUID
  name: string;
  category: PlaceCategory | string;
  description: string;
  address: string;
  image_url: string;
  created_at?: string;
  is_favorite?: boolean;
}

export interface Favorite {
  id: string; // UUID
  place_id: string; // UUID
  created_at?: string;
}

export interface ChecklistItem {
  id: string; // UUID
  trip_id: string; // UUID
  item: string;
  completed: boolean;
  created_at?: string;
}

export interface TripDetailSummary {
  trip: Trip;
  totalExpense: number;
  remainingBudget: number;
  isOverBudget: boolean;
  totalDays: number;
  itineraryCount: number;
  checklistStats: {
    total: number;
    completed: number;
    percentage: number;
  };
}
