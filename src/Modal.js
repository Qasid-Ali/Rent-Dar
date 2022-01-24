import React, { useState } from "react";
import { db } from "./firebase";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import { Card, Button } from "react-bootstrap";
import firebase from "firebase";

toast.configure();

export const Modal = ({ hideModal, itemId, price }) => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [errorC, setErrorC] = useState("");
  const [errorR, setErrorR] = useState("");

  // form states
  const [city, setCity] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [TotalPrice] = useState(price);

  // close modal
  const handleCloseModal = () => {
    hideModal();
  };

  // cash on delivery
  const handleCashOnDelivery = async (e) => {
    e.preventDefault();

    if (!city) {
      setErrorC("*Input field are required..");
      setTimeout(() => {
        setErrorC("");
      }, 3000);
    } else if (!residentialAddress) {
      setErrorR("*Input field are required..");
      setTimeout(() => {
        setErrorR("");
      }, 3000);
    } else {
      setErrorC("");
      setErrorR("");
      var uid = currentUser.email;
      const userData = await db.collection("users").doc(uid).get();
      const itemData = await db.collection("items").doc(itemId).get();
      await db.collection("Orders").add({
        totalprice: TotalPrice,
        renterName: userData.data().name,
        lenderName: itemData.data().name,
        itemCategory: itemData.data().itemCategory,
        method: "Cash",
        renterEmail: userData.data().email,
        lenderEmail: itemData.data().email,
        city: city,
        itemId: itemId,
        residentialAddress: residentialAddress,
        itemName: itemData.data().itemName,
        itemImg: itemData.data().itemImg,
        itemDescription: itemData.data().itemDescription,
        itemDate: firebase.firestore.FieldValue.serverTimestamp(),
        inProgress: false,
        feedbackStatus: false,
      });
      db.collection("items")
        .doc(itemId)
        .update({
          quantity: Number(1),
          totalprice: 0,
          inprogress: false,
        });
      hideModal();
      setCity("");
      setResidentialAddress("");
      history.push("/");
      toast.success("Your item has been rented successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };

  return (
    <div className="shade-area ">
      <div className="modal-container my-form my-3">
        <Card className="my-form my-3">
          <form className="form-group" onSubmit={handleCashOnDelivery}>
            <h6 className="text-center">Rent Item</h6>

            <select
              className="form-control mt-3 p-2"
              onChange={(e) => setCity(e.target.value)}
            >
              <option>Lahore</option>
              <option>Karachi</option>
              <option>Islamabad</option>
              <option>Rawalpindi</option>
              <option>Other</option>
            </select>
            <p className="red">{errorC}</p>

            <input
              type="text"
              className="form-control mt-3 p-2"
              placeholder="Residential Address"
              onChange={(e) => setResidentialAddress(e.target.value)}
              value={residentialAddress}
            />
            <p className="red">{errorR}</p>

            <label>Total Price</label>
            <input
              type="text"
              className="form-control "
              readOnly
              required
              value={TotalPrice}
            />
            <br></br>

            <Button type="submit" variant="primary" style={{ width: "100%" }}>
              Submit
            </Button>
          </form>
          <div className="delete-icon" onClick={handleCloseModal}>
            x
          </div>
        </Card>
      </div>
    </div>
  );
};
