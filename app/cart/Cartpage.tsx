"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";


interface CartProps {
  onClose: () => void;
}

interface SupabaseCartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  user_id: string;
}


const Cart: React.FC<CartProps> = ({ onClose }) => {
  const [dbCart, setDbCart] = useState<SupabaseCartItem[]>([]);
  const hasFetched = useRef(false); 

  const router = useRouter();

  useEffect(() => {
    const fetchUserCart = async () => {
      if (hasFetched.current) return; 
      hasFetched.current = true;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.info("Please sign in to see your cart!");
        return;
      }

      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load your cart!");
      } else {
        setDbCart(data);
      }
    };

    fetchUserCart();
  }, []);
  
  const handleRemove = async (id: number) => {
    const { error } = await supabase.from("cart").delete().eq("id", id);

    if (!error) {
      setDbCart((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removed from cart!");
    } else {
      console.error("Remove error:", error);
      toast.error("Failed to remove item!");
    }
  };

  const subtotal = dbCart.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

  const handleNavigation = () => {
    onClose();
    router.push("/cart/cartpage");
  };

  return (
    <div className="absolute top-12 right-2 sm:right-25 w-[400px] bg-white shadow-lg rounded-lg p-4 z-50">
      <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>

      {dbCart.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {dbCart.map((item) => (
            <li key={item.id} className="flex items-center gap-3 border-b pb-2">
              <Image
                width={70}
                height={70}
                alt={item.name}
                src={item.image_url}
                className="rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-sm text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <RxCross2 />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Subtotal */}
      <div className="mt-6 flex flex-col gap-3 font-semibold">
        <div className="flex justify-between text-sm">
          <p className="font-normal">Sub-Total:</p>
          <p className="font-semibold">${subtotal.toFixed(2)} USD</p>
        </div>

        <Link
          href="/checkoutpage"
          onClick={handleNavigation}
          className="font-semibold w-full flex justify-center items-center bg-[#FA8232] text-white py-3 rounded-sm hover:bg-blue-600 transition-all"
        >
          CHECKOUT NOW <GoArrowRight className="ml-2 text-xl" />
        </Link>

        <Link
          href="/cart/cartpage"
          onClick={handleNavigation}
          className="border border-[#FFE7D6] font-semibold w-full flex justify-center items-center bg-white text-[#FA8232] py-3 rounded-sm hover:bg-orange-200"
        >
          VIEW CART <GoArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
