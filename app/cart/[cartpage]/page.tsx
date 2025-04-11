"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "react-toastify";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SupabaseCartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  user_id: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<SupabaseCartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.info("Please log in to see your cart.");
        return;
      }

      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to fetch cart data.");
        return;
      }

      setCart(data);
    };

    fetchCart();
  }, []);

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;

    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQty })
      .eq("id", id);

    if (!error) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const removeFromCart = async (id: number) => {
    const { error } = await supabase.from("cart").delete().eq("id", id);
    if (!error) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removed from cart!");
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = 24;
  const tax = 61.99;
  const total = subtotal - discount + tax;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-2/3 border border-gray-200 rounded-md">
        <h2 className="text-xl font-semibold p-4 border-b border-[#E4E7E9]">
          Shopping Cart
        </h2>

        {cart.length > 0 && (
          <div className="grid grid-cols-5 px-4 py-2 text-sm font-semibold text-gray-600 border-b border-[#E4E7E9] bg-gray-50">
            <div className="col-span-2">PRODUCTS</div>
            <div className="text-center">PRICE</div>
            <div className="text-center">QUANTITY</div>
            <div className="text-center">SUBTOTAL</div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="p-6 text-gray-500">Your cart is currently empty.</div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 items-center border-b border-[#E4E7E9] px-4 py-3 text-sm"
              >
                <div className="col-span-2 flex items-center gap-4">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="rounded"
                  />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-600 text-xs line-through">
                      ${(item.price + 20).toFixed(2)}
                    </p>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="text-center">${item.price.toFixed(2)}</div>

                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 border rounded cursor-pointer"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 border rounded  cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="text-center flex items-center justify-center gap-2">
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-500 cursor-pointer"
                  >
                    <RxCross2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between px-4 py-4">
              <Link
                href="/"
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold border border-[#E4E7E9] px-3 py-2 rounded text-blue-500 border-blue-500"
              >
                <GoArrowLeft /> RETURN TO SHOP
              </Link>
              <button className="text-sm font-semibold cursor-pointer border px-4 py-2 rounded text-blue-500 border-blue-500">
                UPDATE CART
              </button>
            </div>
          </>
        )}
      </div>

      <div className="w-full lg:w-1/3 space-y-6">
        <div className="border p-4 rounded-md border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Cart Totals</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Sub-total:</span>
              <span>${subtotal > 0 ? subtotal.toFixed(2) : "0.00"}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between">
              <span>Discount:</span>
              <span>${subtotal > 0 ? discount.toFixed(2) : "0.00"}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${subtotal > 0 ? tax.toFixed(2) : "0.00"}</span>
            </div>

            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${subtotal > 0 ? total.toFixed(2) : "0.00"} USD</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/checkoutpage")}
            className="mt-4 w-full flex justify-center items-center cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-sm"
          >
            PROCEED TO CHECKOUT <GoArrowRight className="ml-2 " />
          </button>
        </div>
      </div>
    </div>
  );
}
