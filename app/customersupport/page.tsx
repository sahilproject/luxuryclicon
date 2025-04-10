import React from 'react';
import { FaPhoneAlt, FaCommentDots, FaTruck, FaKey, FaCreditCard, FaUser, FaHeart, FaShippingFast, FaShoppingCart, FaStore } from 'react-icons/fa';
import support from "@/public/assets/support.jpeg";
import Image from 'next/image';
import { GoArrowRight } from 'react-icons/go';

export default function HelpCenterPage() {
  const helpOptions = [
    { label: 'Track Order', icon: <FaTruck className="text-orange-500 text-xl mb-2" /> },
    { label: 'Reset Password', icon: <FaKey className="text-orange-500 text-xl mb-2" /> },
    { label: 'Payment Option', icon: <FaCreditCard className="text-orange-500 text-xl mb-2" /> },
    { label: 'User & Account', icon: <FaUser className="text-orange-500 text-xl mb-2" /> },
    { label: 'Wishlist & Compare', icon: <FaHeart className="text-orange-500 text-xl mb-2" /> },
    { label: 'Shipping & Billing', icon: <FaShippingFast className="text-orange-500 text-xl mb-2" /> },
    { label: 'Shopping Cart & Wallet', icon: <FaShoppingCart className="text-orange-500 text-xl mb-2" /> },
    { label: 'Sell on Clicon', icon: <FaStore className="text-orange-500 text-xl mb-2" /> }
  ];

  return (
    <>
    <div className="container">
      <div className="font-sans text-gray-800">
        {/* Hero Section */}
        <div className="bg-white px-4 md:flex items-center justify-between max-w-7xl mx-auto">
          <div className="md:w-1/2 space-y-4">
            <span className="text-xs font-semibold bg-[#EFD33D] text-black px-3 py-2">HELP CENTER</span>
            <h1 className="text-3xl font-semibold">How we can help you!</h1>
            <div className="mt-4 flex items-center border border-[#E4E7E9] rounded-sm overflow-hidden max-w-md">
              <input
                type="text"
                placeholder="Enter your question or keyword"
                className="w-full p-5 focus:outline-none"
              />
              <button className="bg-[#FA8232] text-white px-4 py-3 mx-3 cursor-pointer">
                SEARCH
              </button>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2">
            <Image src={support} alt="Support agent" className="w-full max-w-sm mx-auto" />
          </div>
        </div>

        <hr className='text-gray-200 w-full' />

        {/* Assistance Categories */}
        <div className="bg-white py-10 px-4 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">What can we assist you with today?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {helpOptions.map((item, index) => (
              <div
                key={index}
                className="border border-[#FA8232] rounded-sm p-[24px] font-semibold cursor-pointer text-sm hover:shadow-md transition flex flex-col items-center"
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="bg-white py-10 px-4 max-w-7xl mx-auto">
          <h3 className="text-center text-2xl font-semibold mb-6">Popular Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 list-disc list-inside">
            <ul className='flex flex-col gap-y-3'>
              <li>How do I return my item?</li>
              <li className="text-orange-600">What is Clicons Returns Policy?</li>
              <li>How long is the refund process?</li>
            </ul>
            <ul className='flex flex-col gap-y-3'>
              <li>What are the 'Delivery Timelines'?</li>
              <li>What is 'Discover Your Daraz Campaign 2022'?</li>
              <li>What is the Voucher & Gift Offer in this Campaign?</li>
            </ul>
            <ul className='flex flex-col gap-y-3'>
              <li>How to cancel Clicon Order.</li>
              <li>Ask the Digital and Device Community</li>
              <li>How to change my shop name?</li>
            </ul>
          </div>
        </div>
        </div>
        </div>
        {/* Contact Section */}
        <div className="bg-gray-100 py-10 px-4">
          <div className="text-center mb-6">
            <button className="bg-[#2DA5F3] text-white text-xs px-4 py-2 uppercase mb-2">Contact Us</button>
            <h3 className="text-xl font-semibold">Don’t find your answer.<br />Contact with us</h3>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow-sm flex flex-col items-start">
              <FaPhoneAlt className="text-blue-500 text-2xl mb-2" />
              <h4 className="font-semibold">Call us now</h4>
              <p className="text-xs text-gray-500 mb-1">We are available online from 9:00 AM to 5:00 PM (GMT+5)</p>
              <p className="font-medium text-lg mb-3">+1-202-555-0126</p>
              <button className="text-sm px-4 py-3 bg-[#2DA5F3] text-white rounded flex items-center gap-x-2">CALL NOW <GoArrowRight/></button>
            </div>
            <div className="bg-white p-6 rounded shadow-sm flex flex-col items-start">
              <FaCommentDots className="text-green-500 text-2xl mb-2" />
              <h4 className="font-semibold">Chat with us</h4>
              <p className="text-xs text-gray-500 mb-1">We are available online from 9:00 AM to 5:00 PM (GMT+5)</p>
              <p className="font-medium text-lg mb-3">Support@clicon.com</p>
              <button className="text-sm px-4 py-3 bg-[#2DB224] text-white rounded">CONTACT US →</button>
            </div>
          </div>
        </div>
      
      </>
  );
}
