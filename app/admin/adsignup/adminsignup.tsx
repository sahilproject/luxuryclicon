"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SignUpprops = {
  onClose: () => void;
};




const Signup = ({onClose}:SignUpprops) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Sign up admin
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role:"admin"
        },
      },
    });
    
    if (signUpError) {
      setError(signUpError.message);
      toast.error(signUpError.message);
      return;
    }

    const user = signUpData.user;

    if (!user) {
      setError("User signup failed.");
      toast.error("User signup failed.");
      return;
    }

    //Insert into admins table
    const { error: adminInsertError } = await supabase.from("admins").insert([
      {
        id: user.id,
        email:email,
        role: "admin",
      },
    ]);

    if (adminInsertError) {
      toast.success("Signup successful!");
      onClose()
      // console.error("Admin Insert Error:", adminInsertError.message);
      return;
    }
    
    toast.success("Signup successful!");
    setTimeout(() => router.push("/admin"), 1000);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl my-8">
      <h2 className="text-xl font-bold text-center my-5">Sign Up</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
        <p className="text-center my-3">
          Already have an account?{" "}
          <Link href="/admin/adminlogin" className="text-blue-500">
            Signin
          </Link>
        </p>
      </form>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Signup;
