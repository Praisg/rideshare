import { appAxios } from './apiInterceptors';

interface RestaurantFilters {
  cuisine?: string;
  isOpen?: boolean;
  featured?: boolean;
  minRating?: number;
  priceRange?: string;
  search?: string;
}

export const getRestaurants = async (filters: RestaurantFilters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.cuisine) params.append('cuisine', filters.cuisine);
    if (filters.isOpen !== undefined) params.append('isOpen', String(filters.isOpen));
    if (filters.featured) params.append('featured', 'true');
    if (filters.minRating) params.append('minRating', String(filters.minRating));
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.search) params.append('search', filters.search);

    const response = await appAxios.get(`/restaurants?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch restaurants:', error);
    return { success: false, restaurants: [], error: error.message };
  }
};

export const getRestaurantById = async (id: string) => {
  try {
    const response = await appAxios.get(`/restaurants/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch restaurant:', error);
    return { success: false, restaurant: null, error: error.message };
  }
};

export const getRestaurantMenu = async (id: string, category?: string) => {
  try {
    const url = category 
      ? `/restaurants/${id}/menu?category=${encodeURIComponent(category)}`
      : `/restaurants/${id}/menu`;
    const response = await appAxios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch menu:', error);
    return { success: false, menuItems: [], categories: [], error: error.message };
  }
};

export const searchRestaurants = async (query: string) => {
  try {
    const response = await appAxios.get(`/restaurants/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to search restaurants:', error);
    return { success: false, restaurants: [], error: error.message };
  }
};

export const getCuisines = async () => {
  try {
    const response = await appAxios.get('/restaurants/cuisines');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch cuisines:', error);
    return { success: false, cuisines: ['All'], error: error.message };
  }
};

