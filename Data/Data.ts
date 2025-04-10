import p1 from "../public/assets/productimg/p-1.svg";
import p2 from "../public/assets/productimg/p-2.svg";
import p3 from "../public/assets/productimg/p-3.svg";
import p4 from "../public/assets/productimg/p-4.svg";
import p5 from "../public/assets/productimg/p-5.svg";
import p6 from "../public/assets/productimg/p-6.svg";
import p7 from "../public/assets/productimg/p-7.svg";
import p8 from "../public/assets/productimg/p-8.svg";
import p9 from "../public/assets/productimg/f-1.svg";
import p10 from "../public/assets/productimg/f-2.svg";
import ap1 from "../public/assets/Arrivalimg/ap-1.svg"


// interface for products
interface products {
  id: number;
  image: string; 
  name: string;
  price: string;
}

export const products :products[] = [
    { id: 1, image: p1, name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...", price: "$2,300" },
    { id: 2, image: p2, name: "Simple Mobile 4G LTE Prepaid Smartphone", price: "$220" },
    { id: 3, image: p3, name: "4K UHD LED Smart TV with Chromecast Built-in", price: "$1,50" },
    { id: 4, image: p4, name: "Sony DSCHX8 High Zoom Point & Shoot Camera", price: "$1,200" },
    { id: 5, image: p5, name: "Dell Optiplex 7000x7480 All-in-One Computer Monitor", price: "$229" },
    { id: 6, image: p8, name: "Portable Wshing Machine, 11lbs capacity Model 18NMFIAM", price: "$70" },
    { id: 7, image: p7, name: "JBL FLIP 4 - Waterproof Portable Bluetooth Speaker - Black", price: "$250" },
    { id: 8, image: p6, name: "2-Barrel Carburetor Carb 2100 Engine Increase Horsepower", price: "$160" }
  ];
  
// interface for featuredProducts
  interface featuredProducts {
    id: number;
    image: string; 
    name: string;
    price: string;
  }
  
  export const featuredProducts:featuredProducts[] = [
    { id: 7, image: p9, name: "Portable Wshing Machine, 11lbs capacity Model 18NMFIAM", price: "$70" },
    { id: 1, image: p1, name: "Dell Optiplex 7000x7480 All-in-One Computer Monitor", price: "$229" },
    { id: 8, image: p10, name: "2-Barrel Carburetor Carb 2100 Engine Increase Horsepower", price: "$160" },
    { id: 2, image: p2, name: "Simple Mobile 4G LTE Prepaid Smartphone", price: "$220" },
    { id: 6, image: p6, name: "Sony DSCHX8 High Zoom Point & Shoot Camera", price: "$1,200" },
    { id: 3, image: p3, name: "4K UHD LED Smart TV with Chromecast Built-in", price: "$1,50" },
    { id: 4, image: p4, name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...", price: "$2,300" },
    { id: 5, image: p5, name: "JBL FLIP 4 - Waterproof Portable Bluetooth Speaker - Black", price: "$250" },
    ];
    


// FlashSaleCategory interface 
    interface Product {
      id: number;
      name: string;
      price: string;
      image: string; 
    }
    
    interface FlashSaleCategory {
      title: string;
      products: Product[];
    }

export const flashSaleData: FlashSaleCategory[] = [
   {
     title: "FLASH SALE TODAY",
     products: [
       {
         id: 1,
         name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear...",
         price: "$1,500",
         image: ap1,
       },
       {
         id: 2,
         name: "Sony WH-1000XM5 Noise Cancelling Headphones",
         price: "$2,300",
         image: p4,
       },
       {
         id: 3,
         name: "Apple AirPods Pro (2nd Gen) with MagSafe",
         price: "$1,999",
         image: p9,
       },
     ],
   },
   {
     title: "BEST SELLERS",
     products: [
       {
         id: 4,
         name: "Samsung Galaxy Buds2 Pro - Hi-Fi Sound",
         price: "$1,250",
         image: p10,
       },
       {
         id: 5,
         name: "JBL Live 660NC - Wireless Over-Ear Headphones",
         price: "$1,799",
         image: p7,
       },
       {
         id: 6,
         name: "Beats Studio Pro - Wireless Noise Cancelling",
         price: "$2,100",
         image: p2,
       },
     ],
   },
   {
     title: "NEW ARRIVALS",
     products: [
       {
         id: 7,
         name: "Anker Soundcore Life Q35 - Hi-Res Audio",
         price: "$999",
         image: p4,
       },
       {
         id: 8,
         name: "Sennheiser Momentum 4 Wireless",
         price: "$2,500",
         image: p5,
       },
       {
         id: 9,
         name: "Razer BlackShark V2 - Gaming Headset",
         price: "$1,450",
         image: p6,
       },
     ],
   },
   {
     title: "TOP RATED",
     products: [
       {
         id: 10,
         name: "Logitech G Pro X - Gaming Headset",
         price: "$1,350",
         image: p9,
       },
       {
         id: 11,
         name: "Sony WH-CH720N - Noise Cancelling Headphones",
         price: "$1,999",
         image: p1,
       },
       {
         id: 12,
         name: "Shure AONIC 50 - Wireless Noise Cancelling",
         price: "$2,300",
         image: p2,
       },
     ],
   },
 ];
 