import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '@/data/products';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  wishlist: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const cartKey = user?.id ? `cart_${user.id}` : null;
  const wishlistKey = user?.id ? `wishlist_${user.id}` : null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
  if (!cartKey) {
    setItems([]);
    return;
  }

  try {
    const saved = localStorage.getItem(cartKey);
    setItems(saved ? JSON.parse(saved) : []);
  } catch {
    setItems([]);
  }
}, [cartKey]);

useEffect(() => {
  if (!wishlistKey) {
    setWishlist([]);
    return;
  }

  try {
    const saved = localStorage.getItem(wishlistKey);
    setWishlist(saved ? JSON.parse(saved) : []);
  } catch {
    setWishlist([]);
  }
}, [wishlistKey]);

useEffect(() => {
  if (!cartKey) return;
  localStorage.setItem(cartKey, JSON.stringify(items));
}, [items, cartKey]);

useEffect(() => {
  if (!wishlistKey) return;
  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
}, [wishlist, wishlistKey]);

  const addToCart = useCallback((product: Product) => {
  if (!user) {
    alert("Please login to add items to cart");
    return;
  }

  setItems(prev => {
    const existing = prev.find(i => i.product.id === product.id);
    if (existing) {
      return prev.map(i =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    }
    return [...prev, { product, quantity: 1 }];
  });
}, [user]);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
  if (!user) {
    alert("Please login to use wishlist");
    return;
  }

  setWishlist(prev =>
    prev.includes(productId)
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
  );
}, [user]);

  const cartTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
