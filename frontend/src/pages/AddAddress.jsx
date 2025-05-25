import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

//Input feild component

const InputField = ({ type, placeholder, name, address, handleChange }) => (
  <input
    type={type}
    className="border border-gray-500/30 px-2 py-2.5 w-full rounded outline-none text-gray-500 focus:border-primary transition "
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const { axios, navigate, user } = useContext(AppContext);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((prevAdress) => ({
      ...prevAdress,
      [name]: value,
    }));
  };
  const onSubmitHandle = async (event) => {
    try {
      const { data } = await axios.post("/api/address/add", { address });

      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    event.preventDefault();
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);
  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form className="mt-6 text-sm space-y-3" onSubmit={onSubmitHandle}>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                type="text"
                name="firstName"
                placeholder="First Name"
              />

              <InputField
                handleChange={handleChange}
                address={address}
                type="text"
                name="lastName"
                placeholder="Last Name"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              type="text"
              name="email"
              placeholder="Email address"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              type="text"
              name="street"
              placeholder="Street"
            />

            <div className="grid md:grid-cols-2 gap-2">
              <InputField
                handleChange={handleChange}
                address={address}
                type="text"
                name="city"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                type="text"
                name="state"
                placeholder="State"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              <InputField
                handleChange={handleChange}
                address={address}
                type="number"
                name="zipcode"
                placeholder="Zip code"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                type="text"
                name="country"
                placeholder="Country"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              type="text"
              name="phone"
              placeholder="Phone"
            />

            <button className="  mt-6 h-10 w-full bg-primary hover:bg-primary-dull text-white cursor-pointer">
              Save Address{" "}
            </button>
          </form>
        </div>
        <img src={assets.add_address_iamge} alt="" />
      </div>
    </div>
  );
};

export default AddAddress;
