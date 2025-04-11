import { flashSaleData } from "@/Data/Data";
import Image from "next/image";
import React from "react";


// Arrival Component
const Arrival = () => {
  return (
    <div className="container mx-auto py-[72px]">
      <div className="grid grid-cols-2 lg:grid-cols-4 text-[#191C1F] items-center ">
        
        {flashSaleData.map((section, index) => (
          <div key={index} className="p-3 grid gap-y-4">
            <h3 className="font-semibold">{section.title}</h3>

            {/* Map Products */}
            {section.products.map((product) => (
              <div key={product.id} className="flex min-h-[100px] border border-[#E4E7E9] rounded p-2 items-center">
                <Image src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
                <div className="ml-3">
                  <p className="text-sm line-clamp-2">{product.name}</p>
                  <p className="pt-2 text-[#2DA5F3] font-semibold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Arrival;
