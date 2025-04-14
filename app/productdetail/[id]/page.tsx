"use client";

import { useSearchParams } from "next/navigation";
import { CiStar } from "react-icons/ci";
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { LuGitCompare } from "react-icons/lu";
import { LiaCcVisa } from "react-icons/lia";
import { FaCcMastercard } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "react-toastify";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
};

const ProductDetailsPage = () => {
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const product: Product = {
    id: Number(searchParams.get("id")),
    name: searchParams.get("name") || "",
    price: Number(searchParams.get("price")),
    image_url: searchParams.get("image_url") || "/fallback-img.png",
  };

  if (!product.name) return <div>Product not found</div>;




  const handleAddToCart = async () => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
  
    if (!userId) {
      alert("Please log in to add to cart.");
      return;
    }
  
    const { error } = await supabase.from("cart").insert([
      {
        user_id:userId,
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
      },
    ]);
  
    if (error) {
      console.error("Error adding to cart:", error.message);
      alert("Something went wrong while adding to cart.");
    } else {
      toast.success("Product added to cart!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-2 gap-10">
      {/* Left: Image */}
      <div className="p-3">
        <Image
          src={product.image_url ?? "/placeholder.jpg"}
          alt={product.name ?? "Product Image"}
          width={100}
          height={100}
          className="rounded-xl w-full border border-[#E4E7E9]"
        />
      </div>

      {/* Right: Details */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold">{product.name}</h1>

        <div className="text-sm text-gray-500 flex gap-4">
          <p>
            SKU: <span className="font-medium">A264671</span>
          </p>
          <p>
            Brand: <span className="font-medium">Apple</span>
          </p>
          <p className="text-green-600 font-medium">Availability: In Stock</p>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-2 text-yellow-500">
          <CiStar size={18} />
          <span className="text-sm font-medium">
            4.7 Star Rating (21,671 reviews)
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-4">
          <span className="text-3xl text-orange-600 font-semibold">
            ${product.price}
          </span>
          <span className="line-through text-gray-400 text-lg">$1899.00</span>
          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm font-semibold">
            21% OFF
          </span>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium">Color:</span>
            <button className="w-6 h-6 rounded-full border-2 border-orange-500 bg-orange-400" />
            <button className="w-6 h-6 rounded-full border bg-gray-300" />
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium">Memory:</span>
            <button className="border px-4 py-1 rounded-full bg-white text-sm">
              16GB
            </button>
            <button className="border px-4 py-1 rounded-full bg-white text-sm">
              32GB
            </button>
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-[7px]">
            <button
              onClick={handleDecrement}
              className="cursor-pointer text-lg px-2"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={handleIncrement}
              className="cursor-pointer text-lg px-2"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="cursor-pointer bg-orange-500 text-white px-6 py-[10px] rounded hover:bg-orange-600"
          >
            ADD TO CART
          </button>
          <Link href="/checkoutpage">
            <button className="border border-orange-500 cursor-pointer text-orange-500 px-6 py-[9px] rounded hover:bg-orange-50">
              BUY NOW
            </button>
          </Link>
        </div>

        {/* Wishlist / Compare / Share */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
          <button className="flex items-center gap-1 hover:text-orange-500">
            <FaRegHeart /> Wishlist
          </button>
          <button className="flex items-center gap-1 hover:text-orange-500">
            <LuGitCompare /> Compare
          </button>
        </div>

        {/* Payment Logos Placeholder */}
        <div className="mt-6 border-t pt-4 text-sm text-gray-400">
          <p>100% Guarantee Safe Checkout</p>
          <div className="flex gap-2 mt-1 items-center">
            <LiaCcVisa className="text-5xl" />
            <FaCcMastercard className="text-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
