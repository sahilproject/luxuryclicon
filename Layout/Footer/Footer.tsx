import React from "react";
import Image from "next/image";
import footerLogo from "../../public/icon-luxury.png";
import { GoArrowRight } from "react-icons/go";
import googleplay from "../../public/assets/mobile.svg";
import appstore from "../../public/assets/mobile1.svg";
import "@/app/style/Style.css";
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
            <p className="text-[#FFFFFF]">+91 9433854203</p>
            <p className="text-[#77878F]">
              Salt Lake , Kolkata , India
              <br /> 700002
            </p>
            <p className="text-[#FFFFFF]">luxuryclicon@gmail.com</p>
          </div>

          <div className="md:col-span-2 p-2 grid ">
            <h3 className="text-[#FFFFFF] text-[16px] font-normal">
              TOP CATEGORY
            </h3>
            <ul className="text-[#929FA5] pt-4 footerr-tag">
              <li className="py-1">Shirt</li>
              <li className="py-1">T-Shirt</li>
              <li className="py-1">Pants</li>
              <li className="py-1">Belt</li>
              <li className="py-1">Perfume</li>
              <li className="py-1">Headphones</li>
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
            <ul className="text-[#929FA5] pt-4 flex flex-col gap-3 sm:gap-5 footerr-tag">
              <li>
                <Link href="/returnpolicy">Return Policy</Link>
              </li>
              <li>
                <Link href="/privacypolicy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer">Disclaimer</Link>
              </li>
              <li>
                <Link href="/contactus">Contact us</Link>
              </li>
              <li>
                <Link href="/aboutus">About us</Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2 p-2 grid gap-4">
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
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Gucci
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Armani
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Boss
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Armani Exchange
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Calvin kelin
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Burberry
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Balmain
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Tommy Hilfier
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Smart TV
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Perfume
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                T-shirt
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Watch
              </li>
              <li className="px-3 py-1 border border-white/20 rounded-md">
                Belt
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full border border-white/10 mt-8"></div>
      <div className="flex justify-center items-center">
        <p className="flex gap-x-2  py-5 text-[#929FA5]">
          All rights reserved © {new Date().getFullYear()}.
          <span className="font-semibold text-white-700">
            Luxury clicon Pvt Ltd
          </span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
