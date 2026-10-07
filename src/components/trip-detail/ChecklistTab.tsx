import React, { useState } from 'react';
import { Trip, ChecklistItem } from '../../types/database';
import { checklistsService } from '../../services/checklistsService';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../ConfirmModal';
import { CheckCircle2, Circle, Plus, Trash2, CheckSquare, Sparkles } from 'lucide-react';

interface ChecklistTabProps {
  trip: Trip;
  checklists: ChecklistItem[];
  onRefresh: () => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  trip,
  checklists,
  onRefresh
}) => {
  const { success, error: toastError } = useToast();

  const [newItemText, setNewItemText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ChecklistItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const completedCount = checklists.filter(c => c.completed).length;
  const totalCount = checklists.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = async (item: ChecklistItem) => {
    try {
      setTogglingId(item.id);
      const nextCompleted = !item.completed;
      await checklistsService.toggleCompleted(item.id, nextCompleted);
      success(nextCompleted ? `Đã hoàn thành "${item.item}"` : `Đã bỏ hoàn thành "${item.item}"`);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Lỗi khi cập nhật trạng thái checklist');
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    try {
      setIsAdding(true);
      await checklistsService.create({
        trip_id: trip.id,
        item: newItemText.trim(),
        completed: false
      });
      success(`Đã thêm mục "${newItemText.trim()}"`);
      setNewItemText('');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Lỗi khi thêm mục checklist');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await checklistsService.delete(deletingItem.id);
      success(`Đã xóa mục "${deletingItem.item}"`);
      setDeletingItem(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể xóa mục checklist');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header & Progress Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-pine-100 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-pine-950 tracking-tight">
              Checklist chuẩn bị chuyến đi
            </h2>
            <p className="text-xs sm:text-sm text-mist-600 mt-0.5">
              Hành trang và các thủ tục thiết yếu trước khi lên đường vi vu Đà Lạt
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">
              Tiến độ chuẩn bị
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-pine-950">
              Đã hoàn thành: <span className="text-emerald-700">{completedCount}/{totalCount}</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Tiến độ hoàn tất</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-pine-700 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form thêm mục mới */}
      <form onSubmit={handleAddItem} className="flex items-center gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={e => setNewItemText(e.target.value)}
          placeholder="Thêm mục chuẩn bị mới (VD: Ô che mưa, Máy ảnh, Khăn quàng...)"
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600 shadow-sm"
        />
        <button
          type="submit"
          disabled={isAdding || !newItemText.trim()}
          className="px-5 py-3 rounded-xl font-semibold text-sm text-white bg-pine-800 hover:bg-pine-900 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 flex-shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm</span>
        </button>
      </form>

      {/* Checklist items list */}
      <div className="bg-white rounded-2xl border border-pine-100 shadow-soft divide-y divide-slate-100 overflow-hidden">
        {checklists.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Chưa có mục nào trong checklist. Hãy nhập vào ô ở trên để thêm nhé!
          </div>
        ) : (
          checklists.map(item => (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                item.completed ? 'bg-cream-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  disabled={togglingId === item.id}
                  className="flex-shrink-0 text-pine-800 focus:outline-none"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-pine-600 transition-colors" />
                  )}
                </button>
                <span
                  className={`text-sm font-medium transition-all truncate ${
                    item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {item.item}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingItem(item);
                }}
                className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="Xóa mục"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal */}
      {deletingItem && (
        <ConfirmModal
          isOpen={Boolean(deletingItem)}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDelete}
          title="Xóa mục checklist"
          message={`Bạn có chắc muốn xóa "${deletingItem.item}" khỏi danh sách checklist?`}
          confirmText="Xác nhận xóa"
        />
      )}
    </div>
  );
};
