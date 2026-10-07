import React, { useEffect, useState } from 'react';
import { placesService } from '../services/placesService';
import { Place } from '../types/database';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { 
  Heart, 
  MapPin, 
  Search, 
  Compass, 
  Share2, 
  Sparkles, 
  Filter,
  Info
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingPlace, setInspectingPlace] = useState<Place | null>(null);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const data = await placesService.getAll();
      setPlaces(data);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể tải danh sách địa điểm Đà Lạt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleToggleFavorite = async (place: Place, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const current = Boolean(place.is_favorite);
      const next = await placesService.toggleFavorite(place.id, current);
      setPlaces(prev => prev.map(p => p.id === place.id ? { ...p, is_favorite: next } : p));
      if (inspectingPlace && inspectingPlace.id === place.id) {
        setInspectingPlace({ ...inspectingPlace, is_favorite: next });
      }
      success(next ? `Đã lưu "${place.name}" vào danh sách yêu thích` : `Đã bỏ yêu thích "${place.name}"`);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Lỗi khi cập nhật yêu thích');
    }
  };

  const categories = ['all', 'Check-in', 'Thiên nhiên', 'Văn hóa', 'Ẩm thực'];

  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-pine-950 tracking-tight">
            Khám phá Đà Lạt
          </h1>
          <p className="text-xs sm:text-sm text-mist-600 mt-1">
            Top 10 danh lam thắng cảnh, tọa độ check-in và biểu tượng văn hóa của thành phố sương mù
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả 10 điểm' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc địa chỉ..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 shadow-sm"
          />
        </div>
      </div>

      {/* Places Grid */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-100">
          <div className="w-8 h-8 border-3 border-pine-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải danh sách địa điểm từ database...</p>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-pine-200 max-w-md mx-auto">
          <p className="text-sm font-semibold text-slate-700">Không tìm thấy địa điểm phù hợp</p>
          <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bộ lọc tìm kiếm để xem tất cả địa điểm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              onClick={() => setInspectingPlace(place)}
              className="bg-white rounded-2xl border border-pine-100 overflow-hidden shadow-soft hover:shadow-float hover:border-pine-300 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-pine-900 shadow-sm">
                    {place.category}
                  </span>
                  <button
                    onClick={(e) => handleToggleFavorite(place, e)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-md transition-all active:scale-90"
                    title={place.is_favorite ? 'Bỏ yêu thích' : 'Lưu yêu thích'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        place.is_favorite ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-pine-800 transition-colors leading-snug">
                    {place.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {place.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-xs text-mist-700">
                    <MapPin className="w-3.5 h-3.5 text-pine-700 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{place.address}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(place);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    place.is_favorite
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'bg-pine-50 text-pine-900 border border-pine-200 hover:bg-pine-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${place.is_favorite ? 'fill-red-600 text-red-600' : 'text-pine-700'}`} />
                  <span>{place.is_favorite ? 'Đã lưu yêu thích' : 'Lưu yêu thích'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspecting Place Detail Modal */}
      {inspectingPlace && (
        <Modal
          isOpen={Boolean(inspectingPlace)}
          onClose={() => setInspectingPlace(null)}
          title={inspectingPlace.name}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={inspectingPlace.image_url}
                alt={inspectingPlace.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-pine-900">
                {inspectingPlace.category}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">Giới thiệu địa điểm</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {inspectingPlace.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-slate-700 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-pine-800 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Địa chỉ:</strong>
                <span>{inspectingPlace.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectingPlace(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => handleToggleFavorite(inspectingPlace)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  inspectingPlace.is_favorite
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-pine-800 text-white hover:bg-pine-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${inspectingPlace.is_favorite ? 'fill-red-600' : ''}`} />
                <span>{inspectingPlace.is_favorite ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
