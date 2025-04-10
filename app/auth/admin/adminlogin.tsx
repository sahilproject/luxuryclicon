// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/app/lib/supabaseClient";



// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const getUserRole = async (userId: string) => {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", userId)
//       .single();

//     if (error) {
//       console.error("Error fetching role:", error.message);
//       return "user"; // Default to 'user' if error occurs
//     }
//     return data?.role || "user";
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) {
//       setError(error.message);
//       return;
//     }

//     if (data.user) {
//       const role = await getUserRole(data.user.id);
      
//       if (role === "admin") {
//         router.push("/dashboard"); 
//       } else {
//         router.push("/dashboard"); 
//       }
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
//       <h2 className="text-xl font-bold text-center">Login</h2>
//       {error && <p className="text-red-500 text-center">{error}</p>}
//       <form onSubmit={handleLogin} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
