"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowRight } from "react-icons/go";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "../signup/page";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";


type SignUpFormData = {
  email: string;
  password: string;
};

const Signin = ({ onClose }: { onClose: () => void }) => {
  const [issignup, setIssignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
  

  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true); 

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !signInData.user) {
      toast.error("Login failed");
      setLoading(false);
      return;
    }

    const { data: userData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .single();

    if (profileError || !userData) {
      await supabase.auth.signOut();
      toast.error("Access denied: User not found");
      setLoading(false);
      return;
    }

    if (userData.role === "user") {
      toast.success("User login successful");
      onClose();
      router.push("/dashboard");
      router.refresh();
      setLoading(false); // Stop loading
    } else {
      toast.error("Access denied: Unknown role");
    }

    setLoading(false);
  };

  useEffect(() => {
    const addProductFromStorage = async () => {
      const redirect = localStorage.getItem("redirectToAddCart");
      const storedProduct = localStorage.getItem("pendingCartProduct");

      if (redirect && storedProduct) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const product = JSON.parse(storedProduct);

        const { error } = await supabase.from("cart").insert([
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image_url: product.image_url || "",
            user_id: user.id,
          },
        ]);

        if (!error) {
          toast.success("Product added to cart after login!");
        } else {
          toast.error("Something went wrong!");
        }

        localStorage.removeItem("redirectToAddCart");
        localStorage.removeItem("pendingCartProduct");
      }
    };

    addProductFromStorage();
  }, []);

  return (
    <div className="absolute top-12 right-0 w-100 bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg mt-5 font-semibold text-center">
        Sign in to your account
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-normal py-2">
            Email Address
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            className="w-full px-3 py-2 border rounded-sm focus:outline-none border-[#E4E7E9]"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {String(errors.email.message)}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-normal py-2">Password</label>
            <Link href="/auth/forgetpassword">
              <span className="cursor-pointer block text-sm font-normal py-2 text-[#2DA5F3]">
                Forget Password
              </span>
            </Link>
          </div>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full px-3 py-2 border rounded-sm focus:outline-none border-[#E4E7E9]"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {String(errors.password.message)}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="font-semibold w-full flex justify-center items-center cursor-pointer bg-[#FA8232] text-white py-2 rounded-sm hover:bg-blue-600 transition-all"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <p className="flex justify-center items-center">
              LOGIN <GoArrowRight className="ml-1 text-1xl" />
              </p>
          )}
        </button>
      </form>

      <div className="flex items-center justify-center my-4">
        <div className="flex-1 h-px bg-gray-400 rounded-md"></div>
        <span className="text-gray-600 px-2 whitespace-nowrap">
        Don&apos;t have an account?{" "}
        </span>
        <div className="flex-1 h-px bg-gray-400 rounded-md"></div>
      </div>

      <button
        type="button"
        onClick={() => setIssignup(true)}
        className="border border-[#FFE7D6] font-semibold w-full flex justify-center items-center cursor-pointer bg-white text-[#FA8232] py-2 rounded-sm"
      >
        CREATE ACCOUNT
      </button>

      {issignup && <Signup onClose={() => setIssignup(false)} />}
    </div>
  );
};

export default Signin;
