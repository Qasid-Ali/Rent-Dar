import React, { useState, useEffect } from "react";
import { Listing } from "./Listing";
import { db } from "./firebase";

export const ShowListingItems = (props) => {
  const [products, setProducts] = useState([]);

  // getting products function
  const getProducts = async () => {
    const products = await db.collection("items").get();
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data,
      });
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray);
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {products.length > 0 && (
        <>
          <div>
            <div className="products-box">
              <Listing products={products} />
            </div>
          </div>
        </>
      )}
      {products.length < 1 && (
        <>
          <div className="text-center">Please wait....</div>
        </>
      )}
    </>
  );
};
export default ShowListingItems;
