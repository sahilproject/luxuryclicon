"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowRight } from "react-icons/go";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signin from "../signin/page";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation"; 


type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};




const Signup = ({ onClose }: { onClose: () => void }) => {


  const [issignin, setIssignin] = useState(false);
  const router = useRouter(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
  

  const onSubmit = async (data: SignUpFormData) => {
    const { name, email, password } = data;
  
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, 
          role: 'user', 
        },
      },
    });
  
    if (signUpError) {
      toast.error(signUpError.message);
      return;
    }
  
    const user = signUpData?.user;
    if (!user) {
      toast.error("User data not available.");
      return;
    }
  
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        name: name,
        role: "user",
        email: user.email,
      },
    ]);
  
    if (insertError) {
      toast.success("Sign up successful!");
      // console.error(insertError);
    router.push("/dashboard");
      return;
    }
  
    toast.success("Sign up successful!");
    router.push("/dashboard");
    onClose();
  };
  

  return (
    <div className="absolute z-50 top-4 right-0 w-100 bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg mt-1 font-semibold text-center">
        Sign up to your account
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/* Name input */}
        <div>
          <label className="block text-sm font-normal py-2">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full px-3 py-2 border rounded-sm focus:outline-none border-[#E4E7E9]"
            placeholder="Enter your Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">
              {String(errors.name.message)}
            </p>
          )}
        </div>

        {/* Email input */}
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

        {/* Password input */}
        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-normal py-2">Password</label>
            <label className="cursor-pointer block text-sm font-normal py-2 text-[#2DA5F3]">
              Forget Password
            </label>
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

        {/* Submit button */}
        <button
          type="submit"
          className="font-semibold w-full flex justify-center items-center cursor-pointer bg-[#FA8232] text-white py-2 rounded-sm hover:bg-blue-600 transition-all"
        >
          SIGNUP <GoArrowRight className="ml-1 text-1xl" />
        </button>
      </form>

      <div className="flex items-center justify-center my-4">
        <div className="flex-1 h-px bg-gray-400 rounded-md"></div>
        <span className="text-gray-600 px-2 whitespace-nowrap">
          Already have account?
        </span>
        <div className="flex-1 h-px bg-gray-400 rounded-md"></div>
      </div>

      <button
        type="button"
        onClick={() => {
          onClose();
          setIssignin(true);
        }}
        className="border border-[#FFE7D6] font-semibold w-full flex justify-center items-center cursor-pointer bg-white text-[#FA8232] py-2 rounded-sm"
      >
        Sign in
      </button>
      {issignin && <Signin onClose={() => setIssignin(false)} />}
    </div>
  );
};

export default Signup;
