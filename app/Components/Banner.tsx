import Image from "next/image";
import React from "react";
import macimg from "../../public/assets/g-2.jpg"

const Banner = () => {
  return (
    <div className="container  pt-15 cursor-pointer">
       <Image src={macimg} alt="macimg"/>
    </div>
  );
};

export default Banner;
