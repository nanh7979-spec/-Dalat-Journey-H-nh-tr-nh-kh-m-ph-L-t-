import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { TripFormModal } from './components/TripFormModal';

// Pages
import { HomePage } from './pages/HomePage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { ExplorePage } from './pages/ExplorePage';
import { FavoritesPage } from './pages/FavoritesPage';

const AppContent: React.FC = () => {
  const { 
    currentRoute, 
    isCreateTripModalOpen, 
    closeCreateTripModal, 
    navigateTo 
  } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentRoute === 'home' && <HomePage />}
        {currentRoute === 'trips' && <TripsPage />}
        {currentRoute === 'trip-detail' && <TripDetailPage />}
        {currentRoute === 'explore' && <ExplorePage />}
        {currentRoute === 'favorites' && <FavoritesPage />}
      </main>

      {/* Global Create Trip Modal */}
      {isCreateTripModalOpen && (
        <TripFormModal
          isOpen={isCreateTripModalOpen}
          onClose={closeCreateTripModal}
          onSuccess={(newTrip) => {
            // Sau khi tạo thành công, chuyển thẳng đến trang chi tiết chuyến đi mới
            navigateTo('trip-detail', newTrip.id);
          }}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </ToastProvider>
  );
};

export default App;
