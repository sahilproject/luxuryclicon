import React from "react";
import b1 from "../../public/assets/brand/brand-1.svg";
import b2 from "../../public/assets/brand/brand-2.svg";
import b3 from "../../public/assets/brand/brand-3.svg";
import b4 from "../../public/assets/brand/brand-4.svg";
import b5 from "../../public/assets/brand/brand-5.svg";
import Image from "next/image";
import { SuscribeBtn } from "./button/Button";



const Suscribe = () => {
  return (
    <div className="bg-[#1B6392]">
      <div className="bg-[#1E6A9E] text-white py-16 px-6 flex flex-col items-center">
        {/* Heading */}
        <h2 className="text-[32px] md:text-3xl font-semibold mb-4">
          Subscribe to our newsletter
        </h2>
        <p className="text-center text-gray-200 max-w-md">
         Stay updated with the latest trends, exclusive offers, and new arrivals.
Join our community and never miss out on style updates again.
Sign up today for insider perks delivered straight to your inbox!
        </p>

        {/* Subscription Form */}
        <div className="mt-6 flex items-center w-full max-w-lg p-3 py-2 bg-white overflow-hidden border rounded-sm shadow-sm">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 px-4 py-3 text-[#77878F] outline-none"
          />
          <SuscribeBtn />
        </div>

        <div className="w-full max-w-lg border-t border-gray-400 my-6"></div>

        {/* Logos */}
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <Image src={b1} alt="Google" className="opacity-60" />
          <Image src={b2} alt="Amazon" className="opacity-60" />
          <Image src={b3} alt="Philips" className="opacity-60" />
          <Image src={b4} alt="Toshiba" className="opacity-60" />
          <Image src={b5} alt="Samsung" className="opacity-60" />
        </div>
      </div>
    </div>
  );
};

export default Suscribe;
