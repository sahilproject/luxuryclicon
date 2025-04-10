// "use client";
// import React, { useState } from "react";
// import { supabase } from "@/app/lib/supabaseClient";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleLogin = async () => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       alert("Login failed. Please check your credentials.");
//       return;
//     }

//     const userId = data?.user?.id;

//     if (!userId) {
//       alert("User ID not found.");
//       return;
//     }

//     const { data: profile, error: profileError } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", userId)
//       .single();

//     if (profileError || !profile) {
//       alert("Could not verify role.");
//       return;
//     }

//     if (profile.role !== "admin") {
//       alert("Access denied. Only admins can log in.");
//       return;
//     }

//     // If admin, redirect
//     router.push("/auth/admin/dashboard");
//   };

//   return (
//     <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
//         <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border mb-3 rounded"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border mb-4 rounded"
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition duration-200"
//         >
//           Login
//         </button>

//         <p className="text-center my-3">
//           New admin?{" "}
//           <Link href="/auth/admin/adsignup" className="text-blue-600 hover:underline">
//             Signup
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
