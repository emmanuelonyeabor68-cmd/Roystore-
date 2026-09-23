import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/cart/');
      const items = res.data.items || [];
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch (err) {
      setCartCount(0);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);