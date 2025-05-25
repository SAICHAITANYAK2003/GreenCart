import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { data } from "react-router-dom";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });
      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  return (
    !isSeller && (
      <form
        className="flex items-center text-sm text-gray-600 min-h-screen"
        onSubmit={onSubmitHandler}
      >
        <div className="flex items-start flex-col gap-5 border border-gray-200 p-8 py-12 rounded-md min-w-80 shadow-xl m-auto">
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">Seller</span> Login
          </p>

          <div className="flex flex-col w-full">
            <label htmlFor="email">Email</label>
            <input
              onChange={(event) => setEmail(event.target.value)}
              className="border border-gray-200 w-full rounded p-2 mt-1 outline-primary"
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="password">Password</label>
            <input
              onChange={(event) => setPassword(event.target.value)}
              className="border border-gray-200 w-full rounded p-2 mt-1 outline-primary"
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>

          <button className="bg-primary hover:bg-primary-dull py-2 w-full rounded-md text-white cursor-pointer">
            Login
          </button>
        </div>
      </form>
    )
  );
};

export default SellerLogin;
