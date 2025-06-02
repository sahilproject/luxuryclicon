import Image from "next/image";
import React from "react";
import b1 from "../../public/assets/armani-banner.jpg";
import b2 from "../../public/assets/balmain-heritage.jpg";

const Postar = () => {
  return (
    <div>
      <div className="container mx-auto pt-18">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-2">
          <div className="md:col-span-6 grid ">
            <Image src={b1} alt="c1" />
          </div>

          <div className="md:col-span-6  grid">
            <Image src={b2} alt="c2" className="sm:h-68 h-48"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postar;
