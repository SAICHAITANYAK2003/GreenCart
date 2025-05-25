import React, { useContext } from "react";
import ProductCard from "./ProductCard";
import { AppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useContext(AppContext);
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Seller</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-10">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard product={product} key={product._id} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
