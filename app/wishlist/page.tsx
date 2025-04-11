"use client";
import React, { useContext, useEffect, useState } from "react";
import { cartContext } from "../context/ProductContext";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";


type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
};

export type CartItem = {
  user_id: string;
  product_id: number;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
};

type WishlistItem = {
  id: number;
  user_id: string;
  product_id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image_url?: string;
  quantity?: number;
};




export default function WishlistTable() {
  const context = useContext(cartContext);
  const [userId, setUserId] = useState<string | null>(null);

  // Get logged-in user ID
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    getUser();
  }, []);

  if (!context) {
    return <p className="text-red-500">CartProvider not found</p>;
  }

  const { wishList, removeFromWishlist, addToCart } = context;

  const handleAddToCart = async (item: Product) => {
    if (!userId) return toast.error("User not logged in");

    addToCart(item);
    removeFromWishlist(item.id);

    const { error: insertError } = await supabase.from("cart").insert([
      {
        user_id: userId,
        product_id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        quantity: 1,
      },
    ]);

    const { error: deleteError } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", item.id);

    if (insertError || deleteError) {
      console.error("Insert/Delete Error:", insertError || deleteError);
      toast.error("Failed to update cart/wishlist");
    } else {
      toast.success("Item added to cart & removed from wishlist");
    }
  };

  const handleRemoveFromWishlist = async (item: WishlistItem) => {
    removeFromWishlist(item.id);

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", item.id);

    if (error) {
      toast.error("Failed to remove from wishlist");
      console.error(error.message);
    } else {
      toast.success("Item removed from wishlist");
    }
  };




  return (
    <div className="max-w-6xl mx-auto my-10 border border-[#E4E7E9]">
      <div className="border-b border-[#E4E7E9] px-4 py-2 font-semibold">
        Wishlist
      </div>
      <table className="w-full text-sm text-left">
        <thead className="uppercase text-gray-500 border-b border-[#E4E7E9]">
          <tr>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishList.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                Your wishlist is empty.
              </td>
            </tr>
          ) : (
            wishList.map((item: any) => (
              <tr key={item.id} className="border-b border-[#E4E7E9]">
                <td className="px-4 py-4 flex items-start gap-4">
                  <Image
        src={item.image_url || "/placeholder.png"}
        alt={item.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                  <span>{item.name}</span>
                </td>
                <td className="px-4 py-4">
                  {item.oldPrice && (
                    <span className="line-through text-gray-400 mr-2">
                      {item.oldPrice}
                    </span>
                  )}
                  <span className="font-bold">${item.price}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-medium text-green-600">IN STOCK</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="cursor-pointer text-white px-4 py-2 text-xs rounded flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                    >
                      ADD TO CART
                      <FaShoppingCart />
                    </button>
                    <FaTrash
                      className="text-gray-500 cursor-pointer hover:text-red-600"
                      onClick={() => handleRemoveFromWishlist(item)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
