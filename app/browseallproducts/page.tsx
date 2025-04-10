"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ProductCard from "../Components/Card/ProductCard ";
import { supabase } from "../lib/supabaseClient";
import glass from "@/public/assets/glass.svg";
import postar1 from "../../public/assets/image-watch.svg";
import postar2 from "../../public/assets/Content.svg";
import { AddtoCartBtn } from "../Components/button/Button";


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

const priceRanges = [
  { label: "All Price", min: null, max: null },
  { label: "Under $20", min: 0, max: 20 },
  { label: "$25 to $100", min: 25, max: 100 },
  { label: "$100 to $300", min: 100, max: 300 },
  { label: "$300 to $500", min: 300, max: 500 },
  { label: "$500 to $1,000", min: 500, max: 1000 },
  { label: "$1,000 to $10,000", min: 1000, max: 10000 },
];

const Page = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activeCategoryId, products, searchQuery, selectedPriceRange]);

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

  const applyFilters = () => {
    let result = [...products];

    if (activeCategoryId !== null) {
      result = result.filter((product) => product.category_id === activeCategoryId);
    }

    if (searchQuery.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPriceRange.min !== null && selectedPriceRange.max !== null) {
      result = result.filter(
        (product) =>
          product.price >= (selectedPriceRange.min ?? 0) &&
          product.price <= (selectedPriceRange.max ?? Infinity)
      );
    }

    setFilteredProducts(result);
  };

  const handleSearch = () => {
    applyFilters();
  };


  

  return (
    <div className="container">
    <div className="px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar Section */}
        <div className="md:col-span-3">
          <form className="flex flex-col gap-4">
            {/* Category Filter */}
            <div>
              <h4 className="text-lg font-semibold text-[#191C1F] mb-2">CATEGORY</h4>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer mb-1">
                <div className="relative">
                  <input
                    type="radio"
                    name="product-category"
                    value="all"
                    checked={activeCategoryId === null}
                    onChange={() => setActiveCategoryId(null)}
                    className="appearance-none w-4 h-4 border-2 border-orange-500 rounded-full checked:bg-orange-500"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                </div>
                All Products
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 text-gray-700 cursor-pointer mb-1">
                  <div className="relative">
                    <input
                      type="radio"
                      name="product-category"
                      value={category.id}
                      checked={activeCategoryId === category.id}
                      onChange={() => setActiveCategoryId(category.id)}
                      className="appearance-none w-4 h-4 border-2 border-orange-500 rounded-full checked:bg-orange-500"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </span>
                  </div>
                  {category.name}
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-lg font-semibold text-[#191C1F] mb-2">PRICE RANGE</h4>
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center gap-2 text-gray-700 cursor-pointer mb-1">
                  <div className="relative">
                    <input
                      type="radio"
                      name="price-range"
                      value={range.label}
                      checked={
                        selectedPriceRange.min === range.min &&
                        selectedPriceRange.max === range.max
                      }
                      onChange={() => setSelectedPriceRange(range)}
                      className="appearance-none w-4 h-4 border-2 border-orange-500 rounded-full checked:bg-orange-500"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </span>
                  </div>
                  {range.label}
                </label>
              ))}
            </div>
          </form>

          {/* Image Poster */}
          <div className="mt-6 border-2 border-[#FFE7D6] rounded-lg overflow-hidden p-2 flex flex-col items-center gap-y-3">
          <Image src={postar1} alt="Poster 1" width={400} className="w-full" />
            <Image src={postar2} alt="Poster 2" width={400} className="w-full" />
            <AddtoCartBtn />
          </div>
        </div>

        {/* Product Section */}
        <div className="md:col-span-9">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="flex bg-white border border-gray-300 rounded-md px-4 py-2 items-center">
              <input
                type="text"
                placeholder="Search for anything..."
                className="flex-1 outline-none text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div onClick={handleSearch} className="cursor-pointer">
                <Image alt="Search" src={glass} width={20} height={20} />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Page;
