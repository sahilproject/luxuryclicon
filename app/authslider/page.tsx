"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

const tabs = ["signin", "signup"];

export default function AuthSlider() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "signin";

  const [activeTab, setActiveTab] = useState(tab);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const handleTabClick = (selectedTab: string) => {
    if (selectedTab === activeTab) return;
    router.push(`/authslider?tab=${selectedTab}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "signup") {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: name, 
          },
        },
      });

      if (signUpError) return toast.error(signUpError.message);

      const user = signUpData?.user;
      if (!user) return toast.error("User data not available.");

      const { error: insertError } = await supabase.from("profiles").insert([
        { id: user.id, role: "user", email: user.email, name: form.name },
      ]);

      if (insertError) return toast.success("Signup successful.");
      toast.success("Signup successful.");
      router.push("/auth/profile");

    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) return toast.error(error.message);
      
      toast.success("Signed in successfully!");
      router.push("/checkoutpage");

    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[380px] bg-white p-6 rounded-lg shadow-xl border border-[#E4E7E9] ">
        {/* Tab Switch Header */}
        <div className="flex border-b mb-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => handleTabClick(t)}
              className={`flex-1 py-2 text-center font-semibold transition-all duration-300 ${
                activeTab === t ? "border-b-2 border-orange-500 text-black" : "text-gray-400"
              }`}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Inner sliding container */}
        <div className="relative w-full h-[340px] overflow-hidden">
          <motion.div
            className="flex w-[200%] h-full"
            animate={{ x: activeTab === "signin" ? "0%" : "-50%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Sign In Form */}
            <div className="w-1/2 pr-2">
              <form
                onSubmit={handleSubmit}
                className={`space-y-4 ${activeTab !== "signin" && "pointer-events-none opacity-50"}`}
              >
                <div>
                  <label className="block text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded border-[#E4E7E9]"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded border-[#E4E7E9]"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="border-[#E4E7E9] cursor-pointer w-full flex items-center justify-center gap-2 border py-2 rounded mt-2"
                >
                  <FcGoogle className="text-xl " /> Continue with Google
                </button>
              </form>
            </div>

            {/* Sign Up Form */}
            <div className="w-1/2 pl-2">
              <form
                onSubmit={handleSubmit}
                className={`space-y-4 ${activeTab !== "signup" && "pointer-events-none opacity-50"}`}
              >
                <div>
                  <label className="block text-sm">Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded border-[#E4E7E9]"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded border-[#E4E7E9]"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded border-[#E4E7E9]"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center border-[#E4E7E9] cursor-pointer justify-center gap-2 border py-2 rounded mt-2"
                >
                  <FcGoogle className="text-xl" /> Continue with Google
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}