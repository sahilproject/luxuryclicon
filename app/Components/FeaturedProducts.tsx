"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import postar1 from "../../public/assets/postar1.svg";
import ProductCard from "./Card/ProductCard ";
import { GoArrowRight } from "react-icons/go";
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

const FeaturedProducts = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null); // null = All Product
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
      setFilteredProducts(data);
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
      setFilteredProducts(products); // Show all
    } else {
      setFilteredProducts(
        products.filter((product) => product.category_id === activeCategoryId)
      );
    }
  };

  return (
    <div>
      <div className="container mx-auto pt-7">
        {/* Products Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 mt-8 gap-x-2">
          <div className="md:col-span-3 grid items-center cursor-pointer">
            <Image src={postar1} alt="shopimg" />
          </div>

          {/* Product Listing */}
          <div className="md:col-span-9">
            <div className="flex justify-between">
              <div className="flex items-center">
                <h3 className="text-[24px] font-semibold text-[#191C1F]">Featured Products</h3>
              </div>

              {/* Dynamic Category Filter */}
              <div className="flex items-center">
                <ul className="flex gap-4 text-[#191C1F] font-semibold">
                  <li
                    className={`relative cursor-pointer ${
                      activeCategoryId === null ? "text-orange-500" : "text-gray-700"
                    }`}
                    onClick={() => setActiveCategoryId(null)}
                  >
                    All Product
                    <span
                      className={`absolute left-0 bottom-0 h-[2px] bg-orange-500 ${
                        activeCategoryId === null ? "w-full" : "w-0"
                      } transition-all duration-300`}
                    ></span>
                  </li>
                  {categories.slice(0, 4).map((category) => (
  <li
    key={category.id}
    className={`relative cursor-pointer ${
      activeCategoryId === category.id ? "text-orange-500" : "text-gray-700"
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
                <Link href="/browseallproducts">
                <div className="flex justify-center items-center">
                <p className="text-[#FA8232] px-2 cursor-pointer"> Browse All Products </p>
                <GoArrowRight className="text-[20px] font-semibold text-[#FA8232] pt-1" />
                </div>
                </Link>
                
              </div>
            </div>

            {/* Filtered Products Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-9">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-4">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
