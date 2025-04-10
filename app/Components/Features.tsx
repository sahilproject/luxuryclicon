import React from "react";
import feature from "../../public/assets/feturesImg/Feature.svg";
import feature1 from "../../public/assets/feturesImg/Feature1.svg";
import feature2 from "../../public/assets/feturesImg/Feature2.svg";
import feature3 from "../../public/assets/feturesImg/Feature3.svg";
import Image from "next/image";



const Features = () => {
  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 border border-[#E4E7E9] rounded-md">
         
          <div className="md:col-span-3 p-3 grid gap-y-4 w-full lg:border-r  border-gray-200">
            <Image src={feature} alt="feature" />
          </div>

          <div className="md:col-span-3 p-3 grid gap-y-4 lg:border-r  border-gray-200">
            <Image src={feature1} alt="feature" />
          </div>

          <div className="md:col-span-3 p-3 grid gap-y-4 lg:border-r  border-gray-200">
            <Image src={feature2} alt="feature" />
          </div>

          <div className="md:col-span-3 p-3 grid gap-y-4 ">
            <Image src={feature3} alt="feature" />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Features;
