import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { db, auth } from "./firebase";
import { useAuth } from "./context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

toast.configure();

export const AllItems = ({ individualProduct, addToFavourite, deleteItem }) => {
  const handleAddToFavurite = () => {
    addToFavourite(individualProduct);
  };
  const handleDeleteItem = () => {
    deleteItem(individualProduct);
  };
  const [user] = useAuthState(auth);
  const { currentUser } = useAuth();

  db.collection("items").doc(individualProduct.ID).update({
    itemId: individualProduct.ID,
  });

  return (
    <>
      <div className="product">
        <Link className="underline" to={`/itemDetail/${individualProduct.ID}`}>
          <div
            className="card_btn"
            style={{ justifyContent: "space-between", padding: "5px 20px" }}
          >
            {user && (
              <div
                className={`product-status ${
                  individualProduct.inprogress ? "Available" : "Booked"
                }`}
              >
                {individualProduct.inprogress ? "Available" : "Booked"}
              </div>
            )}
            {user && individualProduct.email === currentUser.email && (
              <>
                <div className="card_btn">
                  <Link
                    className="underline"
                    to={`/updateitem/${individualProduct.itemId}`}
                  >
                    <EditIcon style={{ color: "grey" }} />
                  </Link>
                  <DeleteIcon onClick={handleDeleteItem} className="red" />
                </div>
              </>
            )}
          </div>
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
          </div>
        </Link>
        <div className="card__btn rent-btn">
          <Link to={`/item/${individualProduct.ID}`}>
            <Button variant="outline-primary">RENT IT</Button>
          </Link>
          <div onClick={handleAddToFavurite}>
            <FavoriteIcon className="fav-icon" />
          </div>
        </div>
      </div>
    </>
  );
};
export default AllItems;
