import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { FavouriteItem } from "./FavouriteItem";
import NavBar from "../../NavBar";
import { Link } from "react-router-dom";

function Favourite(props) {
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  // getting favourite products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("Favorite " + user.uid).onSnapshot((snapshot) => {
          const newFavProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setFavouriteProducts(newFavProduct);
        });
      } else {
        console.log("user is not signed in to retrieve favourite");
      }
    });
  }, []);

  return (
    <>
      <NavBar />
      {favouriteProducts.length > 0 && (
        <div className="container-fluid">
          <h6 className="text-center mt-4 mb-4">My WishList Items</h6>
          <div className="products-box">
            <FavouriteItem favouriteProducts={favouriteProducts} />
          </div>
        </div>
      )}
      {favouriteProducts.length < 1 && (
        <div className="not-found">
          <h7>Empty Wishlist....No products to show</h7>
          <p>
            <Link to="/dashboard">Back to HomePage</Link>
          </p>
        </div>
      )}
    </>
  );
}

export default Favourite;
