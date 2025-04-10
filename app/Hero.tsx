import Image from "next/image";
import React from "react";
import Heroimg from "../public/assets/HeroImg/Widget.svg";
import Heroimg1 from "../public/assets/HeroImg/Widget1.svg";
import Heroimg2 from "../public/assets/HeroImg/Widget2.svg";
import Link from "next/link";


const Hero = () => {
  return (
    <>
      <section className="hero-section mt-[30px]">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
            {/* <!-- col-8 (8/12 = 2/3) --> */}
            <div className="md:col-span-2 text-white border rounded-2xl cursor-pointer">
              <Link href="/browseallproducts">
              <Image src={Heroimg} alt="heroimg" />
              </Link>
            </div>
            {/* <!-- col-4 (4/12 = 1/3) --> */}
            <div className="md:col-span-1 text-white grid gap-y-3">
              <Link href="/browseallproducts">
              <Image src={Heroimg1} alt="heroimg" className="cursor-pointer"/>
              </Link>
              <Link href="/browseallproducts">
              <Image src={Heroimg2} alt="heroimg" className="cursor-pointer"/>
              </Link>
            </div>
          </div>
        </div> 
      </section>
    </>
  );
};

export default Hero;
