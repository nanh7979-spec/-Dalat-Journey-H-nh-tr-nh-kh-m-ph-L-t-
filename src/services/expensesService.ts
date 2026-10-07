import { Expense } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const expensesService = {
  async getByTripId(tripId: string): Promise<Expense[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('expense_date', { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []) as Expense[];
    }

    const res = await fetch(`/api/trips/${tripId}/expenses`);
    if (!res.ok) throw new Error('Không thể tải danh sách chi phí từ database');
    return res.json();
  },

  async create(data: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    if (isSupabaseConfigured && supabase) {
      const { data: item, error } = await supabase
        .from('expenses')
        .insert([data])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return item as Expense;
    }

    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi lưu khoản chi vào database');
    }
    return res.json();
  },

  async update(id: string, data: Partial<Expense>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('expenses')
        .update(data)
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const res = await fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Không thể cập nhật khoản chi phí');
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const res = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Không thể xóa khoản chi phí');
  }
};
