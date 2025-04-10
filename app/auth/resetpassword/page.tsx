"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoArrowRight } from "react-icons/go";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);

    const { newPassword } = data;

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error("Failed to reset password");
      setLoading(false);
    } else {
      toast.success("Password reset successfully!", {
        position: "bottom-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1">Reset Your Password</h3>
          <p className="text-[#5F6C72]">
            Create a new password for your account. Make sure it’s strong and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-normal mb-1">New Password</label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-3 py-2 border rounded-sm focus:outline-none border-[#E4E7E9]"
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{String(errors.newPassword.message)}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-normal mb-1">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              className="w-full px-3 py-2 border rounded-sm focus:outline-none border-[#E4E7E9]"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`font-semibold w-full flex justify-center items-center text-white py-2 rounded-sm transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FA8232] hover:bg-blue-600"
            }`}
          >
            {loading ? "Resetting..." : "RESET PASSWORD"} <GoArrowRight className="ml-1 text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
