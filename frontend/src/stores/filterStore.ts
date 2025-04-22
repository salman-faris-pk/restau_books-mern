import { create } from 'zustand';

interface FilterState {
  selectedStars: string[];
  selectedHotelTypes: string[];
  selectedFacilities: string[];
  selectedPrice?: number;
  sortOption: string;
  page: number;
  setSelectedStars: (stars: string[] | ((prev: string[]) => string[])) => void;
  setSelectedHotelTypes: (types: string[] | ((prev: string[]) => string[])) => void;
  setSelectedFacilities: (facilities: string[] | ((prev: string[]) => string[])) => void;
  setSelectedPrice: (price?: number) => void;
  setSortOption: (option: string) => void;
  setPage: (page: number) => void;
}


const loadState = () => {
  if (typeof window === 'undefined') return {};
  const saved = sessionStorage.getItem('hotelFilters');
  return saved ? JSON.parse(saved) : {};
};

export const useFilterStore = create<FilterState>((set) => ({
  selectedStars: loadState().selectedStars || [],
  selectedHotelTypes: loadState().selectedHotelTypes || [],
  selectedFacilities: loadState().selectedFacilities || [],
  selectedPrice: loadState().selectedPrice,
  sortOption: loadState().sortOption || '',
  page: loadState().page || 1,

  setSelectedStars: (stars) => {
    set((state) => {
      const updatedStars = typeof stars === 'function' ? stars(state.selectedStars) : stars;
      persistState({ selectedStars: updatedStars });
      return { selectedStars: updatedStars };
    });
  },
  
  setSelectedHotelTypes: (types) => {
    set((state) => {
      const updatedTypes = typeof types === 'function' ? types(state.selectedHotelTypes) : types;
      persistState({ selectedHotelTypes: updatedTypes });
      return { selectedHotelTypes: updatedTypes };
    });
  },
  
  setSelectedFacilities: (facilities) => {
    set((state) => {
      const updatedFacilities = typeof facilities === 'function' ? facilities(state.selectedFacilities) : facilities;
      persistState({ selectedFacilities: updatedFacilities });
      return { selectedFacilities: updatedFacilities };
    });
  },
  
  setSelectedPrice: (selectedPrice) => {
    set({ selectedPrice });
    persistState({ selectedPrice });
  },
  setSortOption: (sortOption) => {
    set({ sortOption });
    persistState({ sortOption });
  },
  setPage: (page) => {
    set({ page });
    persistState({ page });
  },
}));


function persistState(partialState: Partial<FilterState>) {
  if (typeof window === 'undefined') return;
  const currentState = JSON.parse(sessionStorage.getItem('hotelFilters') || '{}');
  sessionStorage.setItem(
    'hotelFilters',
    JSON.stringify({ ...currentState, ...partialState })
  );
}