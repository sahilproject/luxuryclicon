"use client";
import React, { useContext, useEffect, useState } from "react";
import { cartContext } from "../context/ProductContext";
import { GoArrowRight } from "react-icons/go";
import { GrAmazon } from "react-icons/gr";
import { FaPaypal } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";
import { IoLogoVenmo } from "react-icons/io5";
import { FaRegCreditCard } from "react-icons/fa";
import Image from "next/image";
import orderimg from "@/public/assets/CheckCircle.svg";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";


type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  user_id?: string;
  // add other fields from your "cart" table if needed
};


const CheckoutForm = () => {

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [dbCart, setDbCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =useState("Cash on Delivery");

  useEffect(() => {
    const fetchUserAndCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) {
        setLoading(false);
        return;
      }
  
      setUserId(user.id);
  
      const { data: cartData, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);
  
      if (error) {
        console.error("Failed to fetch cart:", error.message);
      } else {
        setDbCart(cartData || []);
      }
  
      setLoading(false);
    };
  
    fetchUserAndCart();
  }, []);
  

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    country: "",
    region: "",
    city: "",
    zip: "",
    email: "",
    phone: "",
    notes: "",
  });

  const context = useContext(cartContext);
  if (!context) return <div>Error: Cart context missing</div>;
  const { clearCart } = context;
  


  const cart = dbCart;
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );
  const discount = 24;
  const tax = 61.99;
  const total = subtotal - discount + tax;

  const paymentOptions = [
    { name: "Cash on Delivery", icon: <FaDollarSign /> },
    { name: "Venmo", icon: <IoLogoVenmo /> },
    { name: "Paypal", icon: <FaPaypal /> },
    { name: "Amazon Pay", icon: <GrAmazon /> },
    { name: "Debit/Credit Card", icon: <FaRegCreditCard /> },
  ];

  const generateOrderId = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${datePart}-${randomPart}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "email",
      "phone",
    ];
    const isValid = requiredFields.every(
      (field) => formData[field as keyof typeof formData].trim() !== ""
    );

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    const newOrderId = generateOrderId();

    const billingInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      const { error: orderError } = await supabase.from("orders").insert([
        {
          user_id: userId,
          order_id: newOrderId,
          details: cart,
          total_amount: total,
          status: "pending",
          payment_method: selectedPaymentMethod,
          billing_info: billingInfo,
        },
      ]);

      if (orderError) {
        console.error("Error placing order:", orderError.message);
        alert("Something went wrong while placing the order.");
        return;
      }

      // Clear cart from Supabase
      await supabase.from("cart").delete().eq("user_id", userId);

      setOrderId(newOrderId);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading checkout...
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
          <Image alt="order" src={orderimg} height={100} width={100} />
          <h2 className="text-xl font-semibold text-green-600">
            Your order is successfully placed
          </h2>
          <p className="text-sm text-gray-500">
            🧾 Order ID: <strong>{orderId}</strong>
          </p>
          <p className="text-gray-500 max-w-md">
            Thank you for your purchase! You can track your order in the
            dashboard.
          </p>
          <div className="flex space-x-4">
            <Link href="/">
              <button className="px-5 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50">
                GO TO HOME
              </button>
            </Link>
            <Link href="/myorders">
              <button className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                VIEW ORDER →
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      {/* Billing Info */}
      <div className="lg:col-span-2 space-y-6 border border-[#E4E7E9] p-6 rounded-sm">
        <h2 className="text-lg font-semibold">Billing Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            className="border p-2 border-[#E4E7E9] rounded"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
            className="border p-2 border-[#E4E7E9] rounded"
          />
        </div>

        <input
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Company Name (Optional)"
          className="border border-[#E4E7E9] p-2 rounded w-full"
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address"
          className="border p-2 rounded border-[#E4E7E9] w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="border p-2 rounded border-[#E4E7E9]"
          >
            <option>Country</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
          </select>
          <select
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            className="border p-2 rounded border-[#E4E7E9]"
          >
            <option>Region/State</option>
            <option value="CA">CA</option>
            <option value="West Bengal">West Bengal</option>
          </select>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="border p-2 rounded border-[#E4E7E9]"
          >
            <option>City</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Gujrat">Gujrat</option>
            <option value="Manali">Manali</option>
          </select>
          <input
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            placeholder="Zip Code"
            className="border p-2 rounded border-[#E4E7E9]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border p-2 rounded border-[#E4E7E9]"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="border p-2 rounded border-[#E4E7E9]"
          />
        </div>

        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" />
          <span>Ship into different address</span>
        </label>

        <div>
          <h3 className="font-semibold mb-2">Additional Information</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Notes about your order, e.g. special notes for delivery"
            className="border p-2 rounded w-full border-[#E4E7E9]"
          />
        </div>
      </div>

      {/* Order Summary & Payment */}

      <div className="space-y-6 border border-[#E4E7E9] p-6 rounded-sm h-fit">
        <h2 className="text-lg font-semibold">Your Order</h2>

        {/* Product Details */}
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.image_url ?? "/fallback.png"}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="flex justify-between text-sm text-gray-600 pt-2">
          <span>Subtotal:</span>
          <span>${subtotal > 0 ? subtotal.toFixed(2) : "0.00"}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Discount:</span>
          <span>${subtotal > 0 ? discount.toFixed(2) : "0.00"}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax:</span>
          <span>${subtotal > 0 ? tax.toFixed(2) : "0.00"}</span>
        </div>

        <div className="border-t pt-4 flex justify-between font-semibold">
          <span>Total:</span>
          <span>
            ${subtotal > 0 ? (subtotal - discount + tax).toFixed(2) : "0.00"}
          </span>
        </div>

        {/* Payment Method Selection */}
        <h3 className="text-sm font-medium mt-6">Select Payment Method:</h3>
        <div className="grid grid-cols-1 gap-2">
          {paymentOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => setSelectedPaymentMethod(option.name)}
              className={`flex items-center gap-2 px-4 py-2 border rounded ${
                selectedPaymentMethod === option.name
                  ? "border-orange-500 bg-orange-50"
                  : "border-[#E4E7E9]"
              }`}
            >
              {option.icon}
              {option.name}
            </button>
          ))}
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full mt-4 cursor-pointer bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-all"
        >
          Place Order <GoArrowRight className="inline ml-1" />
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
