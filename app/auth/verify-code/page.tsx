
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { GoArrowRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyCode = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    toast.success("Code verified successfully!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });

    console.log("Verification Code:", data);

    // Simulate redirect to reset password
    setTimeout(() => {
      router.push("/auth/resetpassword"); // Make sure this page exists
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1">Verify Code</h3>
          <p className="text-[#5F6C72]">
            Please enter the 6-digit verification code we sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Code Input */}
          <div>
            <label className="block text-sm font-normal mb-1">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              {...register("code", {
                required: "Verification code is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter a valid 6-digit code",
                },
              })}
              className="w-full px-3 py-2 border rounded-sm focus:outline-none border-[#E4E7E9]"
              placeholder="Enter 6-digit code"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">
                {String(errors.code.message)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="font-semibold w-full flex justify-center items-center bg-[#FA8232] text-white py-2 rounded-sm hover:bg-blue-600 transition-all"
          >
            VERIFY CODE <GoArrowRight className="ml-1 text-xl" />
          </button>
        </form>

        {/* Info Message */}
        <p className="mt-4 text-sm text-center text-[#5F6C72]">
          Didn't receive the code?{" "}
          <span className="text-[#2DA5F3] cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyCode;
