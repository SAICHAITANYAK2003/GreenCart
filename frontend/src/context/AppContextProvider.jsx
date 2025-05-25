import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets.js";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  //Fetch Seller Status
  const fetchSellerStatus = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  //Fetch User Status
  const fetchUserStatus = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
        console.log(data.user.cartItems);
      }
    } catch (error) {
      setUser(null);
    }
  };

  //Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Add Products

  const addToCart = (itemId) => {
    let cardData = structuredClone(cartItems);

    if (cardData[itemId]) {
      cardData[itemId] += 1;
    } else {
      cardData[itemId] = 1;
    }

    setCartItems(cardData);
    toast.success("Added to cart");
  };

  //Update Cart Item quantity

  const updateCart = (itemId, quantity) => {
    let cardData = structuredClone(cartItems);

    cardData[itemId] = quantity;
    setCartItems(cardData);
    toast.success("Cart Updated");
  };

  //REMOVE CART ITEM

  const removeCartItem = (itemId) => {
    {
      let cardData = structuredClone(cartItems);
      if (cardData[itemId]) {
        cardData[itemId] -= 1;
        if (cardData[itemId] === 0) {
          delete cardData[itemId];
        }
      }
      setCartItems(cardData);
      toast.success("Removed from Cart");
    }
  };

  //Get Cart Item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  //GET CART TOTOAL AMOUNT

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      let itemInfo = products.find((product) => product._id === item);
      if (cartItems[item] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[item];
      }
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchUserStatus();
    fetchSellerStatus();
    fetchProducts();
  }, []);

  //update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCart,
    removeCartItem,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    fetchProducts,
    setCartItems,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
