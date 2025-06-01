"use client";

import Image from "next/image";
import React from "react";
import Heroimg from "../public/assets/HeroImg/brand-balmain-collection.webp";
import Heroimg1 from "../public/assets/HeroImg/guci.jpg";
import Heroimg2 from "../public/assets/HeroImg/ax-banner.jpg";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Hero = () => {
  return (
    <>
      <section className="hero-section pt-2">
        <div className="container mx-auto p-4">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            
            loop
            spaceBetween={20}
            className="rounded-xl overflow-hidden"
          >
            <SwiperSlide>
              <Link href="/browseallproducts">
                <Image
                  src={Heroimg}
                  alt="Hero Image 1"
                  className="w-full h-auto object-cover"
                />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href="/browseallproducts">
                <Image
                  src={Heroimg1}
                  alt="Hero Image 2"
                  className="w-full h- object-cover"
                />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link href="/browseallproducts">
                <Image
                  src={Heroimg2}
                  alt="Hero Image 3"
                  className="w-full h-auto object-cover"
                />
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Hero;
