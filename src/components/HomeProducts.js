import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

function HomeProducts(props) {
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
      <div className="products-box">
        {products.map((individualProduct) => (
          <>
            <div className="product">
              <div className="product-img">
                <img src={individualProduct.itemImg} alt="product-img" />
              </div>
              <div className="card__info">
                <div className="card__btn">
                  <div className="product-text title">
                    {individualProduct.itemName}
                  </div>
                  <div className="product-text title">
                    PKR {individualProduct.itemPrice.hour}
                  </div>
                </div>
                <div className="product-text description">
                  {individualProduct.itemDescription}
                </div>
                <Link to={`/item/${individualProduct.ID}`}>
                  <Button variant="outline-primary">RENT IT</Button>
                </Link>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default HomeProducts;
