"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import shopimg from "../../public/assets/Gucci-fw12-Pinterest-banner-ad1.jpg";
import eyeicon from "../../public/assets/productimg/Eye.svg";
import carticon from "../../public/assets/productimg/ShoppingCartSimple.svg";
import hearticon from "../../public/assets/productimg/Heart1.svg";
import { GoArrowRight } from "react-icons/go";
import ProductCard from "../Components/Card/ProductCard ";
import { supabase } from "@/app/lib/supabaseClient";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: 0;
  image_url?: string;
};

const BestDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    fetchProducts();
  }, []);

 const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("allproducts")
    .select("*")
    .order("created_at", { ascending: false }); // Show latest first

  if (!error && data) setProducts(data);
};


  return (
    <div>
      <div className="container mx-auto p-4 pt-7">
        <div className="flex justify-between">
          <div className="flex items-center justify-center text-center">
            <h3 className="text-[24px] font-semibold">Luxury Collection</h3>
          </div>
          <Link href="/browseallproducts">
            <div className="flex justify-center pt-2 items-center cursor-pointer">
              <p className="text-[#2DA5F3] pr-1"> Browse All Brand </p>
              <GoArrowRight className="text-[20px] font-semibold text-[#2DA5F3]" />
            </div>
          </Link>
        </div>

        {/* products  */}
        <div className="grid grid-cols-1 md:grid-cols-12 mt-4 ">
          <div className="md:col-span-3 p-3  border border-[#E4E7E9] hidden sm:block items-center ">
            <Link href="/browseallproducts">
              <Image src={shopimg} alt="shopimg" className="h-[550px]"/>
            </Link>
            <p>Rating</p>
            <p className="text-[#191C1F] font-normal">
              Xbox Series S - 512GB SSD Console with Wireless Controller - EU
              Versio...
            </p>
            <span className="inline-flex items-center gap-2">
              <p className="text-[#ADB7BC] line-through">865.99 </p>
              <p className="text-[#2DA5F3] font-semibold font-sans">₹442.12</p>
            </span>{" "}
            <p className="text-[#5F6C72] text-[14px] pt-3">
              Games built using the Xbox Series X|S development kit showcase
              unparalleled load times, visuals.
            </p>
            <div className="flex justify-between pt-3 items-center ">
              <div className="bg-[#FFE7D6] p-3 cursor-pointer">
                <Image src={hearticon} alt="heart" />
              </div>
              <button className="bg-[#FA8232] p-3 flex gap-x-1 cursor-pointer">
                <Image src={carticon} alt="cart" />
                <p className="font-semibold text-white">ADD TO CART</p>
              </button>
              <div className="bg-[#FFE7D6] p-3 cursor-pointer">
                <Image src={eyeicon} alt="eye" />
              </div>
            </div>
          </div>

          {/* products  */}
          <div className="md:col-span-9  rounded-md">
            <div className="grid grid-cols-2 sm:gap-0 gap-1 md:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
