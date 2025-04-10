import Image from "next/image";
import React from "react";
import news1 from "../../public/assets/newsimg/news-1.svg";
import news2 from "../../public/assets/newsimg/news-2.svg";
import news3 from "../../public/assets/newsimg/news-3.svg";
import user from "../../public/assets/newsimg/UserCircle.svg";
import calender from "../../public/assets/newsimg/CalendarBlank.svg";
import comment from "../../public/assets/newsimg/ChatCircleDots.svg";
import {Button} from "./button/Button";
import { GoArrowRight } from "react-icons/go";



const News = () => {
  return (
    <div className="bg-[#F2F4F5] py-[72px]">
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
                <p>Kristin</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={calender} alt="news1" />
                <p>19Dec,2013</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={comment} alt="news1" />
                <p>453</p>
              </div>
              </div>
            <p className="text-[#191C1F] ">
              Cras nisl dolor, accumsan et metus sit amet, vulputate condimentum
              dolor.
            </p>
            <p className="font-normal text-[#77878F]">
              Maecenas scelerisque, arcu quis tempus egestas, ligula diam
              molestie lectus, tincidunt malesuada arcu metus posuere metus.
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
                <p>Robert</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={calender} alt="news1" />
                <p>28 Nov, 2015</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={comment} alt="news1" />
                <p>738</p>
              </div>
              </div>
            <p className="text-[#191C1F]">
              Curabitur pulvinar aliquam lectus, non blandit erat mattis vitae.{" "}
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
                <p>Arlene</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={calender} alt="news1" />
                <p>9 May, 2014</p>
              </div>
              <div className="flex gap-x-1">
                <Image src={comment} alt="news1" />
                <p>826</p>
              </div>
              </div>
            <p className="text-[#191C1F] ">
              Curabitur massa orci, consectetur et blandit ac, auctor et tellus.
            </p>
            <p className="font-normal text-[#77878F]">
              Pellentesque vestibulum lorem vel gravida aliquam. Morbi porta,
              odio id suscipit mattis, risus augue condimentum purus.
            </p>
            <Button/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
