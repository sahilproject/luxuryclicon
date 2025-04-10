"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import arrowimg from "../../public/assets/ArrowRight.png";
import ProductCard from "./Card/ProductCard ";
import b1 from "../../public/assets/HeroImg/b-1.svg";
import b2 from "../../public/assets/HeroImg/b-2.svg";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  category_id: number;
};

type Category = {
  id: number;
  name: string;
};

const ComputerAccesories = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [activeCategoryId, products]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("allproducts").select("*");
    if (!error && data) {
      setProducts(data);
      setFilteredProducts(data); // Show all by default
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error && data) {
      setCategories(data);
    }
  };

  const filterProducts = () => {
    if (activeCategoryId === null) {
      setFilteredProducts(products); // All Product selected
    } else {
      setFilteredProducts(
        products.filter((product) => product.category_id === activeCategoryId)
      );
    }
  };

  return (
    <div>
      <div className="container mx-auto pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 mt-8 gap-x-4">
          {/* Products Section */}
          <div className="md:col-span-9">
            <div className="flex justify-between">
              <h3 className="text-[24px] font-semibold text-[#191C1F]">
                Computer Accessories
              </h3>

              {/* Category List */}
              <div className="flex items-center">
                <ul className="flex gap-4 text-[#191C1F] font-semibold">
                  <li
                    className={`relative cursor-pointer ${
                      activeCategoryId === null
                        ? "text-orange-500"
                        : "text-gray-700"
                    }`}
                    onClick={() => setActiveCategoryId(null)}
                  >
                    All Product
                    <span
                      className={`absolute left-0 bottom-0 h-[2px] bg-orange-500 transition-all duration-300 ${
                        activeCategoryId === null ? "w-full" : "w-0"
                      }`}
                    ></span>
                  </li>
                  {categories.slice(0, 4).map((category) => (
                    <li
                      key={category.id}
                      className={`relative cursor-pointer ${
                        activeCategoryId === category.id
                          ? "text-orange-500"
                          : "text-gray-700"
                      }`}
                      onClick={() => setActiveCategoryId(category.id)}
                    >
                      {category.name}
                      <span
                        className={`absolute left-0 bottom-0 h-[2px] bg-orange-500 ${
                          activeCategoryId === category.id ? "w-full" : "w-0"
                        } transition-all duration-300`}
                      ></span>
                    </li>
                  ))}
                </ul>
                <Link href="/browseallproducts" className="flex">
                <p className="text-[#FA8232] px-2 cursor-pointer">
                  Browse All Product
                </p>
                <Image className="pt-1" src={arrowimg} alt="arrow" />
                </Link>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-9">
            {filteredProducts.length > 0 ? (
  filteredProducts.slice(0, 8).map((product) => (
    <ProductCard key={product.id} product={product} />
  ))
) : (
  <p className="text-gray-500 col-span-4 text-center">
    No products found in this category.
  </p>
)}
            </div>
          </div>

          {/* Sidebar Images */}
          <div className="md:col-span-3 grid items-center cursor-pointer gap-y-6">
            <Image src={b2} alt="shopimg" />
            <Image src={b1} alt="shopimg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComputerAccesories;
