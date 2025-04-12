"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
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


  const filterProducts = useCallback(() => {
    if (activeCategoryId === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category_id === activeCategoryId)
      );
    }
  }, [activeCategoryId, products]);
  
  useEffect(() => {
    filterProducts();
  }, [activeCategoryId, products,filterProducts]);




  return (
    <div>
      <div className="container mx-auto pt-8 ">
        <div className="grid grid-cols-1 md:grid-cols-12 mt-8 gap-x-4">
          {/* Products Section */}
          <div className="md:col-span-9">
            <div className="flex justify-between ">
              <h3 className="text-[24px] font-semibold text-[#191C1F]">
                Computer Accessories
              </h3>

              {/* Category List */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ul className="hidden sm:flex flex-wrap gap-2 text-[#191C1F] font-semibold text-sm sm:text-base">
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
                        className={`absolute left-0 bottom-0 h-[2px] bg-orange-500 transition-all duration-300 ${
                          activeCategoryId === category.id ? "w-full" : "w-0"
                        }`}
                      ></span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/browseallproducts"
                  className="flex items-center mt-2 sm:mt-0"
                >
                  <p className="text-[#FA8232] px-2 cursor-pointer text-sm sm:text-base">
                    Browse All Product
                  </p>
                  <Image
                    src={arrowimg}
                    alt="arrow"
                    className="pt-1 w-4 h-4 sm:w-5 sm:h-5"
                  />
                </Link>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-9 px-2">
              {filteredProducts.length > 0 ? (
                filteredProducts
                  .slice(0, 8)
                  .map((product) => (
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
          <div className="md:col-span-3 hidden sm:block items-center cursor-pointer gap-y-6">
            <Image src={b2} alt="shopimg" />
            <Image src={b1} alt="shopimg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComputerAccesories;
