export const getVehicleImageUrl = (
  make?: string,
  model?: string,
  year?: number,
  color?: string,
  angle: 'front' | 'front_angle' | 'side' | 'rear' | 'interior' = 'front_angle',
  background: 'studio' | 'transparent' | 'white' = 'studio'
): string => {
  if (!make || !model) {
    return getFallbackVehicleImage('default');
  }

  const searchQuery = `${make} ${model}`;
  const encodedSearch = encodeURIComponent(searchQuery);
  const yearParam = year ? `&year=${year}` : '';
  const colorParam = color ? `&color=${encodeURIComponent(color)}` : '';

  return `https://images.platetovin.com/api/image?search=${encodedSearch}${yearParam}&angle=${angle}&background=${background}${colorParam}`;
};

export const getFallbackVehicleImage = (vehicleType: string): string => {
  const fallbackImages: Record<string, string> = {
    bike: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
    auto: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
    cabEconomy: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    cabPremium: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=300&fit=crop',
    default: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
  };

  return fallbackImages[vehicleType] || fallbackImages.default;
};

export const getVehicleTypeIcon = (vehicleType: string) => {
  const icons = {
    bike: require('@/assets/icons/bike.png'),
    auto: require('@/assets/icons/bike.png'),
    cabEconomy: require('@/assets/icons/cab.png'),
    cabPremium: require('@/assets/icons/cab_premium.png'),
  };

  return icons[vehicleType as keyof typeof icons] || icons.cabEconomy;
};

export interface VehicleImageOptions {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  type?: string;
  angle?: 'front' | 'front_angle' | 'side' | 'rear' | 'interior';
  background?: 'studio' | 'transparent' | 'white';
}

export const getOptimizedVehicleImage = (options: VehicleImageOptions): string => {
  const { make, model, year, color, type, angle, background } = options;

  if (make && model) {
    return getVehicleImageUrl(make, model, year, color, angle, background);
  }

  return getFallbackVehicleImage(type || 'default');
};

