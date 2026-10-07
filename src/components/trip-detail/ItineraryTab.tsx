import React, { useState } from 'react';
import { Trip, Itinerary } from '../../types/database';
import { itinerariesService } from '../../services/itinerariesService';
import { formatDate, getDatesBetween } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../Modal';
import { ConfirmModal } from '../ConfirmModal';
import { 
  PlusCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  Edit3, 
  Trash2, 
  Sparkles,
  FileText
} from 'lucide-react';

interface ItineraryTabProps {
  trip: Trip;
  itineraries: Itinerary[];
  onRefresh: () => void;
}

export const ItineraryTab: React.FC<ItineraryTabProps> = ({
  trip,
  itineraries,
  onRefresh
}) => {
  const { success, error: toastError } = useToast();
  const tripDates = getDatesBetween(trip.start_date, trip.end_date);

  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Itinerary | null>(null);
  const [deletingItem, setDeletingItem] = useState<Itinerary | null>(null);

  // Form states
  const [formDate, setFormDate] = useState<string>(tripDates[0] || trip.start_date);
  const [formTime, setFormTime] = useState<string>('09:00');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formNote, setFormNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAddModal = (defaultDate?: string) => {
    setEditingItem(null);
    setFormDate(defaultDate || (selectedDateFilter !== 'all' ? selectedDateFilter : tripDates[0] || trip.start_date));
    setFormTime('09:00');
    setFormLocation('');
    setFormNote('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Itinerary) => {
    setEditingItem(item);
    setFormDate(item.date);
    setFormTime(item.time || '09:00');
    setFormLocation(item.location);
    setFormNote(item.note || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLocation.trim()) {
      toastError('Vui lòng nhập địa điểm hoặc tên hoạt động');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        // Cập nhật hoạt động
        await itinerariesService.update(editingItem.id, {
          date: formDate,
          time: formTime,
          location: formLocation.trim(),
          note: formNote.trim() || null
        });
        success('Cập nhật lịch trình thành công');
      } else {
        // Thêm mới vào database
        await itinerariesService.create({
          trip_id: trip.id,
          date: formDate,
          time: formTime,
          location: formLocation.trim(),
          note: formNote.trim() || null
        });
        success('Thêm hoạt động vào lịch trình thành công');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể lưu lịch trình vào database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await itinerariesService.delete(deletingItem.id);
      success('Đã xóa hoạt động khỏi lịch trình');
      setDeletingItem(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể xóa hoạt động');
    }
  };

  // Lọc lịch trình theo ngày
  const displayedItineraries = selectedDateFilter === 'all'
    ? itineraries
    : itineraries.filter(item => item.date === selectedDateFilter);

  // Gom nhóm theo ngày để hiển thị timeline
  const groupedByDate: Record<string, Itinerary[]> = {};
  tripDates.forEach(d => { groupedByDate[d] = []; });
  itineraries.forEach(item => {
    if (!groupedByDate[item.date]) groupedByDate[item.date] = [];
    groupedByDate[item.date].push(item);
  });

  return (
    <div className="space-y-6">
      {/* Header & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-pine-950 tracking-tight">
            Lịch trình chuyến đi
          </h2>
          <p className="text-xs sm:text-sm text-mist-600 mt-0.5">
            Lập kế hoạch từng ngày, sắp xếp thời gian và điểm đến tại Đà Lạt
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Thêm hoạt động</span>
        </button>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedDateFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            selectedDateFilter === 'all'
              ? 'bg-pine-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả các ngày ({itineraries.length})
        </button>
        {tripDates.map((date, idx) => {
          const count = (groupedByDate[date] || []).length;
          return (
            <button
              key={date}
              onClick={() => setSelectedDateFilter(date)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedDateFilter === date
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Ngày {idx + 1} ({formatDate(date)})</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedDateFilter === date ? 'bg-pine-900 text-pine-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline View */}
      {selectedDateFilter === 'all' ? (
        <div className="space-y-8">
          {tripDates.map((date, dayIdx) => {
            const dayItems = groupedByDate[date] || [];
            return (
              <div key={date} className="bg-white rounded-2xl border border-pine-100 p-5 sm:p-6 shadow-soft">
                {/* Ngày Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-pine-800 text-white text-xs font-bold flex items-center justify-center">
                      N{dayIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-pine-950">
                        Ngày {dayIdx + 1} • {formatDate(date)}
                      </h3>
                      <span className="text-xs text-mist-600 font-medium">
                        {dayItems.length} địa điểm / hoạt động
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(date)}
                    className="text-xs font-semibold text-pine-800 hover:text-pine-900 hover:bg-pine-50 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                </div>

                {/* Danh sách hoạt động theo ngày */}
                {dayItems.length === 0 ? (
                  <div className="py-6 text-center text-xs sm:text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    Chưa có hoạt động nào cho ngày này. Bấm "Thêm" để lên lịch trình!
                  </div>
                ) : (
                  <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-pine-200">
                    {dayItems.map(item => (
                      <div key={item.id} className="relative group">
                        {/* Timeline dot */}
                        <div className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-pine-600 border-2 border-white ring-2 ring-pine-200"></div>

                        <div className="p-3.5 sm:p-4 rounded-xl bg-cream-50/80 border border-pine-100/70 hover:bg-white hover:shadow-soft transition-all flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-white text-pine-800 border border-pine-200">
                                <Clock className="w-3 h-3 text-pine-600" />
                                {item.time || 'Linh hoạt'}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">
                                {item.location}
                              </h4>
                            </div>
                            {item.note && (
                              <p className="text-xs text-slate-600 leading-relaxed pl-1">
                                {item.note}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-slate-400 hover:text-pine-800 hover:bg-pine-50 rounded-lg transition-colors"
                              title="Sửa hoạt động"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingItem(item)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa hoạt động"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Chỉ hiển thị ngày đang được chọn */
        <div className="bg-white rounded-2xl border border-pine-100 p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-pine-950">
                Lịch trình ngày: {formatDate(selectedDateFilter)}
              </h3>
              <span className="text-xs text-mist-600">
                {displayedItineraries.length} hoạt động được lên kế hoạch
              </span>
            </div>
            <button
              onClick={() => handleOpenAddModal(selectedDateFilter)}
              className="text-xs font-semibold text-white bg-pine-800 hover:bg-pine-900 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Thêm hoạt động</span>
            </button>
          </div>

          {displayedItineraries.length === 0 ? (
            <div className="py-8 text-center text-xs sm:text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
              Chưa có hoạt động nào cho ngày {formatDate(selectedDateFilter)}. Hãy bấm nút thêm ở trên!
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-pine-200">
              {displayedItineraries.map(item => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-pine-600 border-2 border-white ring-2 ring-pine-200"></div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-cream-50/80 border border-pine-100/70 hover:bg-white hover:shadow-soft transition-all flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-white text-pine-800 border border-pine-200">
                          <Clock className="w-3 h-3 text-pine-600" />
                          {item.time || 'Linh hoạt'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.location}
                        </h4>
                      </div>
                      {item.note && (
                        <p className="text-xs text-slate-600 leading-relaxed pl-1">
                          {item.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-pine-800 hover:bg-pine-50 rounded-lg transition-colors"
                        title="Sửa hoạt động"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa hoạt động"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Thêm / Sửa hoạt động */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Sửa hoạt động lịch trình' : 'Thêm hoạt động mới vào lịch trình'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày <span className="text-red-500">*</span>
                </label>
                <select
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
                  required
                >
                  {tripDates.map((d, i) => (
                    <option key={d} value={d}>
                      Ngày {i + 1} ({formatDate(d)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Giờ (VD: 08:00)
                </label>
                <input
                  type="time"
                  value={formTime}
                  onChange={e => setFormTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Địa điểm / Hoạt động <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={e => setFormLocation(e.target.value)}
                placeholder="Ví dụ: Ga Đà Lạt, Ăn sáng bánh mì xíu mại..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Ghi chú hoạt động
              </label>
              <textarea
                rows={2}
                value={formNote}
                onChange={e => setFormNote(e.target.value)}
                placeholder="Ví dụ: Mang máy ảnh chụp đầu tàu cổ, ghé quầy lưu niệm..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 disabled:opacity-50 rounded-xl shadow-sm transition-all"
              >
                {isSubmitting ? 'Đang lưu...' : editingItem ? 'Lưu thay đổi' : 'Thêm hoạt động'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Xóa hoạt động */}
      {deletingItem && (
        <ConfirmModal
          isOpen={Boolean(deletingItem)}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDelete}
          title="Xóa hoạt động lịch trình"
          message={`Bạn có chắc muốn xóa hoạt động "${deletingItem.location}" vào lúc ${deletingItem.time || ''} ngày ${formatDate(deletingItem.date)}?`}
          confirmText="Xác nhận xóa"
        />
      )}
    </div>
  );
};
