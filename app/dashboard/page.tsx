"use client";
import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type UserInfo = {
  name: string | null;
  email: string | null;
  address?: string | null;
  billing_address?: string | null;
  phone?: string | null;
};

type OrderType = {
  order_id: string;
  user_id: string;
  status: string;
  created_at: string;
  total: number;
  total_amount: number;
  billing_info?: string | null;
  payment_method?: string | null;
  details: {
    image_url: string;
  }[];
};

const UserDashboard = () => {
  const [profile, setProfile] = useState<UserInfo>({
    name: null,
    email: null,
  });
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const routes: { label: string; path: string }[] = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Track Order", path: "/trackorder" },
    { label: "My Orders", path: "/myorders" },
    { label: "Order History", path: "/dashboard" },
    { label: "Shopping Cart", path: "/cart/cartpage" },
    { label: "Wishlist", path: "/wishlist" },
  ];

  const billingInfo = orders[0]?.billing_info
    ? JSON.parse(orders[0].billing_info)
    : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // Only allow 'user' role
      if (user.user_metadata?.role !== "user") {
        toast.error("Access denied: Not a user");
        await supabase.auth.signOut();
        router.push("/");
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        toast.error("Profile not found");
        await supabase.auth.signOut();
        router.push("/");
        return;
      }

      // Fetch recent orders
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      // Set profile info
      setProfile({
        name:
          user.user_metadata?.name ??
          user.user_metadata?.full_name ??
          "No name",
        email: user.email ?? null,
        address: profileData?.address ?? "Not Set",
        billing_address: profileData?.billing_address ?? "Not Set",
        phone: profileData?.phone ?? "N/A",
      });

      setOrders(orderData || []);
      setLoading(false);
    };

    fetchData();
  }, [router, setProfile, setOrders, setLoading]);




  if (loading) return <div className="p-6 container items-center flex">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-4">
        <nav className="bg-white p-4 rounded-xl shadow space-y-2">
          {routes.map(({ label, path }) => (
            <div
              key={label}
              onClick={() => router.push(path)}
              className={`p-2 text-sm rounded hover:bg-orange-100 cursor-pointer text-gray-700`}
            >
              {label}
            </div>
          ))}
        </nav>
      </aside>

      <main className="lg:col-span-4 space-y-6">
        <>
          <h2 className="text-2xl font-bold">
            Hello, {profile?.name || "User"}
          </h2>
          <p className="text-sm text-gray-500">
            From your account dashboard, you can easily check & view your{" "}
            <span className="text-orange-500 cursor-pointer">
              Recent Orders
            </span>
            , manage your{" "}
            <span className="text-orange-500 cursor-pointer">
              Shipping and Billing Addresses
            </span>{" "}
            and edit your{" "}
            <span className="text-orange-500 cursor-pointer">Password</span> and{" "}
            <span className="text-orange-500 cursor-pointer">
              Account Details
            </span>
            .
          </p>

          {/* Account Info & Billing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-sm shadow p-4 space-y-2 border border-[#E4E7E9]">
              <h3 className="font-semibold border-b border-[#E4E7E9] pb-2">
                ACCOUNT INFO
              </h3>
              <div className="flex flex-col justify-between min-h-57">
                <div>
                  <p>{profile?.name}</p>
                  <p>Email: {profile?.email}</p>
                </div>
                <button className="mt-2 w-full border rounded-sm cursor-pointer border-[#E4E7E9] px-4 py-2 text-sm hover:bg-gray-50">
                  EDIT ACCOUNT
                </button>
              </div>
            </div>
            <div className="bg-white rounded-sm shadow p-4 space-y-2 border border-[#E4E7E9]">
              <h3 className="font-semibold border-b border-[#E4E7E9] pb-2">
                BILLING ADDRESS
              </h3>
              <p>
                Name: {billingInfo?.firstName} {billingInfo?.lastName}
              </p>
              <p>Email: {billingInfo?.email ? billingInfo.email : "Not Set"}</p>
              <p>Phone: {billingInfo?.phone || profile?.phone}</p>
              <p>Address: {billingInfo?.address || profile?.billing_address}</p>
              <p>Payment: {orders[0]?.payment_method ?? "N/A"}</p>{" "}
              <button className="border-[#E4E7E9] mt-2 w-full border rounded-sm cursor-pointer px-4 py-2 text-sm hover:bg-gray-50">
                EDIT ADDRESS
              </button>
            </div>
            <div className="flex flex-col justify-between gap-y-4">
              <div className="bg-blue-50 rounded-xl shadow p-4">
                <p className="text-3xl font-semibold">{orders.length}</p>
                <p className="text-sm">Total Orders</p>
              </div>

              
              <div className="bg-orange-50 rounded-xl shadow p-4">
                <p className="text-3xl font-semibold">
                  {orders.filter((o) => o.status === "In Progress").length}
                </p>
                <p className="text-sm">Pending Orders</p>
              </div>


              <div className="bg-green-50 rounded-xl shadow p-4">
                <p className="text-3xl font-semibold">
                  {orders.filter((o) => o.status === "Completed").length}
                </p>
                <p className="text-sm">Completed Orders</p>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <h3 className="text-lg font-semibold mb-2">PAYMENT OPTION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-600 text-white rounded-xl shadow p-4">
                <p className="text-sm">$95,400.00 USD</p>
                <p className="mt-4">**** **** **** 3814</p>
                <p className="mt-2">{profile?.name}</p>
              </div>
              <div className="bg-green-600 text-white rounded-xl shadow p-4">
                <p className="text-sm">$87,583.00 USD</p>
                <p className="mt-4">**** **** **** 1761</p>
                <p className="mt-2">{profile?.name}</p>
              </div>
            </div>
            <button className="mt-2 text-orange-500 flex items-center gap-1 text-sm">
              Add Card <GoArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Orders */}
          <div>
            <h3 className="text-lg font-semibold mb-2">RECENT ORDER</h3>
            <div className="overflow-auto rounded-sm border">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">ORDER ID</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">DATE</th>
                    <th className="p-3">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id} className="border-t">
                      <td className="p-3 font-medium">{order.order_id}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "IN PROGRESS"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="p-3">
                        ${order.total ?? order.total_amount ?? "0.00"}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-2 text-orange-500 flex items-center gap-1 text-sm">
              View All <GoArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      </main>
    </div>
  );
};

export default UserDashboard;
