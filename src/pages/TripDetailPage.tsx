import React, { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { tripsService } from '../services/tripsService';
import { itinerariesService } from '../services/itinerariesService';
import { expensesService } from '../services/expensesService';
import { checklistsService } from '../services/checklistsService';
import { Trip, Itinerary, Expense, ChecklistItem } from '../types/database';
import { formatCurrency, formatDate, calculateDays } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { TripFormModal } from '../components/TripFormModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { OverviewTab } from '../components/trip-detail/OverviewTab';
import { ItineraryTab } from '../components/trip-detail/ItineraryTab';
import { ExpensesTab } from '../components/trip-detail/ExpensesTab';
import { PlacesTab } from '../components/trip-detail/PlacesTab';
import { ChecklistTab } from '../components/trip-detail/ChecklistTab';

import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  CheckSquare, 
  LayoutDashboard, 
  Clock, 
  CreditCard, 
  Compass, 
  Edit3, 
  Trash2,
  AlertTriangle
} from 'lucide-react';

export const TripDetailPage: React.FC = () => {
  const { currentTripId, activeTab, navigateTo } = useNavigation();
  const { success, error: toastError } = useToast();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal edit / delete trip
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchTripFullData = async () => {
    if (!currentTripId) return;
    try {
      setLoading(true);
      const [tripData, itinData, expData, chkData] = await Promise.all([
        tripsService.getById(currentTripId),
        itinerariesService.getByTripId(currentTripId).catch(() => []),
        expensesService.getByTripId(currentTripId).catch(() => []),
        checklistsService.getByTripId(currentTripId).catch(() => [])
      ]);
      setTrip(tripData);
      setItineraries(itinData);
      setExpenses(expData);
      setChecklists(chkData);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Không thể tải dữ liệu chuyến đi từ database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripFullData();
  }, [currentTripId]);

  const handleDeleteTrip = async () => {
    if (!trip) return;
    try {
      await tripsService.delete(trip.id);
      success(`Đã xóa chuyến đi "${trip.name}"`);
      navigateTo('trips');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Lỗi khi xóa chuyến đi');
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-pine-100 shadow-soft">
        <div className="w-10 h-10 border-4 border-pine-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-base font-semibold text-pine-950">Đang tải chi tiết chuyến đi từ database...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-pine-200">
        <p className="text-base font-semibold text-slate-800 mb-4">Không tìm thấy chuyến đi</p>
        <button
          onClick={() => navigateTo('trips')}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-pine-800 rounded-xl"
        >
          Quay lại danh sách chuyến đi
        </button>
      </div>
    );
  }

  const days = calculateDays(trip.start_date, trip.end_date);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const completedChecklistCount = checklists.filter(c => c.completed).length;

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'itinerary', label: 'Lịch trình', icon: Clock, count: itineraries.length },
    { id: 'expenses', label: 'Chi phí', icon: CreditCard, count: expenses.length },
    { id: 'places', label: 'Địa điểm', icon: Compass },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare, count: `${completedChecklistCount}/${checklists.length}` }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('trips')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-mist-600 hover:text-pine-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Chuyến đi của tôi</span>
        </button>
      </div>

      {/* DASHBOARD HERO HEADER */}
      <div className="bg-white rounded-3xl border border-pine-100 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pine-100 text-pine-800 border border-pine-200">
                {days} ngày {days > 1 ? `${days - 1} đêm` : ''}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mist-100 text-mist-800">
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-pine-950 tracking-tight">
              {trip.name}
            </h1>

            {trip.note && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {trip.note}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        {/* 5 Thống kê nhanh trong Header Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 text-center sm:text-left">
          <div>
            <span className="text-[11px] font-semibold text-mist-600 uppercase tracking-wider block">Thời gian</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{days} ngày</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-mist-600 uppercase tracking-wider block">Thành viên</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{trip.travelers} người</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-mist-600 uppercase tracking-wider block">Ngân sách</span>
            <span className="text-sm font-bold text-pine-800 mt-0.5 block">{formatCurrency(trip.budget)}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-mist-600 uppercase tracking-wider block">Tổng chi</span>
            <span className={`text-sm font-bold mt-0.5 block ${totalExpense > trip.budget ? 'text-red-600' : 'text-slate-900'}`}>
              {formatCurrency(totalExpense)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-mist-600 uppercase tracking-wider block">Lịch trình</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{itineraries.length} điểm đến</span>
          </div>
        </div>
      </div>

      {/* 5 TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-pine-200/80 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo('trip-detail', trip.id, tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'border-pine-800 text-pine-900 bg-pine-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-pine-800' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-pine-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT RENDER */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <OverviewTab
            trip={trip}
            itineraries={itineraries}
            expenses={expenses}
            checklists={checklists}
            onSwitchTab={(tab) => navigateTo('trip-detail', trip.id, tab)}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryTab
            trip={trip}
            itineraries={itineraries}
            onRefresh={fetchTripFullData}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab
            trip={trip}
            expenses={expenses}
            onRefresh={fetchTripFullData}
          />
        )}

        {activeTab === 'places' && (
          <PlacesTab
            trip={trip}
            onItineraryAdded={fetchTripFullData}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistTab
            trip={trip}
            checklists={checklists}
            onRefresh={fetchTripFullData}
          />
        )}
      </div>

      {/* Edit modal */}
      {isEditModalOpen && (
        <TripFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialTrip={trip}
          onSuccess={(updated) => {
            setTrip(updated);
          }}
        />
      )}

      {/* Delete modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteTrip}
          title="Xóa chuyến đi"
          message={`Bạn có chắc muốn xóa chuyến đi "${trip.name}"? Toàn bộ lịch trình, các khoản chi phí và checklist liên quan sẽ bị xóa sạch khỏi database.`}
          confirmText="Xác nhận xóa chuyến đi"
        />
      )}
    </div>
  );
};
