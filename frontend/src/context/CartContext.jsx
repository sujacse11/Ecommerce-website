import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart/');
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    const res = await api.post('/cart/add_item/', { product_id: productId, quantity });
    setCart(res.data);
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await api.patch('/cart/update_item/', { item_id: itemId, quantity });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    const res = await api.delete('/cart/remove_item/', { data: { item_id: itemId } });
    setCart(res.data);
  };

  const clearCart = async () => {
    await api.post('/cart/clear/');
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
