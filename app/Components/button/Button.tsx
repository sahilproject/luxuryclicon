import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { toast } from "react-toastify";

export const Button = () => {
  return (
    <button className="bg-white border p-1 border-amber-500 w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-[#FA8232]">
      READ MORE
      <GoArrowRight className="text-[20px] font-semibold" />
    </button>
  );
};

export const ButtonOrange = () => {
  return (
    <button className="bg-[#FA8232] border p-1 border-amber-500 w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-white">
     READ MORE
    <GoArrowRight className="text-[20px] font-semibold" />
    </button>
  )
}
export const BuynowBtn = () => {
  return (
    <button className="bg-white border p-2 border-amber-500 rounded-sm w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-[#FA8232]">
     BUY NOW
      <GoArrowRight className="text-[20px] font-semibold" />
    </button>
  )
}



export const AddtoCartBtn = () => {
  // const context = useContext(cartContext);
  
  // if (!context) {
  //   console.error("Error: ProductCard must be used within a CartProvider");
  //   return null;
  // }
  // const { addToCart  } = context;
  
  // for added to cart and show notification 
  const handleAddToCart = () => {
    // addToCart(product);
    toast.success("Added to cart!", {
      position: "top-right",
      autoClose: 2000, // Autoclose in 2 sec
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };
  return (
    <button onClick={handleAddToCart} className="bg-[#FA8232] border p-2 rounded-sm border-amber-500 w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-white">
     ADD TO CART
    <GoArrowRight className="text-[20px] font-semibold" />
    </button>
  )
}

export const ButtonBlack = () => {
    return (
      <Link href="/browseallproducts">
      <button className="bg-[#EBC80C] border rounded-sm p-2 pl-4 w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-black">
       SHOP NOW
      <GoArrowRight className="text-[20px] font-semibold text-black" />
      </button>
      </Link>
    )
  }
export const SuscribeBtn = () => {
    return (
      <button className="bg-[#FA8232] border p-3 rounded-sm border-amber-500 w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-white">
    SUBSCRIBE
    <GoArrowRight className="text-[20px] font-semibold" />
    </button>
    )
  }