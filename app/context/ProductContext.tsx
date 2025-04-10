"use client";
import { createContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number; 
  image_url?: string;
  quantity?: number;
  oldPrice?: number; 
}

interface CartContextType {
  cart: Product[];
  wishList: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void,
  updateQuantity: (id: number, quantity: number) => void;
  addTowishList: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
}

export const cartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishList, setWishList] = useState<Product[]>([]);

  // Add to Cart 
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Update Quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return; 
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);
  

  const addTowishList = (product: Product) => {
    setWishList((prev) => [...prev, product]);
  };

  const removeFromWishlist = (id: number) => {
    setWishList((prev) => prev.filter((item) => item.id !== id));
  };



  return (
    <cartContext.Provider
      value={{
        cart,
        wishList,
        addToCart,
        removeFromCart,
        updateQuantity,
        addTowishList,
        removeFromWishlist,
        clearCart
      }}
    >
      {children}
    </cartContext.Provider>
  );
};
