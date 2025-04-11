"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Order = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  details: {
    name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }[];
};

type ReviewFormProps = {
  productName: string;
  orderId: string;
};

function ReviewForm({ productName, orderId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleReviewSubmit = async () => {
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to submit a review.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        user_id: user.id,
        order_id: orderId,
        product_name: productName,
        rating,
        comment,
      },
    ]);

    if (error) {
      alert("Failed to submit review.");
      console.error(error);
    } else {
      setSubmitted(true);
    }

    setSubmitting(false);
  };

  if (submitted) {
    return <p className="text-green-600 text-sm">✅ Review submitted!</p>;
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-sm text-blue-600 hover:underline mt-2 w-fit cursor-pointer"
      >
        Write a Review
      </button>
    );
  }

  return (
    <div className="mt-2 border-t pt-2 space-y-2 border-[#E4E7E9]">
      <h4 className="font-semibold text-sm">Leave a Review</h4>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <label className="text-sm">Rating:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-1 rounded w-16"
            placeholder="Rating"
          />
        </div>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Write your review..."
        />
        <div className="flex gap-2">
          <button
            onClick={handleReviewSubmit}
            disabled={submitting}
            className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch orders:", error.message);
    } else {
      setOrders(data as Order[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    const confirmCancel = confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    const { error } = await supabase.from("orders").delete().eq("id", orderId);

    if (error) {
      alert("Failed to cancel order.");
      console.error(error);
    } else {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      alert("Order canceled successfully.");
    }
  };

  if (loading) return <p className="text-center">Loading your orders...</p>;

  if (orders.length === 0)
    return <p className="text-center">You have no orders yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-2xl shadow-md p-4 bg-white space-y-4 border-[#E4E7E9]"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
                {order.status}
              </span>
            </div>

            {/* Cancel Order Button for Pending Orders */}
            {order.status === "pending" && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className="text-red-600 text-sm underline cursor-pointer hover:text-red-800"
                >
                  Cancel Order
                </button>
              </div>
            )}

            <div className="space-y-4">
              {order.details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} | Price: ₹{item.price}
                      </p>
                    </div>
                  </div>

                  {/* Review Form */}
                  <ReviewForm productName={item.name} orderId={order.id} />
                </div>
              ))}
            </div>

            <p className="text-right text-sm text-gray-400">
              Ordered on: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
