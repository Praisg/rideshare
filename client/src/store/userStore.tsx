import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
} | null;

interface SavedPlace {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    promo: boolean;
  };
  accessibility: {
    largerText: boolean;
    highContrast: boolean;
  };
}

interface UserStoreProps {
  user: any;
  location: CustomLocation;
  outOfRange: boolean;
  savedPlaces: SavedPlace[];
  preferences: UserPreferences;
  setUser: (data: any) => void;
  setOutOfRange: (data: boolean) => void;
  setLocation: (data: CustomLocation) => void;
  setSavedPlaces: (places: SavedPlace[]) => void;
  addSavedPlace: (place: SavedPlace) => void;
  removeSavedPlace: (id: string) => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  clearData: () => void;
}

const defaultPreferences: UserPreferences = {
  notifications: {
    push: true,
    email: true,
    sms: true,
    promo: false,
  },
  accessibility: {
    largerText: false,
    highContrast: false,
  },
};

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      outOfRange: false,
      savedPlaces: [],
      preferences: defaultPreferences,
      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      setOutOfRange: (data) => set({ outOfRange: data }),
      setSavedPlaces: (places) => set({ savedPlaces: places }),
      addSavedPlace: (place) =>
        set((state) => ({
          savedPlaces: [
            ...state.savedPlaces.filter((p) => p.id !== place.id),
            place,
          ],
        })),
      removeSavedPlace: (id) =>
        set((state) => ({
          savedPlaces: state.savedPlaces.filter((p) => p.id !== id),
        })),
      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      clearData: () =>
        set({
          user: null,
          location: null,
          outOfRange: false,
          savedPlaces: [],
          preferences: defaultPreferences,
        }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        savedPlaces: state.savedPlaces,
        preferences: state.preferences,
      }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
