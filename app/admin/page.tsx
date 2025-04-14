"use client";
import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { FaBars } from "react-icons/fa"; 

const Login = dynamic(() => import("./adminlogin/adminlogin"), {
  ssr: false,
});

type Product = {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  categories: string;
  image_url?: string;
};


type Profile = {
  id: string;
  name?: string;
  email?: string;
  address?: string;
  billing_address?: string;
  phone?: string;
  role: string;
};

type Category = {
  id: string;
  name: string;
};

interface Order {
  id: string;
  details: Product[];
  status: "Pending" | "In Progress" | "Completed" | "Rejected";
  payment_method:string;
  user_email:string;
}


const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); 

  
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    categories: "",
    image_url: "",
    quantity: 1,
  });
  
  const router = useRouter();

  // for show login popup //
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  
  // fetch admin profile and check user admin or not
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      const user = session?.user;
      if (!user) {
        return <Login />;

        // router.push("/admin/adminloginpage");
      }
  
      const userId = user.id;
  
      // Check if user is in the 'admins' table
      const { data: adminData } = await supabase
        .from("admins")
        .select("*")
        .eq("id", userId)
        .single();
  
      if (!adminData) {
        toast.error("Unauthorized");
        await supabase.auth.signOut();
        router.push("/admin/adminlogin");
        return;
      }
  
      // Set admin state if verified
      setIsLoggedIn(true);
      setAdminId(userId);
  
      const userMeta = user.user_metadata;
      setProfile({
        id: user.id, 
        name: userMeta.full_name || userMeta.display_name || "Admin",
        email: user.email,
        role: userMeta.role || "admin",
      });
    };
  
    init();
  }, [router]);
  

 
  // fetch orders //
  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*");
    if (data) setOrders(data);
  };

  // fetch categories //
  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  // fetch products //
  const fetchProducts = useCallback(async () => {
    if (!adminId) return;
    const { data, error } = await supabase
      .from("allproducts")
      .select("*")
      .eq("admin_id", adminId);
  
    if (!error && data) setProducts(data);
  }, [adminId]); 
  
  useEffect(() => {
    if (isLoggedIn && adminId) {
      fetchOrders();
      fetchCategories();
      fetchProducts();
    }
  }, [isLoggedIn, adminId, fetchOrders, fetchCategories, fetchProducts]); 
  

  //--------- category manage start----------//
  // add category //
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    await supabase.from("categories").insert([{ name: newCategory }]);
    setNewCategory("");
    fetchCategories();
    toast.success("Category added successfully");
  };

  // delete category //
  const deleteCategory = async (id: number) => {
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
    toast.success("Category deleted successfully");
  };

  const startEditCategory = (id: number, name: string) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
  };

  // edit category //
  const updateCategory = async () => {
    if (editCategoryId === null || !editCategoryName.trim()) return;
    await supabase
      .from("categories")
      .update({ name: editCategoryName })
      .eq("id", editCategoryId);
    setEditCategoryId(null);
    setEditCategoryName("");
    fetchCategories();
    toast.success("Category updated successfully");
  };



  const cancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName("");
  };

  //--------- category manage end----------//



  //--------- for order status start----------//
  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  
    if (error) {
      console.error("Error updating order status:", error.message);
      toast.error("Failed to update status");
      console.log(error)
      return;
    }
  
    fetchOrders();
    toast.success(`Order status updated to ${status}`);
  };
  //--------- for order status end----------//




  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("allimages")
      .upload(fileName, file);

    if (error) {
      console.error("Image upload error:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("allimages").getPublicUrl(fileName);
    return data?.publicUrl ?? null;
  };


  // upload product //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !selectedCategory) {
      toast.error("Please fill all required fields");
      return;
    }
    // Upload image if new one selected
    let imageUrl = form.image_url;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
        console.log("Uploaded Image URL:", uploadedUrl);
      } else {
        alert("Image upload failed!");

        return;
      }
    }

    const productData = {
      name: form.name,
      price: form.price,
      category_id: selectedCategory,
      admin_id: adminId,
      image_url: imageUrl,
    };

    try {
      if (editId) {
        // Update existing product
        const { error } = await supabase
          .from("allproducts")
          .update(productData)
          .eq("id", editId);

        if (!error) {
          // Handle image upload if needed
          fetchProducts();
          resetForm();
          toast.success("Product updated successfully");
        }
      } else {
        // Create new product
        const { data, error } = await supabase
          .from("allproducts")
          .insert([productData])
          .select()
          .single();

        if (!error && data) {
          // Handle image upload if needed
          fetchProducts();
          resetForm();
          toast.success("Product added successfully");
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Error saving product");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: 0,
      categories: "",
      image_url: "",
    });
    setImagePreview(null);
    setEditId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await supabase.from("allproducts").delete().eq("id", id);
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error)
      toast.error("Error deleting product");
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price,
      categories: product.categories,
      image_url: product.image_url || "",
    });
    setImagePreview(product.image_url || null);
    setEditId(product.id);
  };



  //--------- for logout ----------//
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setShowLoginPopup(true);
    toast.success("Logged out successfully");
  };


  return (
    <>
    <div className="flex flex-col md:flex-row min-h-screen container gap-4 p-2">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6 rounded-lg h-[340px]">
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <div className="space-y-3">
            <button
              className={`w-full text-left cursor-pointer ${
                activeTab === "dashboard" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`w-full text-left cursor-pointer ${
                activeTab === "orders" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
            <button
              className={`w-full text-left cursor-pointer ${
                activeTab === "category" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("category")}
            >
              Category Manage
            </button>
            <button
              className={`w-full text-left cursor-pointer ${
                activeTab === "product" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("product")}
            >
              Product Manage
            </button>
            <button
              className="w-full text-left cursor-pointer text-red-400"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 border-[#E4E7E9] border-[3px] rounded-lg mb-4">

        <Toaster position="top-right" />
        {!isLoggedIn && showLoginPopup && (
          <Login
            onSuccess={() => {
              setShowLoginPopup(false);
              setIsLoggedIn(true);
              toast.success("Logged in successfully");
            }}
          />
        )}

        {isLoggedIn && (
          <div>
            {activeTab === "dashboard" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Welcome to the Dashboard
                </h2>
                {profile && (
                  <div className="space-y-2 bg-white shadow-md p-4 rounded-xl">
                    <p>
                      <strong>Name:</strong> {profile.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {profile.role}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* orders  */}
            {activeTab === "orders" && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Orders</h3>
                <div className="space-y-4">
                  {orders.map((order: Order) => (
                    <div
                      key={order.id}
                      className="bg-white p-4 rounded-xl shadow-md border-[1px] border-[#E4E7E9]"
                    >
                      <div className="flex flex-col space-y-2">
                        <p>
                          <strong>Order ID:</strong> {order.id}
                        </p>

                        {order.details?.map((product: Product, index: number) => (
                          <div key={index} >

                            <p>
                              <strong>Product:</strong> {product.name}
                              <Image
                              className="py-3"
                              src={product.image_url || "/placeholder.jpg"} 
                              alt="image"
                                height={200}
                                width={200}
                              />
                            </p>

                            <p>
                              <strong>Quantity:</strong> {product.quantity}
                            </p>
                            <p>
                              <strong>Price:</strong> ₹{product.price}
                            </p>
                          </div>
                        ))}

                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={`font-semibold ${
                              order.status === "Pending"
                                ? "text-yellow-500"
                                : order.status === "In Progress"
                                ? "text-blue-500"
                                : order.status === "Completed"
                                ? "text-green-500"
                                : order.status === "Rejected"
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>

                        <p>
                          <strong>User Email:</strong> {order.user_email}
                        </p>
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {order.payment_method}
                        </p>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "In Progress")
                          }
                          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Completed")
                          }
                          className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Rejected")
                          }
                          className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <p className="text-center text-gray-400">
                      No orders placed yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* manage category  */}
            {activeTab === "category" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Manage Categories
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="border px-3 py-1 rounded w-full"
                  />
                  <button
                    onClick={addCategory}
                    className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex justify-between items-center bg-white p-3 rounded shadow"
                    >
                      {editCategoryId === Number(cat.id )? (
                        <div className="flex w-full gap-2">
                          <input
                            value={editCategoryName}
                            onChange={(e) =>
                              setEditCategoryName(e.target.value)
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                          <button
                            onClick={updateCategory}
                            className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-300 text-black px-2 py-1 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>{cat.name}</span>
                          <div className="space-x-2">
                            <button
                              onClick={() =>
                                startEditCategory(Number(cat.id), cat.name)
                              }
                              className="text-blue-500 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCategory(Number(cat.id))}
                              className="text-red-500 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-gray-400">No categories yet.</p>
                  )}
                </ul>

              </div>
            )}

            {/* manage product  */}
            {activeTab === "product" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Product Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Product Form */}
                  <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <h3 className="text-xl font-semibold">
                      {editId ? "Edit Product" : "Add Product"}
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        className="w-full border px-4 py-2 rounded mb-3"
                        required
                      />
                      <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="w-full border px-4 py-2 rounded mb-3"
                        required
                      />
                      <select
                        name="categories"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border px-4 py-2 rounded mb-3"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <input
                        name="image"
                        type="file"
                        onChange={handleImageChange}
                        className="w-full mb-3"
                      />
                      {imagePreview && (
                        <div className="mb-3">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded"
                        >
                          {editId ? "Update" : "Submit"}
                        </button>
                        {editId && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right: Product List */}
                  <div className="bg-white p-6 rounded-xl shadow space-y-4 ">
                    <h3 className="text-xl font-semibold text-center">All Products</h3>
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="border-[2px] p-2 rounded-lg border-[#E4E7E9] "
                          >
                            {product.image_url && (
                              <div className="mb-2">
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  width={150}
                                  height={150}
                                  className="w-full h-40 object-cover rounded"
                                />
                              </div>
                            )}
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-green-600 font-bold">
                              ${product.price}
                            </p>
                            
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-500 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-500 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center">
                        No products added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}


          </div>
        )}
      </main>
    </div>
    
  </>
    
  );
};

export default Dashboard;
