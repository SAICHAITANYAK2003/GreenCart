import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  const onHandleLogOut = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    // setShowUserLogin(false);
    // setUser(false);
    // navigate("/");
  };
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink onClick={() => setOpen(false)} to="/">
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink
          to="/seller"
          className="border border-gray-400 text-[12px] text-gray-600 px-2 rounded-2xl "
        >
          Seller Dashboard
        </NavLink>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src={assets.cart_icon} alt="cart" className="w-6 opacity-80" />

          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => {
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="group relative">
            <img
              className="h-10 w-10 "
              src={assets.profile_icon}
              alt="profile-icon"
            />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 w-30 py-2.5 rounded-[10px] z-40">
              <li
                onClick={() => navigate("/my-orders")}
                className="hover:bg-primary/15 p-1.5 pl-3 cursor-pointer "
              >
                My Orders
              </li>
              <li
                onClick={onHandleLogOut}
                className="hover:bg-primary/15 p-1.5 pl-3 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/*Hamburger Icon*/}
      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img src={assets.cart_icon} alt="cart" className="w-6 opacity-80" />

          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
        >
          {/* Menu Icon SVG */}
          <img src={assets.menu_icon} alt="menu" className="w-6 opacity-80" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-30 `}
        >
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            Products
          </NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}

          <NavLink to="/contact" onClick={() => setOpen(false)}>
            contact
          </NavLink>
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={onHandleLogOut}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
