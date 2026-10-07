import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Trees, PlusCircle, Compass, Heart, Calendar } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export const Navbar: React.FC = () => {
  const { currentRoute, navigateTo, openCreateTripModal } = useNavigation();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pine-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-pine-700 to-pine-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Trees className="w-6 h-6 text-pine-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-pine-950 tracking-tight leading-none group-hover:text-pine-800 transition-colors">
                  ĐÀ LẠT JOURNEY
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isSupabaseConfigured ? 'Supabase Live' : 'SQLite DB Active'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-mist-600 font-medium tracking-wide">
                Hành trình khám phá xứ sở sương mù
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigateTo('home')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentRoute === 'home'
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-pine-900 hover:bg-pine-50'
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => navigateTo('trips')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentRoute === 'trips' || currentRoute === 'trip-detail'
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-pine-900 hover:bg-pine-50'
              }`}
            >
              Chuyến đi của tôi
            </button>
            <button
              onClick={() => navigateTo('explore')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentRoute === 'explore'
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-pine-900 hover:bg-pine-50'
              }`}
            >
              Khám phá
            </button>
            <button
              onClick={() => navigateTo('favorites')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentRoute === 'favorites'
                  ? 'bg-pine-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-pine-900 hover:bg-pine-50'
              }`}
            >
              Yêu thích
            </button>
          </nav>

          {/* Action button */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCreateTripModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-pine-800 hover:bg-pine-900 active:scale-95 shadow-sm hover:shadow-soft transition-all"
            >
              <PlusCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span>+ Tạo chuyến đi</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
