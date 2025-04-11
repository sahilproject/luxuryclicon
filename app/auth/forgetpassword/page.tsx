"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowRight } from "react-icons/go";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "../signup/page";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type ForgotPasswordFormData = {
  email: string;
};

const Forgetpassword = () => {
  const [issignup, setIssignup] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const { email } = data;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "/auth/verify-code",
    });

    if (error) {
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 3000,
      });
    } else {
      toast.success("Verification code sent to your email!", {
        position: "bottom-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push("/auth/verify-code");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1">Forget Password</h3>
          <p className="text-[#5F6C72]">
            Enter the email address associated with your Clicon account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-normal mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
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

          <button
            type="submit"
            className="font-semibold w-full flex justify-center items-center bg-[#FA8232] text-white py-2 rounded-sm hover:bg-blue-600 transition-all"
          >
            SEND CODE <GoArrowRight className="ml-1 text-xl" />
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 px-2 text-sm">
            Don&apos;t have an account?
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={() => setIssignup(true)}
          className="border border-[#FFE7D6] font-semibold w-full flex justify-center items-center bg-white text-[#FA8232] py-2 rounded-sm hover:bg-orange-100 transition-all"
        >
          CREATE ACCOUNT
        </button>

        <p className="my-4 text-sm text-center text-gray-500">
          You may contact Customer Service for help restoring access to your
          account.
        </p>

        {issignup && <Signup onClose={() => setIssignup(false)} />}
      </div>
    </div>
  );
};

export default Forgetpassword;
