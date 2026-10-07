import React, { useEffect, useState } from 'react';
import { placesService } from '../services/placesService';
import { Place } from '../types/database';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '../context/NavigationContext';
import { Heart, MapPin, Compass, Trash2 } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { success, error: toastError } = useToast();

  const [favorites, setFavorites] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await placesService.getFavorites();
      setFavorites(data);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể tải danh sách yêu thích từ database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (place: Place) => {
    try {
      await placesService.toggleFavorite(place.id, true);
      setFavorites(prev => prev.filter(p => p.id !== place.id));
      success(`Đã bỏ lưu "${place.name}"`);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể xóa khỏi yêu thích');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-pine-950 tracking-tight">
          Địa điểm yêu thích
        </h1>
        <p className="text-xs sm:text-sm text-mist-600 mt-1">
          Các thắng cảnh và tọa độ check-in Đà Lạt bạn đã lưu lại vào cơ sở dữ liệu
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-100">
          <div className="w-8 h-8 border-3 border-pine-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-500">Đang tải địa điểm yêu thích từ database...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-pine-200 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Chưa có địa điểm yêu thích nào
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Khám phá 10 địa điểm tuyệt đẹp của Đà Lạt và nhấn "Lưu yêu thích" để gom góp những điểm đến mơ ước của bạn!
          </p>
          <button
            onClick={() => navigateTo('explore')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 rounded-xl transition-all shadow-sm"
          >
            Khám phá địa điểm ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(place => (
            <div
              key={place.id}
              className="bg-white rounded-2xl border border-pine-100 overflow-hidden shadow-soft hover:shadow-float transition-all flex flex-col justify-between group"
            >
              <div>
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
                    onClick={() => handleRemoveFavorite(place)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 backdrop-blur-md text-red-500 shadow-md hover:bg-red-50 transition-colors"
                    title="Bỏ yêu thích"
                  >
                    <Heart className="w-4 h-4 fill-red-500" />
                  </button>
                </div>

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

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(place)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa khỏi yêu thích</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
