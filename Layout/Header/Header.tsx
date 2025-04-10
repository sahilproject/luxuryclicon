"use client";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import facebook from "@/public/assets/social/Facebook.svg";
import instagram from "@/public/assets/social/Instagram.svg";
import pinterest from "@/public/assets/social/Pinterest.svg";
import reddit from "@/public/assets/social/Reddit.svg";
import twitter from "@/public/assets/social/Twitter.svg";
import youtbe from "@/public/assets/social/Youtube.svg";
import logo from "@/public/assets/Logo.svg";
import glass from "@/public/assets/glass.svg";
import { ButtonBlack } from "@/app/Components/button/Button";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { PiUserLight } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import Cart from "@/app/cart/Cartpage";
import Signin from "@/app/auth/signin/page";
import Wishpage from "@/app/wishlist/wishpage";
import { supabase } from "@/app/lib/supabaseClient";
import ProductCard from "@/app/Components/Card/ProductCard ";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { LuPhoneCall } from "react-icons/lu";
import { IoIosGitCompare } from "react-icons/io";
import { AiOutlineCustomerService } from "react-icons/ai";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { cartContext } from "@/app/context/ProductContext";
import Breadcrumbs from "@/app/Components/breadcrumbs/breadcumbs";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "react-toastify";
import { Session } from "@supabase/supabase-js";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  category_id: number;
};

type HeaderProps = {
  categories: Category[];
  onSelect: (categoryId: number) => void;
};

type Category = {
  id: number;
  name: string;
};


const Header: React.FC<HeaderProps> = ({ onSelect }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [islogin, setIslogin] = useState(false);
  const [openWidget, setOpenWidget] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // for currency and language //
  const [language, setLanguage] = useState("Eng");
  const [currency, setCurrency] = useState("USD");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrDropdown, setShowCurrDropdown] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [role, setRole] = useState(null);

  
  // login user and access //
  useEffect(() => {
    const getSessionAndRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching role:", error.message);
        } else {
          setRole(data?.role);
        }
      }

      setLoading(false);
    };

    getSessionAndRole();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // for category  dropdown //
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Category");
  const [categories, setCategories] = useState<Category[]>([]);

  // cartbadge //
  const context = useContext(cartContext);
  const totalCartItems =
    context?.cart?.reduce((acc, item) => acc + (item.quantity ?? 1), 0) ?? 0;

  // for navigate bredcumbs //
  const pathname = usePathname();
  const [ishome, setIshome] = useState(false);

  useEffect(() => {
    setIshome(pathname === "/");
  }, [pathname]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (session && role === "user") {
      setIslogin(false); 
      setShowUserMenu(true); 
    }
  }, [session, role]);

  //  for fetching category //
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error && data) {
      setCategories(data);
    }
  };

  // for select  category //
  const handleSelect = (category: Category) => {
    setSelected(category.name);
    onSelect(category.id);
    setOpen(false);
  };

  const hideCloseBtn = () => {
    setOpenWidget(false);
  };

  // for serching products //
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const { data, error } = await supabase
      .from("allproducts")
      .select("*")
      .ilike("name", `%${searchQuery}%`);

    if (!error && data) {
      setSearchResults(data);
    } else {
      console.error("Search error:", error);
    }
  };

  // user logout //
  const handleLogout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileData?.role === "user") {
      await supabase.auth.signOut();
      setUser(null);
      setShowUserMenu(false);
      toast.success("Logged out successfully");
    } else {
      toast.error("Only regular users can log out from here");
    }
  };

  return (
    <>
      <div className="bg-[#191C1F]">
        <div className="container">
          {/* widget part  */}
          {openWidget && (
            <div className=" text-white h-[80px] flex items-center ">
              <div className="container flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <p className="text-2xl bg-[#F3DE6D] text-black transform -rotate-3 py-1.5 px-2.5">
                    Black
                  </p>
                  <p className="text-2xl font-semibold">Friday</p>
                </div>

                <div className="flex flex-row items-center gap-1 ">
                  <p>Up to</p>
                  <p className="text-4xl font-semibold text-[#EBC80C] font-sans">
                    59%
                  </p>
                  <p>OFF</p>
                </div>
                <ButtonBlack />
              </div>

              <RxCross1
                onClick={hideCloseBtn}
                className="  cursor-pointer ml-5"
              />
            </div>
          )}
        </div>
      </div>

      {/* social nav part  */}
      <div className="bg-[#1B6392] py-2">
        <div className="container flex justify-between px-2">
          <div className="flex items-center">
            <p className="text-white text-[14px]">
              Welcome to Clicon online eCommerce store.
            </p>
          </div>
          {/* social icon  */}
          <div className="flex gap-1 text-white items-center justify-center">
            <p className="pr-2">follow us: </p>
            <div className="flex gap-1 pr-3 cursor-pointer ">
              <Image alt="facebook" src={facebook} width={18} height={10} />
              <Image alt="instagram" src={instagram} width={18} height={10} />
              <Image alt="twitter" src={twitter} width={18} height={10} />
              <Image
                alt="pinterest"
                src={pinterest}
                width={18}
                height={10}
                className="h-auto"
              />
              <Image alt="reddit" src={reddit} width={18} height={10} />
              <Image alt="youtube" src={youtbe} width={18} height={10} />
            </div>
            <div className="border-l gap-r-3 h-6 border-gray-400"></div>
            <div className="flex space-x-4">
              <div className="relative">
                <button
                  className="cursor-pointer"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                >
                  {language}
                  <IoMdArrowDropdown />
                </button>
                {showLangDropdown && (
                  <ul className="absolute z-10 bg-white border mt-1 text-sm text-black cursor-pointer">
                    {["Eng", "Bn", "Fr"].map((lang) => (
                      <li
                        key={lang}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangDropdown(false);
                        }}
                      >
                        {lang}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="relative">
              <button
                className="cursor-pointer"
                onClick={() => setShowCurrDropdown(!showCurrDropdown)}
              >
                {currency}
                <IoMdArrowDropdown />
              </button>
              {showCurrDropdown && (
                <ul className="absolute z-10 bg-white border mt-1 text-sm text-black cursor-pointer">
                  {["USD", "INR", "EUR"].map((curr) => (
                    <li
                      key={curr}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCurrency(curr);
                        setShowCurrDropdown(false);
                      }}
                    >
                      {curr}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="text-[#1373b3]" />

      {/* nav part  */}
      <div className="bg-[#1B6392]">
        <div className="container">
          <div className="flex justify-between items-center py-3">
            <Link href="/">
              <Image src={logo} alt="logo" />
            </Link>

            <div className="bg-white py-2 rounded-sm justify-between items-center px-4 flex w-[40%]">
              <input
                type="text"
                placeholder="Search for anything..."
                className="text-black outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div onClick={handleSearch}>
                <Image alt="glass" src={glass} className="cursor-pointer" />
              </div>
            </div>

            <div className="relative">
              {/* Buttons Section */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative"
                >
                  <IoCartOutline className="text-white text-3xl cursor-pointer font-semibold" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {totalCartItems}
                    </span>
                  )}
                </button>

                <button onClick={() => setIsWishlistOpen(!isWishlistOpen)}>
                  <IoMdHeartEmpty className="text-white text-3xl cursor-pointer font-semibold" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => {
                      if (!session) {
                        setIslogin((prev) => !prev);
                      } else if (role === "user") {
                        setShowUserMenu((prev) => !prev);
                      }
                    }}
                  >
                    <PiUserLight className="text-white text-3xl cursor-pointer font-bold" />
                  </button>

                  {!session && islogin && (
                    <Signin onClose={() => setIslogin(false)} />
                  )}

                  {session && role === "user" && showUserMenu && (
                    <div className="absolute right-0 top-10 mt-2 bg-white shadow-lg border border-gray-200 w-44 z-50 rounded overflow-hidden">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        👤 Profile
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <Link
                        href="/auth/forgetpassword"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⚙️ Settings
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Popup */}
              {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}

              {/* wishlist Popup */}
              {isWishlistOpen && (
                <Wishpage onClose={() => setIsWishlistOpen(false)} />
              )}

            </div>
          </div>
        </div>
      </div>

      {/* info part  */}
      <div className="container px-4">
        <div className="flex justify-between items-center py-5">
          <ul className="flex gap-x-10">
            {/* display category  */}
            <div className="relative inline-block text-left">
              <li
                onClick={() => setOpen(!open)}
                className="flex items-center gap-x-1 cursor-pointer select-none"
              >
                {selected} <MdKeyboardArrowDown className="text-[18px]" />
              </li>

              {open && (
                <ul className="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md">
                  {categories?.map((category) => (
                    <li
                      key={category.id}
                      onClick={() => handleSelect(category)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* display info items  */}
            <Link href="/trackorder">
              <li className="flex items-center gap-x-1 cursor-pointer">
                <CiLocationOn className="text-[18px]" />
                Track Order
              </li>
            </Link>
            <li className="flex items-center gap-x-1 cursor-pointer">
              <IoIosGitCompare className="text-[18px]" />
              Compare
            </li>
            <Link href="/customersupport">
              <li className="flex items-center gap-x-1 cursor-pointer">
                <AiOutlineCustomerService className="text-[18px]" />
                Customer Support
              </li>
            </Link>
            <Link href="/faqpage">
              <li className="flex items-center gap-x-1 cursor-pointer">
                <IoIosInformationCircleOutline className="text-[18px]" />
                Need Help
              </li>
            </Link>
          </ul>

          <p className="flex items-center gap-x-2 cursor-pointer">
            <LuPhoneCall className="text-[18px]" /> +98 2534234432
          </p>
        </div>
      </div>

      <hr className="text-[#E4E7E9]" />

      {/* display breadcumbs  */}
      {!ishome && (
        <div className="container">
          <Breadcrumbs />
        </div>
      )}

      {/* Render Search Results */}
      <div className="container px-4">
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-6">
            {searchResults.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <button
              onClick={() => setSearchResults([])}
              className="text-sm cursor-pointer text-blue-600 underline mt-2"
            >
              Clear Results
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-b md:hidden">
        <Image src={logo} alt="Logo" className="w-28 h-auto" />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FiMenu className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Responsive Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-4 space-y-4">
          <ul className="space-y-2">
            <li onClick={() => setOpen(!open)} className="cursor-pointer">
              {selected} <MdKeyboardArrowDown className="inline-block" />
              {open && (
                <ul className="mt-2 space-y-1">
                  {categories?.map((category) => (
                    <li
                      key={category.id}
                      onClick={() => handleSelect(category)}
                      className="pl-4 py-1 text-gray-600 hover:text-black"
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <Link href="/trackorder">
              <li>Track Order</li>
            </Link>
            <li>Compare</li>
            <Link href="/customersupport">
              <li>Customer Support</li>
            </Link>
            <Link href="/faqpage">
              <li>Need Help</li>
            </Link>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
