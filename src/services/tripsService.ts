import { Trip } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const tripsService = {
  async getAll(): Promise<Trip[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: true });
      if (error) throw new Error(error.message);
      return (data || []) as Trip[];
    }

    const res = await fetch('/api/trips');
    if (!res.ok) throw new Error('Không thể tải danh sách chuyến đi từ database');
    return res.json();
  },

  async getById(id: string): Promise<Trip> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data as Trip;
    }

    const res = await fetch(`/api/trips/${id}`);
    if (!res.ok) throw new Error('Không thể tải thông tin chuyến đi từ database');
    return res.json();
  },

  async create(tripData: Omit<Trip, 'id' | 'created_at'>): Promise<Trip> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('trips')
        .insert([tripData])
        .select()
        .single();
      if (error) throw new Error(error.message);

      // Tự động tạo 10 checklist thiết yếu trên Supabase
      const defaultChecklist = [
        'CCCD', 'Điện thoại', 'Sạc điện thoại', 'Sạc dự phòng', 'Áo khoác',
        'Giày phù hợp', 'Đồ dùng cá nhân', 'Thuốc cá nhân', 'Đặt phòng khách sạn', 'Kiểm tra vé xe'
      ].map(item => ({
        trip_id: data.id,
        item,
        completed: false
      }));

      await supabase.from('checklists').insert(defaultChecklist);

      return data as Trip;
    }

    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi lưu chuyến đi vào database');
    }
    return res.json();
  },

  async update(id: string, tripData: Partial<Trip>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('trips')
        .update(tripData)
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const res = await fetch(`/api/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    if (!res.ok) throw new Error('Không thể cập nhật chuyến đi trong database');
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const res = await fetch(`/api/trips/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Không thể xóa chuyến đi khỏi database');
  }
};
