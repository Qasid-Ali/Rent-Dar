import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { db, auth } from "../../firebase";
import { toast } from "react-toastify";

toast.configure();

export const IndividualFavItems = ({ favouriteProduct }) => {
  const handleDeleteItem = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("Favorite " + user.uid)
          .doc(favouriteProduct.ID)
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
          });
      }
    });
  };

  return (
    <div className="product">
      <div className="card__btn">
        <div className="product-img">
          <img src={favouriteProduct.itemImg} alt="product-img" />
        </div>
        <div onClick={handleDeleteItem}>
          <DeleteIcon className="red" />
        </div>
      </div>
      <div className="card__info">
        <div className="product-text title">{favouriteProduct.itemName}</div>
        <div className="product-text description">
          {favouriteProduct.itemDescription}
        </div>
        <div className="card__btn">
          <div>{favouriteProduct.itemCondition}</div>
          <div className="product-text price">
            <strong>PKR </strong>
            {favouriteProduct.itemPrice.hour} / hr
          </div>
        </div>
      </div>
    </div>
  );
};
