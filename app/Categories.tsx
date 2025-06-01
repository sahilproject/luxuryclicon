import React from "react";
import c1 from "../public/assets/Categoryimg/gucci.png";
import c2 from "../public/assets/Categoryimg/aramani.png";
import c3 from "../public/assets/Categoryimg/balmain-b.jpg";
import c4 from "../public/assets/Categoryimg/ck.jpg";
import c5 from "../public/assets/Categoryimg/tommy.png";
import c6 from "../public/assets/Categoryimg/burbery.png";
import Image from "next/image";
import Link from "next/link";


const Categories = () => {
  return (
    <>
     
        <div className="container mx-auto pt-2">
          <h3 className="text-center py-6 text-[32px] font-semibold text-[#191C1F]">
            Shop with Luxury Brands
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-12 gap-2 text-center text-[#191C1F] font-semibold px-2">
            <div className="md:col-span-2 p-3 grid border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c1} alt="c1" />
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c2} alt="c2" />
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c3} alt="c3" />
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c4} alt="c4" />
            </Link>
            </div>

            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c5} alt="c5" />
            </Link>
            </div>
            <div className="md:col-span-2 p-3 grid  border border-[#E4E7E9] rounded-md place-items-center cursor-pointer">
           <Link href="browseallproducts">
              <Image src={c6} alt="c6" />
            </Link>
            </div>
          </div>
        </div>
     
    </>
  );
};

export default Categories;
