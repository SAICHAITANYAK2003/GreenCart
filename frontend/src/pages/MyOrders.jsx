import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { dummyOrders } from "../assets/assets";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myorders, setMyOrders] = useState([]);
  const { currency, axios, user } = useContext(AppContext);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
        console.log(data.orders);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);
  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl md:text-3xl ">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      {myorders.map((eachOrder) => (
        <div
          key={eachOrder._id}
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>OrderId :{eachOrder._id}</span>
            <span>Payment : {eachOrder.paymentType}</span>
            <span>
              Total Amount :{currency}
              {eachOrder.amount}
            </span>
          </p>
          {eachOrder.items?.map((eachItem, index) => (
            <div
              key={eachItem._id}
              className={`relative bg-white  border-gray-300 text-gray-500/70 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl ${
                eachOrder.items.length !== index + 1 && "border-b"
              }`}
            >
              {/*---------item-image-&-details-section------- */}
              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                {/*---------item-image------- */}
                <img
                  src={eachItem.product.image[0]}
                  alt=""
                  className="w-16 h-16"
                />
                {/*---------details-section------- */}
                <div className="ml-4">
                  <h2
                    className="text-xl
                  font-medium text-gray-800"
                  >
                    {eachItem.product.name}
                  </h2>
                  <p className=" text-gray-400">
                    Category : {eachItem.product.category}
                  </p>
                </div>
              </div>

              {/*---------item-quantity-status-date-section------- */}
              <div className="text-gray-400">
                <p>Quantity : {eachItem.quantity || 1} </p>
                <p>Status : {eachOrder.status}</p>
                <p>
                  Date : {new Date(eachOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/*---------item-Amount------- */}
              <p className="text-primary text-lg font-medium">
                Amount : {currency}
                {eachItem.product.offerPrice * eachItem.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
