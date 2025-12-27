import { create } from 'zustand';

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  deliveryFee: number;
  minimumOrder: number;
  imageUrl: string;
  coverImage: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
  featured: boolean;
  preparationTime: number;
}

interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  customizations: any[];
}

interface EatsFilters {
  cuisine: string;
  priceRange: string;
  minRating: number | null;
  isOpen: boolean | null;
}

interface EatsStoreProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  categories: string[];
  cuisines: string[];
  filters: EatsFilters;
  isLoading: boolean;
  
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  setMenuItems: (items: MenuItem[]) => void;
  setCategories: (categories: string[]) => void;
  setCuisines: (cuisines: string[]) => void;
  setFilters: (filters: Partial<EatsFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  clearEatsData: () => void;
}

const defaultFilters: EatsFilters = {
  cuisine: 'All',
  priceRange: '',
  minRating: null,
  isOpen: null,
};

export const useEatsStore = create<EatsStoreProps>((set) => ({
  restaurants: [],
  selectedRestaurant: null,
  menuItems: [],
  categories: [],
  cuisines: ['All'],
  filters: defaultFilters,
  isLoading: false,

  setRestaurants: (restaurants) => set({ restaurants }),
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  setMenuItems: (items) => set({ menuItems: items }),
  setCategories: (categories) => set({ categories }),
  setCuisines: (cuisines) => set({ cuisines }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  resetFilters: () => set({ filters: defaultFilters }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearEatsData: () => set({
    restaurants: [],
    selectedRestaurant: null,
    menuItems: [],
    categories: [],
    filters: defaultFilters,
  }),
}));

