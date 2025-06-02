import Image from "next/image";
import React from "react";
import news1 from "../../public/6-Reasons-Your-Ecommerce-Site-Needs-a-Blog-Booster-Shot-400x210.webp";
import news2 from "../../public/2.png";
import news3 from "../../public/6433563_fb5b.jpg";
import user from "../../public/assets/newsimg/UserCircle.svg";
import calender from "../../public/assets/newsimg/CalendarBlank.svg";
import comment from "../../public/assets/newsimg/ChatCircleDots.svg";
import {Button} from "./button/Button";
import { GoArrowRight } from "react-icons/go";



const News = () => {
  return (
    <div className="bg-[#F2F4F5] py-[34px] sm:py-[72px]">
      <div className="container mx-auto  ">
        <h3 className="text-center text-[32px] font-semibold text-[#191C1F]">
          Latest News
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-12  gap-x-9 pt-10  text-[#191C1F] font-semibold ">
          <div className="md:col-span-4 p-8 grid border gap-y-4  border-[#E4E7E9] rounded-md bg-[#FFFFFF]">
            <Image src={news1} alt="news1" />
           <div className="flex gap-x-3.5 text-[#475156] font-normal">
              <div className="flex gap-x-1 ">
                <Image src={user} alt="news1" />
                <p>Manisha</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={calender} alt="news1" />
                <p>19April,2025</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={comment} alt="news1" />
                <p>45</p>
              </div>
              </div>
            <p className="text-[#191C1F] ">
              The Rise of E-Commerce
            </p>
            <p className="font-normal text-[#77878F]">
              E-commerce is rapidly transforming global retail, offering consumers convenience and businesses expanded reach. With advancing technology and mobile access.
            </p>
            <button className="bg-white border p-3 border-amber-500 w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-[#FA8232]">
                  READ MORE
              <GoArrowRight className="text-[20px] font-semibold" />
            </button>
          </div>

          <div className="md:col-span-4 p-8 grid border border-[#E4E7E9] rounded-md bg-[#FFFFFF]">
            <Image src={news2} alt="news2" />
            <div className="flex gap-x-3.5 text-[#475156] font-normal items-center">
              <div className="flex gap-x-1 ">
                <Image src={user} alt="news1" />
                <p>Sayon</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={calender} alt="news1" />
                <p>28 April, 2025</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={comment} alt="news1" />
                <p>8</p>
              </div>
              </div>
            <p className="text-[#191C1F]">
              CBuy Now Digitally with Your Card.{" "}
            </p>
            <p className="font-normal text-[#77878F]">
              Mauris scelerisque odio id rutrum volutpat. Pellentesque urna
              odio, vulputate at tortor vitae, hendrerit blandit lorem.{" "}
            </p>
            <Button/>
          </div>
          <div className="md:col-span-4 p-8 grid border border-[#E4E7E9] rounded-md bg-[#FFFFFF]">
            <Image src={news3} alt="news3" />
            <div className="flex gap-x-3.5 text-[#475156] font-normal items-center">
              <div className="flex gap-x-1 ">
                <Image src={user} alt="news1" />
                <p>Jannyan</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={calender} alt="news1" />
                <p>9 May, 2025</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={comment} alt="news1" />
                <p>26</p>
              </div>
              </div>
            <p className="text-[#191C1F] ">
              No Time? Order Now for Fast Delivery.
            </p>
            <p className="font-normal text-[#77878F]">
              Skip the wait—shop in seconds and get your order delivered at lightning speed, right to your doorstep.
            </p>
            <Button/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
