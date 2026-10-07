import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Trees, Heart, MapPin, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export const Footer: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <footer className="bg-pine-950 text-white mt-auto border-t border-pine-900 pb-20 sm:pb-8 pt-12 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-pine-900/60">
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pine-800 flex items-center justify-center text-pine-200">
                <Trees className="w-6 h-6" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">ĐÀ LẠT JOURNEY</span>
            </div>
            <p className="text-xs text-pine-300 leading-relaxed max-w-sm">
              "Đi để cảm nhận. Đến để lưu giữ những khoảnh khắc." <br />
              Công cụ cá nhân giúp bạn lên kế hoạch, quản lý lịch trình và kiểm soát ngân sách cho chuyến đi Đà Lạt hoàn hảo.
            </p>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pine-400">
              Điều hướng ứng dụng
            </h4>
            <ul className="space-y-2 text-xs text-pine-200">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">
                  Trang chủ
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('trips')} className="hover:text-white transition-colors">
                  Chuyến đi của tôi
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('explore')} className="hover:text-white transition-colors">
                  Khám phá 10 địa điểm
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('favorites')} className="hover:text-white transition-colors">
                  Địa điểm yêu thích
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Trạng thái Database thật */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pine-400">
              Cơ sở dữ liệu hệ thống
            </h4>
            <div className="p-3.5 rounded-2xl bg-pine-900/60 border border-pine-800 text-xs text-pine-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">
                  {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'SQLite Relational Database'}
                </span>
              </div>
              <p className="text-[11px] text-pine-400 leading-relaxed">
                Dữ liệu chuyến đi, lịch trình, chi phí, địa điểm và checklist được lưu trữ bền vững, thực hiện đọc/ghi SQL thật qua API.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-pine-400">
          <p>© 2026 Hành Trình Khám Phá Đà Lạt (Dalat Journey). Bài thi phát triển Web App hoàn chỉnh.</p>
          <p className="flex items-center gap-1">
            <span>Thiết kế dành riêng cho Đà Lạt</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
