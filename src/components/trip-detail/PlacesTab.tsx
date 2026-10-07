import React, { useState, useEffect } from 'react';
import { Trip, Place } from '../../types/database';
import { placesService } from '../../services/placesService';
import { itinerariesService } from '../../services/itinerariesService';
import { getDatesBetween, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../Modal';
import { MapPin, Plus, Heart, Calendar, Clock, ExternalLink } from 'lucide-react';

interface PlacesTabProps {
  trip: Trip;
  onItineraryAdded: () => void;
}

export const PlacesTab: React.FC<PlacesTabProps> = ({ trip, onItineraryAdded }) => {
  const { success, error: toastError } = useToast();
  const tripDates = getDatesBetween(trip.start_date, trip.end_date);

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal thêm địa điểm vào lịch trình
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(tripDates[0] || trip.start_date);
  const [selectedTime, setSelectedTime] = useState<string>('09:30');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPlaces() {
      try {
        setLoading(true);
        const data = await placesService.getAll();
        setPlaces(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlaces();
  }, []);

  const handleToggleFavorite = async (place: Place, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const nextStatus = await placesService.toggleFavorite(place.id, Boolean(place.is_favorite));
      setPlaces(prev => prev.map(p => p.id === place.id ? { ...p, is_favorite: nextStatus } : p));
      success(nextStatus ? `Đã lưu "${place.name}" vào yêu thích` : `Đã bỏ yêu thích "${place.name}"`);
    } catch (err: any) {
      toastError(err.message || 'Lỗi thao tác yêu thích');
    }
  };

  const handleAddPlaceToItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) return;

    try {
      setIsSubmitting(true);
      await itinerariesService.create({
        trip_id: trip.id,
        date: selectedDate,
        time: selectedTime,
        location: selectedPlace.name,
        note: note.trim() || `Tham quan ${selectedPlace.name} - ${selectedPlace.address}`
      });
      success(`Đã thêm "${selectedPlace.name}" vào lịch trình ngày ${formatDate(selectedDate)}`);
      setSelectedPlace(null);
      setNote('');
      onItineraryAdded();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể thêm địa điểm vào lịch trình');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-pine-950 tracking-tight">
          Gợi ý địa điểm Đà Lạt cho chuyến đi
        </h2>
        <p className="text-xs sm:text-sm text-mist-600 mt-0.5">
          Chọn các địa điểm nổi tiếng để thêm nhanh vào lịch trình chuyến đi của bạn
        </p>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-500 text-sm">Đang tải danh sách địa điểm...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map(place => (
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
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-pine-900 shadow-sm">
                    {place.category}
                  </span>
                  <button
                    onClick={(e) => handleToggleFavorite(place, e)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-transform active:scale-90"
                    title={place.is_favorite ? 'Bỏ yêu thích' : 'Lưu yêu thích'}
                  >
                    <Heart className={`w-4 h-4 ${place.is_favorite ? 'text-red-500 fill-red-500' : 'text-slate-500'}`} />
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-pine-800 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {place.description}
                  </p>
                  <p className="text-[11px] text-mist-600 mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pine-700 flex-shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    setSelectedPlace(place);
                    setSelectedDate(tripDates[0] || trip.start_date);
                    setSelectedTime('09:30');
                    setNote('');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-pine-900 bg-pine-50 hover:bg-pine-100 border border-pine-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-pine-700" />
                  <span>+ Thêm vào lịch trình chuyến đi</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chọn ngày giờ khi thêm vào lịch trình */}
      {selectedPlace && (
        <Modal
          isOpen={Boolean(selectedPlace)}
          onClose={() => setSelectedPlace(null)}
          title={`Thêm "${selectedPlace.name}" vào lịch trình`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddPlaceToItinerary} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Chọn ngày <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
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
                  Giờ ghé thăm
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Ghi chú hoạt động
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ví dụ: Chụp ảnh check-in, ăn sáng, uống cà phê ngắm cảnh..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPlace(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 disabled:opacity-50 rounded-xl shadow-sm transition-all"
              >
                {isSubmitting ? 'Đang thêm...' : 'Xác nhận thêm'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
