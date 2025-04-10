import React from "react";
import c1 from "../public/assets/Categoryimg/c-1.svg";
import c2 from "../public/assets/Categoryimg/c-2.svg";
import c3 from "../public/assets/Categoryimg/c-3.svg";
import c4 from "../public/assets/Categoryimg/c-4.svg";
import c5 from "../public/assets/Categoryimg/c-5.svg";
import c6 from "../public/assets/Categoryimg/c-6.svg";
import Image from "next/image";
import Link from "next/link";


const Categories = () => {
  return (
    <>
     
        <div className="container mx-auto pt-2">
          <h3 className="text-center py-6 text-[32px] font-semibold text-[#191C1F]">
            Shop with Categorys
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-2 text-center text-[#191C1F] font-semibold">
            <div className="md:col-span-2 p-3 grid border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c1} alt="c1" />
              <p>Computer & Laptop</p>
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c2} alt="c2" />
              <p>SmartPhone</p>
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c3} alt="c3" />
              <p>Headphones</p>
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c4} alt="c4" />
              <p>Accessories</p>
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c5} alt="c5" />
              <p>Camera & Photo</p>
            </Link>
            </div>
            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c6} alt="c6" />
              <p>TV & Homes</p>
            </Link>
            </div>
          </div>
        </div>
     
    </>
  );
};

export default Categories;
