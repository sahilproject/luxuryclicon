import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

type UserRole = "user" | "admin" | null;


export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && data?.role) {
        setRole(data.role);
      }
      
      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, role, loading };
};
