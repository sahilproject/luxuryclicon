"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

type UserInfo = {
  name: string | null;
  email: string | null;
  role: string | null;
};

const UserProfile = () => {
  const [profile, setProfile] = useState<UserInfo>({
    name: null,
    email: null,
    role: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError?.message);
        return;
      }

      // fetch role from `profiles` table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile role:", profileError.message);
      }

      setProfile({
        name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "No name",
        email: user.email ?? null,
        role: profileData?.role ?? null, 
      });
    };

    fetchProfile();
  }, []);

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto my-10 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 rounded-lg">
      <h1 className="text-2xl font-semibold mb-2 text-center">👤 PROFILE</h1>
      <p className="py-2"><strong>Name:</strong> {profile.name}</p>
      <p className="py-2"><strong>Email:</strong> {profile.email}</p>
      <p className="py-2"><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default UserProfile;
