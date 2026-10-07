import { ChecklistItem } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const checklistsService = {
  async getByTripId(tripId: string): Promise<ChecklistItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return (data || []) as ChecklistItem[];
    }

    const res = await fetch(`/api/trips/${tripId}/checklists`);
    if (!res.ok) throw new Error('Không thể tải checklist từ database');
    return res.json();
  },

  async create(data: Omit<ChecklistItem, 'id' | 'created_at'>): Promise<ChecklistItem> {
    if (isSupabaseConfigured && supabase) {
      const { data: item, error } = await supabase
        .from('checklists')
        .insert([data])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return item as ChecklistItem;
    }

    const res = await fetch('/api/checklists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi thêm mục checklist vào database');
    }
    return res.json();
  },

  async toggleCompleted(id: string, completed: boolean): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('checklists')
        .update({ completed })
        .eq('id', id);
      if (error) throw new Error(error.message);
      return completed;
    }

    const res = await fetch(`/api/checklists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!res.ok) throw new Error('Không thể cập nhật trạng thái checklist');
    const data = await res.json();
    return data.completed;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('checklists')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const res = await fetch(`/api/checklists/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Không thể xóa mục checklist');
  }
};
