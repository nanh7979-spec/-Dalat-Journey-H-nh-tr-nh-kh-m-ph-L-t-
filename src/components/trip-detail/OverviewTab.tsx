import React from 'react';
import { Trip, Itinerary, Expense, ChecklistItem } from '../../types/database';
import { formatCurrency, formatDate, calculateDays } from '../../lib/utils';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  TrendingUp, 
  PieChart, 
  Briefcase
} from 'lucide-react';

interface OverviewTabProps {
  trip: Trip;
  itineraries: Itinerary[];
  expenses: Expense[];
  checklists: ChecklistItem[];
  onSwitchTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  trip,
  itineraries,
  expenses,
  checklists,
  onSwitchTab
}) => {
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remainingBudget = trip.budget - totalExpense;
  const isOverBudget = remainingBudget < 0;
  const expensePercentage = trip.budget > 0 ? Math.min(100, Math.round((totalExpense / trip.budget) * 100)) : 0;

  const completedChecklistCount = checklists.filter(c => c.completed).length;
  const checklistPercentage = checklists.length > 0 
    ? Math.round((completedChecklistCount / checklists.length) * 100) 
    : 0;

  // Nhóm chi phí theo danh mục
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  return (
    <div className="space-y-6">
      {/* Cảnh báo vượt ngân sách nếu có */}
      {isOverBudget && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-800 flex items-start gap-3.5 shadow-sm">
          <div className="p-2 bg-red-100 rounded-xl text-red-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-red-900">
              Cảnh báo: Chi phí đã vượt quá ngân sách dự kiến!
            </h4>
            <p className="text-xs sm:text-sm mt-1 leading-relaxed">
              Bạn đã chi tiêu vượt quá <strong>{formatCurrency(Math.abs(remainingBudget))}</strong> so với ngân sách kế hoạch ban đầu ({formatCurrency(trip.budget)}). Hãy xem lại các khoản chi để cân đối chuyến đi!
            </p>
          </div>
        </div>
      )}

      {/* Grid 4 thẻ thống kê chính */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ngân sách */}
        <div className="bg-white p-5 rounded-2xl border border-pine-100 shadow-soft">
          <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">Ngân sách dự kiến</span>
          <p className="text-xl sm:text-2xl font-extrabold text-pine-950 mt-1">
            {formatCurrency(trip.budget)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Cho {trip.travelers} người tham gia</span>
        </div>

        {/* Tổng chi phí */}
        <div className={`p-5 rounded-2xl border shadow-soft ${
          isOverBudget ? 'bg-red-50/50 border-red-200' : 'bg-white border-pine-100'
        }`}>
          <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">Tổng chi phí</span>
          <p className={`text-xl sm:text-2xl font-extrabold mt-1 ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
            {formatCurrency(totalExpense)}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-pine-600'}`}
                style={{ width: `${Math.min(100, (totalExpense / (trip.budget || 1)) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-bold text-slate-600 flex-shrink-0">{expensePercentage}%</span>
          </div>
        </div>

        {/* Còn lại */}
        <div className={`p-5 rounded-2xl border shadow-soft ${
          isOverBudget ? 'bg-red-50 border-red-200' : 'bg-white border-pine-100'
        }`}>
          <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">
            {isOverBudget ? 'Đã bội chi' : 'Ngân sách còn lại'}
          </span>
          <p className={`text-xl sm:text-2xl font-extrabold mt-1 ${isOverBudget ? 'text-red-700' : 'text-emerald-700'}`}>
            {isOverBudget ? `+${formatCurrency(Math.abs(remainingBudget))}` : formatCurrency(remainingBudget)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isOverBudget ? 'Vượt hạn mức dự kiến' : 'Trong tầm kiểm soát'}
          </span>
        </div>

        {/* Checklist */}
        <div className="bg-white p-5 rounded-2xl border border-pine-100 shadow-soft">
          <span className="text-xs font-semibold text-mist-600 uppercase tracking-wider block">Tiến độ Checklist</span>
          <p className="text-xl sm:text-2xl font-extrabold text-pine-950 mt-1">
            {completedChecklistCount}/{checklists.length}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${checklistPercentage}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 flex-shrink-0">{checklistPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Hai cột tóm tắt: Lịch trình & Phân bổ chi phí */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Khối Lịch trình gần nhất */}
        <div className="bg-white p-6 rounded-2xl border border-pine-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pine-700" />
                <span>Hoạt động lịch trình ({itineraries.length})</span>
              </h3>
              <button
                onClick={() => onSwitchTab('itinerary')}
                className="text-xs font-semibold text-pine-800 hover:underline"
              >
                Xem chi tiết
              </button>
            </div>

            {itineraries.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 py-6 text-center">
                Chưa có hoạt động nào trong lịch trình. Hãy qua tab "Lịch trình" để thêm nhé!
              </p>
            ) : (
              <div className="space-y-3">
                {itineraries.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-pine-800 border border-slate-200 flex-shrink-0">
                      {item.time || 'Cả ngày'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.location}</p>
                      <p className="text-[11px] text-slate-500 truncate">{formatDate(item.date)} {item.note ? `• ${item.note}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => onSwitchTab('itinerary')}
              className="w-full py-2 text-xs font-semibold text-pine-800 bg-pine-50 hover:bg-pine-100 rounded-xl transition-colors"
            >
              + Lập thêm lịch trình
            </button>
          </div>
        </div>

        {/* Khối Phân bổ chi phí */}
        <div className="bg-white p-6 rounded-2xl border border-pine-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-pine-700" />
                <span>Phân bổ chi tiêu ({expenses.length} khoản)</span>
              </h3>
              <button
                onClick={() => onSwitchTab('expenses')}
                className="text-xs font-semibold text-pine-800 hover:underline"
              >
                Xem chi tiết
              </button>
            </div>

            {expenses.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 py-6 text-center">
                Chưa có khoản chi nào được ghi nhận. Hãy ghi chép để kiểm soát ngân sách!
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(categoryTotals).map(([cat, amt]) => {
                  const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700">{cat}</span>
                        <span className="text-slate-900 font-bold">{formatCurrency(amt)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pine-700 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => onSwitchTab('expenses')}
              className="w-full py-2 text-xs font-semibold text-pine-800 bg-pine-50 hover:bg-pine-100 rounded-xl transition-colors"
            >
              + Thêm khoản chi mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
