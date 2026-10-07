import { Itinerary } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const itinerariesService = {
  async getByTripId(tripId: string): Promise<Itinerary[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('trip_id', tripId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      if (error) throw new Error(error.message);
      return (data || []) as Itinerary[];
    }

    const res = await fetch(`/api/trips/${tripId}/itineraries`);
    if (!res.ok) throw new Error('Không thể tải lịch trình từ database');
    return res.json();
  },

  async create(data: Omit<Itinerary, 'id' | 'created_at'>): Promise<Itinerary> {
    if (isSupabaseConfigured && supabase) {
      const { data: item, error } = await supabase
        .from('itineraries')
        .insert([data])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return item as Itinerary;
    }

    const res = await fetch('/api/itineraries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi lưu hoạt động lịch trình vào database');
    }
    return res.json();
  },

  async update(id: string, data: Partial<Itinerary>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('itineraries')
        .update(data)
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const res = await fetch(`/api/itineraries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Không thể cập nhật lịch trình');
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const res = await fetch(`/api/itineraries/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Không thể xóa mục lịch trình');
  }
};
