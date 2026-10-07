import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { tripsService } from '../services/tripsService';
import { placesService } from '../services/placesService';
import { Trip, Place } from '../types/database';
import { formatCurrency, formatDate, calculateDays } from '../lib/utils';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  ChevronRight, 
  Heart, 
  Compass, 
  ShieldCheck, 
  CloudSun,
  Camera,
  Coffee
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, openCreateTripModal } = useNavigation();
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tripsData, placesData] = await Promise.all([
          tripsService.getAll().catch(() => []),
          placesService.getAll().catch(() => [])
        ]);
        setRecentTrips(tripsData.slice(0, 3));
        setFeaturedPlaces(placesData.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden shadow-float bg-pine-950 text-white min-h-[460px] sm:min-h-[520px] flex items-center">
        {/* Background Image with Ambient Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80"
            alt="Đà Lạt sương mù"
            className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pine-950/90 via-pine-950/50 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl px-6 sm:px-12 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-pine-200 mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Công cụ lập kế hoạch du lịch Đà Lạt thực tế</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
            HÀNH TRÌNH KHÁM PHÁ <br className="hidden sm:inline" />
            <span className="text-pine-300 font-serif italic">ĐÀ LẠT</span>
          </h1>

          <p className="text-base sm:text-xl text-cream-100 font-light leading-relaxed mb-8 max-w-xl">
            "Đi để cảm nhận. <br />
            Đến để lưu giữ những khoảnh khắc."
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={openCreateTripModal}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-bold text-pine-950 bg-amber-300 hover:bg-amber-400 active:scale-95 shadow-lg shadow-amber-300/20 transition-all"
            >
              <span>Bắt đầu chuyến đi</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigateTo('explore')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all"
            >
              <Compass className="w-5 h-5 text-pine-300" />
              <span>Khám phá 10 địa điểm</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY / HIGHLIGHT STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-pine-100/80 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-pine-50 text-pine-700 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-xs text-mist-600 font-medium">Địa điểm tuyển chọn</p>
          <p className="text-xl sm:text-2xl font-bold text-pine-950 mt-1">10 Điểm vàng</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-pine-100/80 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs text-mist-600 font-medium">Lịch trình thông minh</p>
          <p className="text-xl sm:text-2xl font-bold text-pine-950 mt-1">Theo từng ngày</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-pine-100/80 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs text-mist-600 font-medium">Kiểm soát ngân sách</p>
          <p className="text-xl sm:text-2xl font-bold text-pine-950 mt-1">Cảnh báo chi vượt</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-pine-100/80 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <CloudSun className="w-5 h-5" />
          </div>
          <p className="text-xs text-mist-600 font-medium">Checklist hành lý</p>
          <p className="text-xl sm:text-2xl font-bold text-pine-950 mt-1">10 món thiết yếu</p>
        </div>
      </section>

      {/* 3. RECENT TRIPS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-pine-950 tracking-tight">
              Chuyến đi gần đây
            </h2>
            <p className="text-xs sm:text-sm text-mist-600 mt-0.5">
              Các kế hoạch khám phá Đà Lạt được lưu trữ trong cơ sở dữ liệu
            </p>
          </div>
          <button
            onClick={() => navigateTo('trips')}
            className="text-xs sm:text-sm font-semibold text-pine-800 hover:text-pine-900 inline-flex items-center gap-1 group"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-sm text-slate-500">
            Đang tải dữ liệu chuyến đi từ database...
          </div>
        ) : recentTrips.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-pine-200">
            <p className="text-sm font-medium text-slate-600 mb-3">
              Chưa có chuyến đi nào được tạo. Hãy lên kế hoạch cho chuyến đi Đà Lạt đầu tiên của bạn!
            </p>
            <button
              onClick={openCreateTripModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 rounded-xl transition-all"
            >
              + Tạo chuyến đi ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {recentTrips.map(trip => {
              const days = calculateDays(trip.start_date, trip.end_date);
              return (
                <div
                  key={trip.id}
                  onClick={() => navigateTo('trip-detail', trip.id)}
                  className="bg-white p-5 rounded-2xl border border-pine-100 shadow-soft hover:shadow-float hover:border-pine-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-pine-50 text-pine-800">
                        {days} ngày {days > 1 ? `${days - 1} đêm` : ''}
                      </span>
                      <span className="text-xs font-medium text-mist-600">
                        {formatCurrency(trip.budget)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-pine-800 transition-colors line-clamp-1">
                      {trip.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4 leading-relaxed">
                      {trip.note || 'Chuyến du lịch khám phá xứ sở sương mù Đà Lạt.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pine-600" />
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-pine-600" />
                      {trip.travelers} người
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. FEATURED PLACES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-pine-950 tracking-tight">
              Địa điểm Đà Lạt nổi bật
            </h2>
            <p className="text-xs sm:text-sm text-mist-600 mt-0.5">
              Những danh lam thắng cảnh và tọa độ check-in đặc sắc nhất
            </p>
          </div>
          <button
            onClick={() => navigateTo('explore')}
            className="text-xs sm:text-sm font-semibold text-pine-800 hover:text-pine-900 inline-flex items-center gap-1 group"
          >
            <span>Khám phá 10 điểm</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredPlaces.map(place => (
            <div
              key={place.id}
              onClick={() => navigateTo('explore')}
              className="bg-white rounded-2xl border border-pine-100 overflow-hidden shadow-soft hover:shadow-float transition-all cursor-pointer group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-pine-900 shadow-sm">
                  {place.category}
                </span>
                {place.is_favorite && (
                  <span className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md text-red-500 shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-red-500" />
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-pine-800 transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {place.description}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center text-[11px] text-mist-600 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 text-pine-700 flex-shrink-0 mr-1" />
                  <span className="truncate">{place.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DALAT TRAVEL GUIDE TIPS */}
      <section className="bg-gradient-to-br from-cream-100 to-cream-200/60 rounded-3xl p-6 sm:p-10 border border-cream-300/60">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-earth-700">Cẩm nang bỏ túi</span>
          <h2 className="text-xl sm:text-2xl font-bold text-pine-950 mt-1">
            Kinh nghiệm vi vu Đà Lạt trọn vẹn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-cream-200 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-pine-100 text-pine-800 flex items-center justify-center mb-3">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Thời tiết 4 mùa trong ngày</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sáng se lạnh sương mai, trưa nắng ấm nhẹ, chiều hoàng hôn mát lành và đêm lạnh buốt. Đừng quên áo khoác ấm và khăn quàng!
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-cream-200 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Thời điểm săn mây đẹp nhất</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Từ 4:45 đến 6:00 sáng tại Đồi chè Cầu Đất hoặc Langbiang là khoảnh khắc biển mây cuồn cuộn dưới ánh bình minh lung linh nhất.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-cream-200 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-earth-100 text-earth-800 flex items-center justify-center mb-3">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Ẩm thực đêm Chợ Đà Lạt</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bánh tráng nướng trứng giòn rụm, ly sữa đậu nành nóng ngào ngạt mùi lá dứa và xiên que nướng thơm nức mũi giữa phố lạnh.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="bg-pine-800 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sẵn sàng cho chuyến đi Đà Lạt của bạn?
          </h2>
          <p className="text-xs sm:text-sm text-pine-200 leading-relaxed">
            Lập lịch trình chi tiết, quản lý ngân sách và lưu lại từng kỉ niệm tuyệt đẹp cùng Dalat Journey ngay hôm nay.
          </p>
          <div className="pt-2">
            <button
              onClick={openCreateTripModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-pine-950 bg-amber-300 hover:bg-amber-400 active:scale-95 shadow-md transition-all"
            >
              <span>+ Tạo chuyến đi mới</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
