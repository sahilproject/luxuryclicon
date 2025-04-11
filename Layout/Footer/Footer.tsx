import React from "react";
import Image from "next/image";
import footerLogo from "../../public/assets/Logo-1.svg";
import { GoArrowRight } from "react-icons/go";
import googleplay from "../../public/assets/mobile.svg";
import appstore from "../../public/assets/mobile1.svg";
import '@/app/style/Style.css'
import Link from "next/link";



const Footer = () => {
  return (
    <div className="bg-[#191C1F] pt-[62px]">

      <div className="container mx-auto pt-2">
        <div className="grid grid-cols-1 md:grid-cols-12  text-[#191C1F] font-semibold">
          <div className="md:col-span-3 p-4 grid cursor-pointer">
            <div>
              <Image src={footerLogo} alt="c1" />
            </div>
            <p className="text-[#77878F] pt-3">Customer Supports:</p>
            <p className="text-[#FFFFFF]">(629) 555-0129</p>
            <p className="text-[#77878F]">
              Salt Lake , Kolkata , India
              <br /> 700002
            </p>
            <p className="text-[#FFFFFF]">sahilrahaman585@gmail.com</p>
          </div>

          <div className="md:col-span-2 p-2 grid ">
            <h3 className="text-[#FFFFFF] text-[16px] font-normal">
              TOP CATEGORY
            </h3>
            <ul className="text-[#929FA5] pt-4 footerr-tag">
              <li className="py-1">Computer & Laptop</li>
              <li className="py-1">SmartPhone</li>
              <li className="py-1">Headphone</li>
              <li className="py-1 text-white">Accessories</li>
              <li className="py-1">Camera & Photo</li>
              <li className="py-1">TV & Homes</li>
              <Link href="browseallproducts">
              <li className="flex items-center text-[#EBC80C]">
                Browse All Product{" "}
                <GoArrowRight className="text-[20px] font-semibold" />
              </li>
              </Link>
            </ul>
          </div>
          <div className="md:col-span-2 p-2 grid ">
            <h3 className="text-[#FFFFFF] text-[16px] font-normal">
              QUICK LINKS
            </h3>
            <ul className="text-[#929FA5] pt-4 footerr-tag">
              <li className="py-1">Shop Product</li>
              <li className="py-1">Shoping Cart</li>
              <li className="py-1">Wishlist</li>
              <li className="py-1">Compare</li>
              <li className="py-1">Track Order</li>
              <li className="py-1">Customer Help</li>
              <li className="py-1">About Us</li>
            </ul>
          </div>
          <div className="md:col-span-2 p-2 grid ">
            <h3 className="text-[#FFFFFF] text-[16px] font-normal">
              DOWNLOAD APP
            </h3>
            <Image src={googleplay} alt="google" />
            <Image src={appstore} alt="appstore" />
          </div>
          <div className="md:col-span-3 p-2 grid ">
            <h3 className="text-[#FFFFFF] text-[16px] font-normal">
              POPULAR TAG
            </h3>
            <ul className="text-white font-normal flex flex-wrap gap-2 items-center populer-tags">
              <li className="px-3 py-1 border border-white/20 rounded-md">Game</li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                iPhone
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">TV</li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Asus Laptops
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Macbook
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">SSD</li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Graphics Card
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Power Bank
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Smart TV
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Speaker
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Tablet
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Microwave
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Samsung
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full border border-white/10 mt-8"></div>
      <div className="flex justify-center items-center">
      <p className="flex gap-x-2  py-5 text-[#929FA5]">
  All rights reserved © {new Date().getFullYear()}. Designed and Developed by <span className="font-semibold text-white-700">Sahil Rahaman </span>
</p>
</div>
    </div>
  );
};

export default Footer;
