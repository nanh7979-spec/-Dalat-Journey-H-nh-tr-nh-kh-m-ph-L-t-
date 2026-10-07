import { Place } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const placesService = {
  async getAll(): Promise<Place[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: places, error: placesErr } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: true });
      if (placesErr) throw new Error(placesErr.message);

      const { data: favs } = await supabase
        .from('favorites')
        .select('place_id');

      const favIds = new Set((favs || []).map(f => f.place_id));

      return (places || []).map(p => ({
        ...p,
        is_favorite: favIds.has(p.id)
      })) as Place[];
    }

    const res = await fetch('/api/places');
    if (!res.ok) throw new Error('Không thể tải danh sách địa điểm Đà Lạt');
    return res.json();
  },

  async getFavorites(): Promise<Place[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: favs, error: favErr } = await supabase
        .from('favorites')
        .select('place_id, places(*)');
      if (favErr) throw new Error(favErr.message);

      return (favs || [])
        .map(f => f.places)
        .filter(Boolean)
        .map((p: any) => ({
          ...p,
          is_favorite: true
        })) as Place[];
    }

    const res = await fetch('/api/favorites');
    if (!res.ok) throw new Error('Không thể tải danh sách địa điểm yêu thích');
    return res.json();
  },

  async toggleFavorite(placeId: string, currentStatus: boolean): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      if (currentStatus) {
        // Xóa yêu thích
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('place_id', placeId);
        if (error) throw new Error(error.message);
        return false;
      } else {
        // Thêm yêu thích
        const { error } = await supabase
          .from('favorites')
          .insert([{ place_id: placeId }]);
        if (error) throw new Error(error.message);
        return true;
      }
    }

    if (currentStatus) {
      const res = await fetch(`/api/favorites/${placeId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể hủy lưu địa điểm');
      return false;
    } else {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place_id: placeId })
      });
      if (!res.ok) throw new Error('Không thể lưu địa điểm yêu thích');
      return true;
    }
  }
};
