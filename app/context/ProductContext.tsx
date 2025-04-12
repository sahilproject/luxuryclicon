"use client";
import { createContext, useState, ReactNode, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  quantity?: number;
}

type WishlistItem = {
  id: number;
  user_id: string;
  product_id: number;
  name: string;
  price: number;
  image_url?: string;
  quantity?: number;
};

interface CartContextType {
  cart: Product[];
  wishList: WishlistItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
  addTowishList: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
}

export const cartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishList, setWishList] = useState<WishlistItem[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const user_id = session.user.id;

      // Fetch Cart
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user_id);

      if (cartData) {
        setCart(
          cartData.map((item) => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            image_url: item.image_url,
            quantity: item.quantity ?? 1,
          }))
        );
      } else if (cartError) {
        console.error("Failed to load cart:", cartError.message);
        toast.error("Could not load your cart!");
      }

      // Fetch Wishlist
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("user_id, product_id, name, price, image_url, quantity")
        .eq("user_id", user_id);

      if (wishlistData) {
        setWishList(
          wishlistData.map((item) => ({
            id: item.product_id,
            user_id: item.user_id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            image_url: item.image_url,
            quantity: item.quantity ?? 1,
          }))
        );
      } else if (wishlistError) {
        console.error("Failed to load wishlist:", wishlistError.message);
        toast.error("Could not load your wishlist!");
      }
    };

    fetchData();
  }, []);

  const addToCart = async (product: Product) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const updatedCart = existing
        ? prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        : [...prevCart, { ...product, quantity: 1 }];

      supabase.from("cart").upsert(
        {
          user_id: session.user.id,
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: existing ? (existing.quantity ?? 1) + 1 : 1,
        },
        { onConflict: "user_id,product_id" }
      );

      return updatedCart;
    });
  };

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

  const addTowishList = async (product: Product) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const exists = wishList.find((item) => item.product_id === product.id);
    if (exists) return;

    const newWishItem: WishlistItem = {
      id: product.id,
      product_id: product.id,
      user_id: session.user.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    };

    setWishList((prev) => [...prev, newWishItem]);

    await supabase.from("wishlist").upsert(
      {
        user_id: session.user.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      },
      { onConflict: "user_id,product_id" }
    );
  };

  const removeFromWishlist = async (id: number) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    setWishList((prev) => prev.filter((item) => item.product_id !== id));

    await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", session.user.id)
      .eq("product_id", id);
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
        clearCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};
