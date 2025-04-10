// user : demo@gmail.com 
// password : 123456


// admin : demoadmin@gmail.com 
// password : 123456

// admin : sahilrahaman585@gmail.com
// pass : sahil123




"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Login = dynamic(() => import("../auth/admin/adminlogin/page"), {
  ssr: false,
});



type Product = {
  id: number;
  name: string;
  // description: string;
  price: number;
  categories: string;
  image_url?: string;
};

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    // description: "",
    price: 0,
    categories: "",
    image_url: "",
  });
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const router = useRouter();

  // Popup after 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get token & user 
  useEffect(() => {
    const getSessionAndUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setIsLoggedIn(true);
        setAdminId(session.user.id);
      }
    };
    getSessionAndUser();
  }, []);

  useEffect(() => {
    if (isLoggedIn && adminId) {
      fetchProducts();
      fetchCategories();
    }
  }, [isLoggedIn, adminId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setShowLoginPopup(true);
    router.refresh();
  };

  const fetchProducts = async () => {
    if (!adminId) return;
    const { data, error } = await supabase
      .from("allproducts")
      .select("*")
      .eq("admin_id", adminId);

    if (!error && data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error && data) {
      setCategories(data);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCategory }])
      .select("*")
      .single();

    if (error) {
      alert("Failed to add category: " + error.message);
      return;
    }

    if (data) {
      setCategories((prev) => [...prev, data]);
      setNewCategory("");
    }
  };


  


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };


  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("allimages")
      .upload(fileName, file);

    if (error) return null;

    const { data } = supabase.storage.from("allimages").getPublicUrl(fileName);
    return data?.publicUrl ?? null;
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.price || !form.categories || !adminId) {
      alert("Please fill all fields and ensure you're logged in!");
      return;
    }

    let imageUrl = form.image_url;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", form.categories)
      .single();

    if (categoryError || !categoryData) {
      alert("Invalid category selected!");
      return;
    }

    const newProduct = {
      name: form.name,
      price: form.price,
      // description: form.description, 
      category_id: categoryData.id,
      image_url: imageUrl,
      admin_id: adminId,
    };

    const { error } = await supabase.from("allproducts").insert([newProduct]);

    if (error) {
      alert("Failed to save product: " + error.message);
      return;
    }

    resetForm();
    fetchProducts();
  };

  const resetForm = () => {
    setForm({
      name: "",
      // description: "",
      price: 0,
      categories: "",
      image_url: "",
    });
    setImagePreview(null);
    setImageFile(null);
    setEditId(null);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("allproducts").delete().eq("id", id);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      // description: product.description,
      price: product.price,
      image_url: product.image_url || "",
      categories: product.categories,
    });
    setImagePreview(product.image_url || null);
    setEditId(product.id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {showLoginPopup && !isLoggedIn && (
        <Login
          onSuccess={() => {
            setShowLoginPopup(false);
            setIsLoggedIn(true);
          }}
        />
      )}

      {isLoggedIn && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
            <div className="bg-white rounded-xl p-6 shadow space-y-4">
              <h2 className="text-xl font-semibold mb-2 text-center">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                value={form.price || ""}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-2 border rounded"
              />

              <select
                name="categories"
                value={form.categories}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Choose Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded-sm p-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              )}

              <button
                onClick={handleAddOrUpdate}
                className={`${
                  editId
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded`}
              >
                {editId ? "Update Product" : "Add Product"}
              </button>
              {editId && (
                <button
                  onClick={resetForm}
                  className="ml-2 text-sm underline text-gray-500 cursor-pointer"
                >
                  Cancel edit
                </button>
              )}
            </div>



            {/* <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-semibold">Manage Categories</h2>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category"
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={addCategory}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Add
                </button>
              </div>
            </div> */}

            

            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="my-10">
            <h3 className="text-3xl font-semibold mb-4 text-center">
              My Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded-xl shadow space-y-2"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}

                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-500">
                    {product.description}
                  </p>
                  <p className="font-bold text-green-600">₹{product.price}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-gray-500 col-span-full">
                  No products added yet.
                </p>
              )}
            </div>
          </div>

          
        </>
      )}
    </div>
  );
};

export default Dashboard;
