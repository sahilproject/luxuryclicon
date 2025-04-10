"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type OrderType = {
  order_id: string;
  user_id: string;
  status: string;
  created_at: string;
  details: OrderDetail[];
};

type OrderDetail = {
  image_url: string;
};

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    setError("");
    setOrderData(null);

    if (!orderId) {
      setError("Please enter your order ID.");
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error || !data) {
      setError("Order not found. Please check the Order ID.");
    } else {
      setOrderData(data);
    }
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Track Order</h2>
      <p className="mb-6 text-gray-600">
        To track your order, enter your order ID below and click “Track Order”.
      </p>

      <input
        type="text"
        placeholder="Enter Order ID"
        className="border rounded px-4 py-2 w-full max-w-md mb-2"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <button
        onClick={handleTrackOrder}
        className="bg-orange-500 ml-6 cursor-pointer text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        TRACK ORDER →
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {orderData && (
        <div className="mt-6 border rounded p-4 shadow-sm bg-gray-50 max-w-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
            Order Details
          </h3>

          <p>
            <strong>Order ID:</strong> {orderData.order_id}
          </p>
          <p>
            <strong>Status:</strong> {orderData.status}
          </p>
          <p>
            <strong>Placed On:</strong>{" "}
            {new Date(orderData.created_at).toLocaleString()}
          </p>

          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Product image</h4>
            <div className="space-y-4">
              {orderData.details?.map((item, index) => (
                <div
                  key={index}
                  className=" rounded  flex items-center gap-4 bg-white"
                >
                  <img
                    src={item.image_url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-50 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
