import React, { useState } from 'react';
import { Trip, Expense, ExpenseCategory } from '../../types/database';
import { expensesService } from '../../services/expensesService';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../Modal';
import { ConfirmModal } from '../ConfirmModal';
import { 
  PlusCircle, 
  DollarSign, 
  Calendar, 
  Tag, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Car, 
  Hotel, 
  Utensils, 
  Ticket, 
  ShoppingBag, 
  MoreHorizontal
} from 'lucide-react';

interface ExpensesTabProps {
  trip: Trip;
  expenses: Expense[];
  onRefresh: () => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Di chuyển',
  'Lưu trú',
  'Ăn uống',
  'Vé tham quan',
  'Mua sắm',
  'Khác'
];

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  trip,
  expenses,
  onRefresh
}) => {
  const { success, error: toastError } = useToast();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Expense | null>(null);
  const [deletingItem, setDeletingItem] = useState<Expense | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Ăn uống');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(trip.start_date);
  const [formNote, setFormNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tính toán ngân sách
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remainingBudget = trip.budget - totalExpense;
  const isOverBudget = remainingBudget < 0;

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCategory('Ăn uống');
    setFormAmount('');
    setFormDate(trip.start_date);
    setFormNote('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Expense) => {
    setEditingItem(item);
    setFormCategory(item.category as ExpenseCategory);
    setFormAmount(String(item.amount));
    setFormDate(item.expense_date);
    setFormNote(item.note || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(formAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toastError('Vui lòng nhập số tiền chi tiêu hợp lệ');
      return;
    }
    if (!formDate) {
      toastError('Vui lòng chọn ngày chi tiêu');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await expensesService.update(editingItem.id, {
          category: formCategory,
          amount: amountNum,
          expense_date: formDate,
          note: formNote.trim() || null
        });
        success('Cập nhật khoản chi thành công');
      } else {
        await expensesService.create({
          trip_id: trip.id,
          category: formCategory,
          amount: amountNum,
          expense_date: formDate,
          note: formNote.trim() || null
        });
        success('Thêm khoản chi vào database thành công');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể lưu khoản chi phí vào database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await expensesService.delete(deletingItem.id);
      success('Đã xóa khoản chi');
      setDeletingItem(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể xóa khoản chi');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Di chuyển': return <Car className="w-4 h-4 text-blue-600" />;
      case 'Lưu trú': return <Hotel className="w-4 h-4 text-purple-600" />;
      case 'Ăn uống': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Vé tham quan': return <Ticket className="w-4 h-4 text-emerald-600" />;
      case 'Mua sắm': return <ShoppingBag className="w-4 h-4 text-pink-600" />;
      default: return <MoreHorizontal className="w-4 h-4 text-slate-600" />;
    }
  };

  const filteredExpenses = selectedCategoryFilter === 'all'
    ? expenses
    : expenses.filter(e => e.category === selectedCategoryFilter);

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-pine-950 tracking-tight">
            Quản lý chi phí & ngân sách
          </h2>
          <p className="text-xs sm:text-sm text-mist-600 mt-0.5">
            Theo dõi chi tiêu theo danh mục, kiểm soát dòng tiền chuyến đi Đà Lạt
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Thêm khoản chi</span>
        </button>
      </div>

      {/* Cảnh báo vượt ngân sách trực quan */}
      {isOverBudget && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 flex items-start gap-3.5 shadow-sm">
          <div className="p-2 bg-red-100 rounded-xl text-red-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider">
              CẢNH BÁO: CHI PHÍ ĐÃ VƯỢT NGÂN SÁCH!
            </h4>
            <p className="text-xs sm:text-sm mt-1 leading-relaxed">
              Tổng chi tiêu hiện tại là <strong>{formatCurrency(totalExpense)}</strong>, đã vượt <strong>{formatCurrency(Math.abs(remainingBudget))}</strong> so với ngân sách dự kiến ban đầu ({formatCurrency(trip.budget)}).
            </p>
          </div>
        </div>
      )}

      {/* 3 Thẻ tính toán tự động chuẩn đề bài */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TỔNG CHI PHÍ */}
        <div className={`p-5 rounded-2xl border shadow-soft ${
          isOverBudget ? 'bg-red-50/70 border-red-200' : 'bg-white border-pine-100'
        }`}>
          <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">
            TỔNG CHI PHÍ
          </span>
          <p className={`text-2xl sm:text-3xl font-extrabold mt-1.5 ${
            isOverBudget ? 'text-red-600' : 'text-slate-900'
          }`}>
            {formatCurrency(totalExpense)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {expenses.length} khoản chi đã ghi vào database
          </span>
        </div>

        {/* NGÂN SÁCH */}
        <div className="bg-white p-5 rounded-2xl border border-pine-100 shadow-soft">
          <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">
            NGÂN SÁCH DỰ KIẾN
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-pine-950 mt-1.5">
            {formatCurrency(trip.budget)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Hạn mức ban đầu cho {trip.travelers} người
          </span>
        </div>

        {/* CÒN LẠI */}
        <div className={`p-5 rounded-2xl border shadow-soft ${
          isOverBudget ? 'bg-red-50 border-red-300' : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">
            {isOverBudget ? 'VƯỢT NGÂN SÁCH (BỘI CHI)' : 'NGÂN SÁCH CÒN LẠI'}
          </span>
          <p className={`text-2xl sm:text-3xl font-extrabold mt-1.5 ${
            isOverBudget ? 'text-red-700' : 'text-emerald-700'
          }`}>
            {isOverBudget ? `-${formatCurrency(Math.abs(remainingBudget))}` : formatCurrency(remainingBudget)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {isOverBudget ? 'Cần cân đối giảm bớt khoản chi khác' : 'Ngân sách an toàn'}
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategoryFilter === 'all'
              ? 'bg-pine-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả danh mục ({expenses.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = expenses.filter(e => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategoryFilter === cat
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategoryFilter === cat ? 'bg-pine-900 text-pine-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expense Items List */}
      <div className="bg-white rounded-2xl border border-pine-100 shadow-soft overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            Không tìm thấy khoản chi nào trong danh mục này. Hãy bấm "+ Thêm khoản chi" ở góc trên!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredExpenses.map(item => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-cream-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className="text-xs text-mist-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.expense_date)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate mt-1">
                      {item.note || item.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {formatCurrency(Number(item.amount))}
                  </span>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 text-slate-400 hover:text-pine-800 hover:bg-pine-50 rounded-lg transition-colors"
                      title="Sửa khoản chi"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa khoản chi"
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

      {/* Modal Thêm / Sửa khoản chi */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Sửa khoản chi' : 'Thêm khoản chi tiêu mới'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Danh mục chi tiêu <span className="text-red-500">*</span>
              </label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
                required
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Số tiền (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="10000"
                min="0"
                value={formAmount}
                onChange={e => setFormAmount(e.target.value)}
                placeholder="Ví dụ: 500000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Ngày chi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pine-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nội dung / Ghi chú khoản chi
              </label>
              <input
                type="text"
                value={formNote}
                onChange={e => setFormNote(e.target.value)}
                placeholder="Ví dụ: Khách sạn 2 đêm, lẩu gà lá é, thuê xe máy..."
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
                {isSubmitting ? 'Đang lưu...' : editingItem ? 'Lưu thay đổi' : 'Lưu khoản chi'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Xóa khoản chi */}
      {deletingItem && (
        <ConfirmModal
          isOpen={Boolean(deletingItem)}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDelete}
          title="Xóa khoản chi phí"
          message={`Bạn có chắc muốn xóa khoản chi "${deletingItem.note || deletingItem.category}" số tiền ${formatCurrency(Number(deletingItem.amount))}?`}
          confirmText="Xác nhận xóa"
        />
      )}
    </div>
  );
};
