import React, { useState, useEffect } from "react";
import { Items } from "./Items";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

toast.configure();

export const ShowItems = (props) => {
  const [user] = useAuthState(auth);
  const [products, setProducts] = useState([]);

  //getting user id
  function GetUserUid() {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    return uid;
  }
  //save user id of current user
  const uid = GetUserUid();

  const history = useHistory();

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

  let Product;
  const addToFavourite = (product) => {
    if (uid !== null) {
      Product = product;
      db.collection("Favorite " + uid)
        .doc(product.ID)
        .set(Product)
        .then(() => {
          toast.success("Added to Favourite", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      history.push("/");
    }
  };
  const deleteItem = (product) => {
    db.collection("items")
      .doc(product.ID)
      .delete()
      .then(() => {
        toast.success("Deleted Successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push("/");
      });
  };

  return (
    <>
      <br></br>

      {products.length > 0 && (
        <>
          <div className="container-fluid">
            <div className="btn-group-cat">
              <h7 style={{ fontStyle: "italic" }}>
                {user && <>Total Services : {products.length}</>}
              </h7>
            </div>
            <div className="products-box">
              <Items
                products={products}
                addToFavourite={addToFavourite}
                deleteItem={deleteItem}
              />
            </div>
          </div>
        </>
      )}
      {products.length < 1 && <></>}
    </>
  );
};
export default ShowItems;
