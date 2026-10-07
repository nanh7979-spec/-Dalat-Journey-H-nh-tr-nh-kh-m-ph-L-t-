import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Trip } from '../types/database';
import { tripsService } from '../services/tripsService';
import { useToast } from '../context/ToastContext';
import { Calendar, Users, DollarSign, FileText, Sparkles } from 'lucide-react';

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trip: Trip) => void;
  initialTrip?: Trip | null;
}

export const TripFormModal: React.FC<TripFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTrip
}) => {
  const { success, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState<number>(2);
  const [budget, setBudget] = useState<string>('5000000');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTrip) {
      setName(initialTrip.name);
      setStartDate(initialTrip.start_date);
      setEndDate(initialTrip.end_date);
      setTravelers(initialTrip.travelers || 1);
      setBudget(String(initialTrip.budget || 0));
      setNote(initialTrip.note || '');
    } else {
      // Giá trị mặc định gợi ý chuyến đi Đà Lạt
      setName('Khám phá Đà Lạt 3 ngày 2 đêm');
      setStartDate('2026-10-05');
      setEndDate('2026-10-07');
      setTravelers(2);
      setBudget('5000000');
      setNote('Chuyến đi ngắm hoa dã quỳ và tận hưởng không khí se lạnh mùa thu cùng bạn bè.');
    }
    setValidationError(null);
  }, [initialTrip, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('Vui lòng nhập tên chuyến đi');
      return;
    }
    if (!startDate || !endDate) {
      setValidationError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setValidationError('Ngày kết thúc phải diễn ra sau ngày bắt đầu');
      return;
    }
    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      setValidationError('Ngân sách dự kiến không hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      if (initialTrip) {
        // Chỉnh sửa chuyến đi
        await tripsService.update(initialTrip.id, {
          name: name.trim(),
          start_date: startDate,
          end_date: endDate,
          travelers: Number(travelers) || 1,
          budget: numBudget,
          note: note.trim()
        });
        const updated = await tripsService.getById(initialTrip.id);
        success('Cập nhật chuyến đi thành công');
        onSuccess(updated);
      } else {
        // Tạo mới chuyến đi và lưu vào database
        const created = await tripsService.create({
          name: name.trim(),
          start_date: startDate,
          end_date: endDate,
          travelers: Number(travelers) || 1,
          budget: numBudget,
          note: note.trim()
        });
        success('Tạo chuyến đi mới thành công');
        onSuccess(created);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể lưu chuyến đi vào database. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTrip ? 'Chỉnh sửa chuyến đi' : 'Tạo chuyến đi Đà Lạt mới'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {validationError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tên chuyến đi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ví dụ: Khám phá Đà Lạt 3 ngày 2 đêm"
              className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Số người tham gia
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                value={travelers}
                onChange={e => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ngân sách dự kiến (VNĐ)
            </label>
            <div className="relative">
              <input
                type="number"
                step="100000"
                min="0"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="5000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Ghi chú hoặc kế hoạch đặc biệt
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ví dụ: Mục tiêu săn mây Cầu Đất, ghé chợ đêm ăn bánh tráng nướng..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 disabled:opacity-50 rounded-xl shadow-sm hover:shadow transition-all"
          >
            {isSubmitting ? 'Đang lưu...' : initialTrip ? 'Lưu thay đổi' : 'Lưu chuyến đi'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
