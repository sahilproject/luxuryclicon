"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";

interface Review {
  id: number;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product {
  name: string;
  image_url: string;
}

interface ReviewWithImage extends Review {
  image_url?: string;
}

export default function ReviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);

  const [reviews, setReviews] = useState<ReviewWithImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewsWithImages = async () => {
      const decodedName = decodeURIComponent(name);

      // Fetch reviews
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_name", decodedName);

      if (reviewError) {
        setError("Error loading reviews: " + reviewError.message);
        return;
      }

      // Fetch product info for the same product_name
      const { data: productData, error: productError } = await supabase
        .from("allproducts")
        .select("name, image_url")
        .eq("name", decodedName)
        .single(); // we expect one match

      const image_url = productData?.image_url;

      const reviewsWithImages = (reviewData || []).map((review) => ({
        ...review,
        image_url,
      }));

      setReviews(reviewsWithImages);
    };

    fetchReviewsWithImages();
  }, [name]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto border border-[#E4E7E9] rounded-sm shadow-md my-4">
      <h1 className="text-2xl font-bold mb-4 ">
        Reviews for "{decodeURIComponent(name)}"
      </h1>

      {reviews.length === 0 ? (
        <p className="text-gray-700">No reviews found for this product.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border-b pb-3 mb-3">
            <div className="flex justify-center items-center">
            {review.image_url && (

              <Image
                src={review.image_url}
                alt={`Review for ${review.product_name}`}
                width={200}
                height={200}
                unoptimized
                className="mb-2 rounded shadow"
              />
            )}
            </div>
            <p className="font-semibold text-yellow-600">
              Rating: {review.rating} ⭐
            </p>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
