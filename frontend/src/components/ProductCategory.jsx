import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import ProductCard from "./ProductCard";

const ProductCategory = () => {
  const { products } = useContext(AppContext);
  const { category } = useParams();
  const params = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="bg-primary rounded-full w-16 h-0.5"></div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6 gap-3 md:gap-6">
          {filteredProducts.map((eachProduct) => (
            <ProductCard product={eachProduct} key={eachProduct._id} />
          ))}
        </div>
      ) : (
        <div className="flex items-center  justify-center h=[60vh]">
          <p className="text-2xl font-medium text-primary">
            No Products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
