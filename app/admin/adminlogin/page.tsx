"use client";
import React, { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";



type LoginProps = {
  onSuccess: () => void;
};

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

 
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      toast.error("Login failed");
      return;
    }
  
    //Check if user is in admins table
    const { data: adminData } = await supabase
      .from("admins")
      .select("*")
      .eq("id", data.user.id)
      .single();
  
    if (adminData) {
      toast.success("Admin login successful");
      router.push("/admin");
    } else {
      // await supabase.auth.signOut();
      toast.error("Access denied: Not an admin");
    }
  };

  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md border-[2px] border-[#E4E7E9] w-full max-w-sm pb-7">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full cursor-pointer bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition duration-200"
        >
          Login
        </button>

        {/* <p className="text-center my-3">
          New admin?{" "}
          <Link href="/admin/adsignup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
