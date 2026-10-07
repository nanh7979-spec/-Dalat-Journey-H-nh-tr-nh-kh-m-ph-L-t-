import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { tripsService } from '../services/tripsService';
import { Trip } from '../types/database';
import { formatCurrency, formatDate, calculateDays } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { TripFormModal } from '../components/TripFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  PlusCircle, 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';

export const TripsPage: React.FC = () => {
  const { navigateTo, openCreateTripModal } = useNavigation();
  const { success, error: toastError } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit / Delete states
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripsService.getAll();
      setTrips(data);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Lỗi khi tải danh sách chuyến đi từ database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async () => {
    if (!deletingTrip) return;
    try {
      await tripsService.delete(deletingTrip.id);
      success(`Đã xóa chuyến đi "${deletingTrip.name}"`);
      setTrips(prev => prev.filter(t => t.id !== deletingTrip.id));
      setDeletingTrip(null);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể xóa chuyến đi');
    }
  };

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (trip.note && trip.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-pine-950 tracking-tight">
            Chuyến đi của tôi
          </h1>
          <p className="text-xs sm:text-sm text-mist-600 mt-1">
            Quản lý các hành trình, lịch trình chi tiết và chi phí du lịch Đà Lạt của bạn
          </p>
        </div>

        <button
          onClick={openCreateTripModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow-sm hover:shadow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tạo chuyến đi</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm chuyến đi..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Trip List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-8 h-8 border-3 border-pine-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-500">Đang đồng bộ dữ liệu từ database...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-pine-200 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-pine-50 text-pine-700 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Chưa có chuyến đi nào</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Hãy bắt đầu tạo chuyến đi Đà Lạt đầu tiên của bạn để lập lịch trình, quản lý ngân sách và checklist!
          </p>
          <button
            onClick={openCreateTripModal}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 rounded-xl transition-all shadow-sm"
          >
            + Tạo chuyến đi ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredTrips.map(trip => {
            const days = calculateDays(trip.start_date, trip.end_date);
            return (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-pine-100 shadow-soft hover:shadow-float hover:border-pine-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 sm:p-6">
                  {/* Badge & Options */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pine-50 text-pine-800 border border-pine-100">
                      {days} ngày {days > 1 ? `${days - 1} đêm` : ''}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTrip(trip);
                        }}
                        className="p-1.5 text-slate-400 hover:text-pine-800 hover:bg-pine-50 rounded-lg transition-colors"
                        title="Chỉnh sửa chuyến đi"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingTrip(trip);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa chuyến đi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Trip Title */}
                  <h3
                    onClick={() => navigateTo('trip-detail', trip.id)}
                    className="text-lg font-bold text-slate-900 group-hover:text-pine-800 transition-colors cursor-pointer leading-snug"
                  >
                    {trip.name}
                  </h3>

                  {/* Trip Note */}
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {trip.note || 'Chưa có ghi chú đặc biệt cho chuyến đi này.'}
                  </p>

                  {/* Trip Specs */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-mist-600 block text-[11px]">Thời gian</span>
                      <span className="font-semibold text-slate-800 inline-flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-pine-700" />
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </span>
                    </div>

                    <div>
                      <span className="text-mist-600 block text-[11px]">Thành viên</span>
                      <span className="font-semibold text-slate-800 inline-flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-pine-700" />
                        {trip.travelers} người
                      </span>
                    </div>

                    <div>
                      <span className="text-mist-600 block text-[11px]">Ngân sách dự kiến</span>
                      <span className="font-bold text-pine-800 block mt-0.5">
                        {formatCurrency(trip.budget)}
                      </span>
                    </div>

                    <div>
                      <span className="text-mist-600 block text-[11px]">Thao tác</span>
                      <button
                        onClick={() => navigateTo('trip-detail', trip.id)}
                        className="text-pine-800 hover:underline font-semibold inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>Mở chi tiết</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div
                  onClick={() => navigateTo('trip-detail', trip.id)}
                  className="bg-cream-50/70 border-t border-pine-50 px-5 py-3 text-xs font-semibold text-pine-900 flex items-center justify-between cursor-pointer hover:bg-pine-50 transition-colors"
                >
                  <span>Xem lịch trình & chi phí</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Trip Modal */}
      {editingTrip && (
        <TripFormModal
          isOpen={Boolean(editingTrip)}
          onClose={() => setEditingTrip(null)}
          initialTrip={editingTrip}
          onSuccess={(updated) => {
            setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTrip && (
        <ConfirmModal
          isOpen={Boolean(deletingTrip)}
          onClose={() => setDeletingTrip(null)}
          onConfirm={handleDeleteTrip}
          title="Xóa chuyến đi"
          message={`Bạn có chắc chắn muốn xóa chuyến đi "${deletingTrip.name}"? Toàn bộ lịch trình, các khoản chi phí và danh sách checklist liên quan sẽ bị xóa vĩnh viễn khỏi database.`}
          confirmText="Xác nhận xóa chuyến đi"
        />
      )}
    </div>
  );
};
