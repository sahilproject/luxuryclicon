"use client";
import React, { useContext } from "react";
import { cartContext } from "../context/ProductContext";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";

interface CartProps {
  onClose: () => void;
}


type WishListItem = {
  id: string;
  product_name: string;
  image_url: string;
  price: number;
  quantity: number;
};


const Wishpage: React.FC<CartProps> = ({ onClose }) => {
  const context = useContext(cartContext);

  if (!context) {
    console.error("Error: Cart must be used within a CartProvider");
    return <p className="text-red-500">Error: CartProvider is missing</p>;
  }

  const { wishList, removeFromWishlist } = context;

  const router = useRouter();

  const handleNavigation = () => {
    onClose();
    router.push("/wishlist"); 
  };

  return (
    <div className="absolute top-12 right-2 sm:right-12 w-100 bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-semibold">Your Wishlist</h3>

      {wishList.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <ul>
          {wishList.map((item: any) => (
            <li key={item.id} className="flex justify-between py-2 border-b">
              <Image width={100} alt="item" src={item.image_url} height={200} />
              <span className="ml-1">{item.name}</span>
              <span className="font-bold">{item.price}</span>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="mx-4 cursor-pointer"
              >
                <RxCross2 className="text-black" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-center">
        <button
          onClick={handleNavigation}
          className="bg-[#FA8232] border-none text-white flex items-center justify-center mt-5 border cursor-pointer rounded-sm border-gray-600 p-2"
        >
          VIEW WISHLIST
          <GoArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Wishpage;
