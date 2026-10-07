import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Home, Compass, MapPin, Heart } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigateTo } = useNavigation();

  const isTripActive = currentRoute === 'trips' || currentRoute === 'trip-detail';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-pine-100 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentRoute === 'home'
              ? 'text-pine-800 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] leading-none">Trang chủ</span>
        </button>

        <button
          onClick={() => navigateTo('trips')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isTripActive
              ? 'text-pine-800 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[11px] leading-none">Chuyến đi</span>
        </button>

        <button
          onClick={() => navigateTo('explore')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentRoute === 'explore'
              ? 'text-pine-800 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px] leading-none">Khám phá</span>
        </button>

        <button
          onClick={() => navigateTo('favorites')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentRoute === 'favorites'
              ? 'text-pine-800 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[11px] leading-none">Yêu thích</span>
        </button>
      </div>
    </div>
  );
};
