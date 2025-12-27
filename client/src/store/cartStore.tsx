import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customizations?: Record<string, any>;
  specialInstructions?: string;
}

interface CartRestaurant {
  id: string;
  name: string;
  imageUrl?: string;
  deliveryFee: number;
  minimumOrder: number;
}

interface CartStoreProps {
  items: CartItem[];
  restaurant: CartRestaurant | null;
  
  addItem: (item: CartItem, restaurant: CartRestaurant) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateSpecialInstructions: (menuItemId: string, instructions: string) => void;
  clearCart: () => void;
  
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getPlatformFee: () => number;
  getTotal: () => number;
  isMinimumOrderMet: () => boolean;
}

export const useCartStore = create<CartStoreProps>()(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,

      addItem: (item, restaurant) => {
        const state = get();
        
        if (state.restaurant && state.restaurant.id !== restaurant.id) {
          set({
            items: [{ ...item, quantity: item.quantity || 1 }],
            restaurant,
          });
          return;
        }

        const existingIndex = state.items.findIndex(
          (i) => i.menuItemId === item.menuItemId &&
                 JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
        );

        if (existingIndex >= 0) {
          const updatedItems = [...state.items];
          updatedItems[existingIndex].quantity += item.quantity || 1;
          set({ items: updatedItems, restaurant });
        } else {
          set({
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
            restaurant,
          });
        }
      },

      removeItem: (menuItemId) => {
        const state = get();
        const updatedItems = state.items.filter((item) => item.menuItemId !== menuItemId);
        
        if (updatedItems.length === 0) {
          set({ items: [], restaurant: null });
        } else {
          set({ items: updatedItems });
        }
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item
          ),
        }));
      },

      updateSpecialInstructions: (menuItemId, instructions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.menuItemId === menuItemId
              ? { ...item, specialInstructions: instructions }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [], restaurant: null }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getDeliveryFee: () => {
        const state = get();
        return state.restaurant?.deliveryFee || 0;
      },

      getPlatformFee: () => {
        return get().getSubtotal() * 0.1;
      },

      getTotal: () => {
        const state = get();
        return state.getSubtotal() + state.getDeliveryFee() + state.getPlatformFee();
      },

      isMinimumOrderMet: () => {
        const state = get();
        if (!state.restaurant) return true;
        return state.getSubtotal() >= state.restaurant.minimumOrder;
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

