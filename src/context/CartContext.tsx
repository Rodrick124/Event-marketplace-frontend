import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import API from '../services/axios';
import { extractData } from '../services/response';
import { useAuth } from './AuthContext';

// Types based on the provided API documentation
interface CartItemEvent {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  availableSeats: number;
  date: string;
}

export interface CartItem {
  _id: string;
  quantity: number;
  eventId: CartItemEvent;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  addToCart: (eventId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await API.get('/cart');
      const { data } = extractData<Cart>(response.data);
      setCart(data);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to load cart.');
        console.error(err);
      } else {
        setCart(null); // No cart exists for user, which is a valid state
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleCartUpdate = async (request: Promise<any>) => {
    if (!isAuthenticated) throw new Error('You must be logged in to manage your cart.');
    setIsLoading(true);
    setError(null); // Clear previous errors on a new action
    try {
      const response = await request;
      const { data } = extractData<Cart>(response.data);
      setCart(data);
    } catch (err: any) {
      // Provide a more descriptive error message
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred with your cart.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (eventId: string, quantity: number) => handleCartUpdate(API.post('/cart', { eventId, quantity }));
  const updateQuantity = (itemId: string, quantity: number) => handleCartUpdate(API.patch(`/cart/items/${itemId}`, { quantity }));
  const removeFromCart = (itemId: string) => handleCartUpdate(API.delete(`/cart/items/${itemId}`));
  const clearCart = () => handleCartUpdate(API.delete('/cart'));

  //  Count the number of unique items (event types) in the cart, not the total quantity of tickets.
  const itemCount = cart?.items.length || 0;

  const value = {
    cart,
    isLoading,
    error,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetchCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};