import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type RoutePage = 'home' | 'trips' | 'trip-detail' | 'explore' | 'favorites';

interface NavigationContextType {
  currentRoute: RoutePage;
  currentTripId: string | null;
  activeTab: string;
  navigateTo: (page: RoutePage, tripId?: string | null, tab?: string) => void;
  openCreateTripModal: () => void;
  isCreateTripModalOpen: boolean;
  closeCreateTripModal: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const parseHash = () => {
    const hash = window.location.hash.replace('#', '') || '/';
    if (hash === '/' || hash === '') return { page: 'home' as RoutePage, tripId: null, tab: 'overview' };
    if (hash === '/trips') return { page: 'trips' as RoutePage, tripId: null, tab: 'overview' };
    if (hash.startsWith('/trips/')) {
      const parts = hash.split('/');
      return {
        page: 'trip-detail' as RoutePage,
        tripId: parts[2] || null,
        tab: parts[3] || 'overview'
      };
    }
    if (hash === '/explore') return { page: 'explore' as RoutePage, tripId: null, tab: 'overview' };
    if (hash === '/favorites') return { page: 'favorites' as RoutePage, tripId: null, tab: 'overview' };
    return { page: 'home' as RoutePage, tripId: null, tab: 'overview' };
  };

  const initial = parseHash();
  const [currentRoute, setCurrentRoute] = useState<RoutePage>(initial.page);
  const [currentTripId, setCurrentTripId] = useState<string | null>(initial.tripId);
  const [activeTab, setActiveTab] = useState<string>(initial.tab);
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash();
      setCurrentRoute(parsed.page);
      setCurrentTripId(parsed.tripId);
      setActiveTab(parsed.tab);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: RoutePage, tripId: string | null = null, tab: string = 'overview') => {
    let hash = '#/';
    if (page === 'trips') hash = '#/trips';
    else if (page === 'trip-detail' && tripId) hash = `#/trips/${tripId}/${tab}`;
    else if (page === 'explore') hash = '#/explore';
    else if (page === 'favorites') hash = '#/favorites';

    window.location.hash = hash;
    setCurrentRoute(page);
    setCurrentTripId(tripId);
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const openCreateTripModal = () => setIsCreateTripModalOpen(true);
  const closeCreateTripModal = () => setIsCreateTripModalOpen(false);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        currentTripId,
        activeTab,
        navigateTo,
        openCreateTripModal,
        isCreateTripModalOpen,
        closeCreateTripModal
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
