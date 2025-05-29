"use client";
import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaEye, FaStar } from "react-icons/fa";
import { cartContext } from "@/app/context/ProductContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";
import { BuynowBtn } from "../button/Button";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  const context = useContext(cartContext);
  const router = useRouter();

  if (!context) {
    console.error("Error: ProductCard must be used within a CartProvider");
    return null;
  }

  const { addToCart, addTowishList } = context;

  useEffect(() => {
    if (!product?.name) return;

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_name", product.name);

      if (error) {
        console.error("Error fetching reviews:", error.message);
      } else if (data.length > 0) {
        const ratings = data.map((r) => r.rating);
        const total = ratings.length;
        const average = ratings.reduce((sum, val) => sum + val, 0) / total;

        setTotalReviews(total);
        setAverageRating(Number(average.toFixed(1)));
      }
    };

    fetchReviews();
  }, [product?.name]);

  const handleAddToCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.info("Please sign in to add to cart!");
      localStorage.setItem(
        "pendingCartProduct",
        JSON.stringify({ ...product, quantity })
      );
      localStorage.setItem("redirectToAddCart", "true");
      return;
    }

    addToCart({ ...product, quantity });

    const { error } = await supabase.from("cart").insert([
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url || "",
        user_id: user.id,
      },
    ]);

    if (error) {
      toast.error("Failed to add to cart in database!");
      console.error("Supabase Error:", error);
    } else {
      toast.success("Added to cart!", {
        position: "top-right",
        autoClose: 1500,
      });

      router.push("/checkoutpage");
    }
  };

  const handleAddToWishlist = () => {
    addTowishList(product);
    toast.success("Added to Wishlist!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      <div
        className="relative border border-[#E4E7E9] rounded-sm p-3 overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt="product-img"
              className="w-full"
              width={300}
              height={300}
            />
          )}

          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? "opacity-10" : "opacity-0"
            }`}
          ></div>

          {/* Icons */}
          <div
            className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <button
              onClick={handleAddToWishlist}
              className="bg-white text-black p-4 rounded-full shadow-md cursor-pointer transition-all duration-300 hover:bg-[#FA8232] hover:text-white"
            >
              <FaHeart size={20} />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-white text-black p-4 rounded-full shadow-md cursor-pointer transition-all duration-300 hover:bg-[#FA8232] hover:text-white"
            >
              <FaShoppingCart size={20} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black p-4 rounded-full shadow-md cursor-pointer transition-all duration-300 hover:bg-[#FA8232] hover:text-white"
            >
              <FaEye size={20} />
            </button>
          </div>
        </div>

        {/* Modal */}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/10 backdrop-blur-[2px] px-2">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg relative w-full max-w-[1000px] h-[90vh] sm:h-[400px] overflow-auto">
              <button
                className="absolute top-1 right-2 text-gray-500 hover:text-black p-3 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <RxCross1 />
              </button>

              <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 w-full h-full">
                <div className="w-full sm:w-1/2 flex items-center justify-center rounded-md border-[2px] border-gray-300">
                  <Link
                    href={{
                      pathname: `/productdetail/${product.id}`,
                      query: { ...product },
                    }}
                  >
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="w-full h-48 sm:h-60 object-contain rounded"
                      />
                    )}
                  </Link>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col justify-center gap-y-3 sm:gap-y-4">
                  <h2 className="text-lg sm:text-xl font-bold">
                    {product.name}
                  </h2>
                  <p className="text-gray-700 text-base sm:text-lg">
                    Price: ₹{product.price}
                  </p>
                  <p className="text-gray-700 text-base sm:text-lg">
                    Category: Electronics
                  </p>
                  <p className="text-gray-700 text-base sm:text-lg flex items-center gap-1">
                    Reviews:{" "}
                    {averageRating !== null ? (
                      <>
                        <FaStar className="text-yellow-500" />
                        {averageRating} ({totalReviews})
                      </>
                    ) : (
                      "No reviews yet"
                    )}
                  </p>

                  {totalReviews > 0 && (
                    <Link
                      href={`/reviews/${encodeURIComponent(
                        product.name.trim()
                      )}`}
                      className="text-blue-600 hover:underline"
                    >
                      View all reviews...
                    </Link>
                  )}

                  <div className="flex flex-row sm:flex-row gap-4 mt-4 sm:mt-6 items-start sm:items-center">
                    <div className="flex items-center border border-gray-300 rounded-sm text-sm sm:text-base">
                      <button
                        onClick={handleDecrement}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 text-base sm:text-lg font-bold bg-gray-200 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-3 sm:px-4 text-base sm:text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 text-base sm:text-lg font-bold bg-gray-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="bg-[#FA8232] text-white px-4 sm:px-6 py-3 sm:py-3 rounded-sm cursor-pointer transition-all text-sm sm:text-base"
                    >
                      ADD TO CART
                    </button>

                    <Link href="/checkoutpage">
                      <BuynowBtn />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Details */}
        <p className="text-[#191C1F] font-normal mt-2 line-clamp-2">
          {product.name}
        </p>
        <p className="text-[#2DA5F3] font-semibold">₹{product.price}</p>
      </div>
    </>
  );
};

export default ProductCard;
