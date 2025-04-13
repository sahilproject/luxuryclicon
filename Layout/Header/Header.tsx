"use client";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import facebook from "@/public/assets/social/Facebook.svg";
import instagram from "@/public/assets/social/Instagram.svg";
import pinterest from "@/public/assets/social/Pinterest.svg";
import reddit from "@/public/assets/social/Reddit.svg";
import twitter from "@/public/assets/social/Twitter.svg";
import youtbe from "@/public/assets/social/Youtube.svg";
import logo from "@/public/assets/Logo.svg";
import glass from "@/public/assets/glass.svg";
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
import { CiLocationOn } from "react-icons/ci";
import { LuPhoneCall } from "react-icons/lu";
import { IoIosGitCompare } from "react-icons/io";
import { AiOutlineCustomerService } from "react-icons/ai";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { cartContext } from "@/app/context/ProductContext";
import Breadcrumbs from "@/app/Components/breadcrumbs/breadcumbs";
import { usePathname, useRouter } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "react-toastify";
import { Session } from "@supabase/supabase-js";
import Confetti from "react-confetti";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  category_id: number;
};

// type HeaderProps = {
//   categories: Category[];
//   onSelect: (categoryId: number) => void;
// };

// type Category = {
//   id: number;
//   name: string;
// };
interface SigninProps {
  onClose: () => void;
}

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [islogin, setIslogin] = useState(false);
  const [openWidget, setOpenWidget] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  // for currency and language //
  const [language, setLanguage] = useState("Eng");
  const [currency, setCurrency] = useState("USD");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrDropdown, setShowCurrDropdown] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  // login user and access //
  

  const getSessionAndRole = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
    setShowUserMenu(false); // Always reset menu state on session check

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

  useEffect(() => {
    getSessionAndRole();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // for category  dropdown //
  const router = useRouter();

  // cartbadge //
  const context = useContext(cartContext);
  const totalCartItems =
    context?.cart?.reduce((acc, item) => acc + (item.quantity ?? 1), 0) ?? 0;

  // wishlist badge
  const wishlistCount = context?.wishList?.length || 0;

  // for navigate bredcumbs //
  const pathname = usePathname();
  const [ishome, setIshome] = useState(false);

  useEffect(() => {
    setIshome(pathname === "/");
  }, [pathname]);

  useEffect(() => {
    if (session && role === "user") {
      setIslogin(false);
      setShowUserMenu(true);
      router.refresh();
    }
  }, [session, role]);

  // Hide confetti after 5 seconds
  useEffect(() => {
    if (widgetRef.current) {
      setSize({
        width: widgetRef.current.offsetWidth,
        height: widgetRef.current.offsetHeight,
      });
    }
  }, [openWidget]);

  // congrats timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // widget close
  const hideCloseBtn = () => {
    localStorage.setItem("blackFridayClosed", "true");
    setOpenWidget(false);
  };

  //  widget open auto
  useEffect(() => {
    const hasClosed = localStorage.getItem("blackFridayClosed");
    if (!hasClosed) {
      setOpenWidget(true);
    }
  }, []);

  
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
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
  
      if (userError || !user) {
        toast.error("Unable to get user information");
        return;
      }
  
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
  
      if (profileError || !profileData) {
        toast.error("Unable to verify user role");
        return;
      }
  
      if (profileData.role === "user") {
        const { error: signOutError } = await supabase.auth.signOut();
        
        if (signOutError) {
          throw signOutError;
        }
  
        // Reset all relevant states
        setUser(null);
        setSession(null);
        setRole(null);
        setShowUserMenu(false); 
        setIslogin(false); 
        
        toast.success("Logged out successfully");
        router.push("/"); 
        router.refresh(); 
      } else {
        toast.error("Only regular users can log out from here");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };


  // success login 
  const handleSuccessfulLogin = () => {
    setIslogin(false);
    getSessionAndRole();
    router.refresh();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);





  return (
    <>
      <div className="bg-[#191C1F]">
        {/* widget part  */}
        <div className="container">
          {openWidget && (
            <div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        z-40 flex items-center justify-center"
            >
              <div
                ref={widgetRef}
                className="rounded-lg shadow-lg p-4 text-white text-center
                       w-[200px] h-[200px] sm:w-[400px] sm:h-[400px]
                       flex flex-col justify-between items-center relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(255,105,180), rgb(30,144,255), rgb(144,238,144))",
                }}
              >
                {/* Full widget-wide confetti */}
                {showConfetti && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <Confetti
                      width={size.width}
                      height={size.height}
                      numberOfPieces={100}
                      recycle={false}
                    />
                  </div>
                )}

                {/* Congratulations! */}
                <div className="z-10 mb-1 sm:mb-4">
                  <p className="text-[8px] sm:text-2xl font-bold text-[#F3DE6D] drop-shadow animate-bounce">
                    🎉 Congratulations! 🎉
                  </p>
                </div>

                {/* Happy Holi + Offer */}
                <div className="flex flex-col justify-center items-center flex-grow gap-1 z-10">
                  <p className="text-[8px] sm:text-4xl font-bold bg-[#F3DE6D] text-black py-1 px-2 rotate-[-3deg]">
                    Happy
                  </p>
                  <p className="text-[8px] sm:text-3xl font-semibold">Holi</p>
                  <p className="text-[6px] sm:text-lg font-semibold text-yellow-200 mt-1">
                    🛍 29% OFF on new products!
                  </p>
                </div>

                {/* Shop Now Button */}
                <Link href="/browseallproducts">
                  <button className="z-10 cursor-pointer text-[6px] sm:text-base bg-[#F3DE6D] text-black px-2 sm:px-4 py-1 sm:py-2 rounded-md hover:scale-105 transition-transform duration-200">
                    Shop Now
                  </button>
                </Link>

                {/* Close Button */}
                <RxCross1
                  onClick={hideCloseBtn}
                  className="z-10 cursor-pointer text-[10px] sm:text-xl mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* social follow us  part  */}
      <div className="bg-[#1B6392] py-2 sm:block hidden">
        <div className="container flex flex-wrap justify-between px-2 gap-y-2">
          <div className="flex items-center w-full sm:w-auto ">
            <p className="text-white text-[14px]">
              Welcome to Clicon online eCommerce store.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center text-white gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <p className="pr-1 sm:pr-2 text-sm">Follow us:</p>
              <div className="flex gap-1 pr-2 cursor-pointer">
                <Image alt="facebook" src={facebook} width={18} height={10} />
                <Image alt="instagram" src={instagram} width={18} height={10} />
                <Image alt="twitter" src={twitter} width={18} height={10} />
                <Image alt="pinterest" src={pinterest} width={18} height={10} />
                <Image alt="reddit" src={reddit} width={18} height={10} />
                <Image alt="youtube" src={youtbe} width={18} height={10} />
              </div>
            </div>

            <div className="hidden sm:block border-l h-6 border-gray-400"></div>

            <div className="flex gap-3">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  className="cursor-pointer flex items-center gap-1"
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
                        className="px-4 py-2 hover:bg-gray-100"
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

              {/* Currency Dropdown */}
              <div className="relative">
                <button
                  className="cursor-pointer flex items-center gap-1"
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
                        className="px-4 py-2 hover:bg-gray-100"
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
      </div>

      <hr className="text-[#1373b3]" />

      {/* nav part  */}
      <div className="bg-[#1B6392]">
        <div className="container">
          <div className="flex justify-between items-center py-3 px-2 sm:px-0">
            <Link href="/">
              <Image src={logo} alt="logo" className="w-27 sm:w-42" />
            </Link>

            <div className="bg-white py-1 sm:py-2 rounded-sm justify-between items-center px-4 flex w-[30%] mx-[2px]">
              <input
                type="text"
                placeholder="Search for anything..."
                className="text-black outline-none w-full "
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
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative"
                >
                  <IoCartOutline className="text-white text-2xl sm:text-3xl cursor-pointer font-semibold" />
                  {
  totalCartItems > 0 ? (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
      {totalCartItems}
    </span>
  ) : null
}
                </button>

                <button
                  onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                  className="relative"
                >
                  <IoMdHeartEmpty className="text-white text-2xl sm:text-3xl cursor-pointer font-semibold" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      if (!session) {
                        setIslogin((prev) => !prev);
                      } else if (role === "user") {
                        setShowUserMenu((prev) => !prev); 
                      }
                    }}
                  >
                    <PiUserLight className="text-white text-2xl sm:text-3xl cursor-pointer font-bold mt-1" />
                  </button>

                  {!session && islogin && (
                    <Signin onClose={handleSuccessfulLogin} />
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
                        className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
        <div className="flex justify-between items-center py-2 sm:py-4 text-xs sm:text-sm">
          <ul className="flex gap-x-3 sm:gap-x-8">
            {/* display info items */}
            <Link href="/trackorder">
              <li className="flex items-center gap-x-1 cursor-pointer">
                <CiLocationOn className="text-[14px] sm:text-[16px]" />
                Track Order
              </li>
            </Link>
            <li className="flex items-center gap-x-1 cursor-pointer">
              <IoIosGitCompare className="text-[14px] sm:text-[16px]" />
              Compare
            </li>
            <Link href="/customersupport">
              <li className="flex items-center gap-x-1 cursor-pointer">
                <AiOutlineCustomerService className="text-[14px] sm:text-[16px]" />
                Customer Support
              </li>
            </Link>
            <Link href="/faqpage">
              <li className="flex items-center gap-x-1 cursor-pointer">
                <IoIosInformationCircleOutline className="text-[14px] sm:text-[16px]" />
                Need Help
              </li>
            </Link>
          </ul>

          <p className="hidden sm:flex items-center gap-x-1 sm:gap-x-2 cursor-pointer text-xs sm:text-sm">
            <LuPhoneCall className="text-[14px] sm:text-[16px]" /> +98
            2534234432
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
    </>
  );
};

export default Header;
