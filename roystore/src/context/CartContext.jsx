import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/cart/');
      const items = res.data.items || [];
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch (err) {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    if (user) refreshCart();
  }, [user, refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);