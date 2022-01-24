import React, { useState } from "react";
import { db } from "./firebase";
import { useAuth } from "./context/AuthContext";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export const RequestSentModal = ({ hideModal, itemId }) => {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");

  // form states
  const [desc, setDesc] = useState("");
  // close modal
  const handleCloseModal = () => {
    hideModal();
  };

  const submitRequest = () => {
    if (!desc) {
      setError("*Field cannot be empty!");
    } else {
      db.collection("requests")
        .add({
          itemId: itemId,
          userEmail: currentUser.email,
          requestDescription: desc,
        })
        .then(() => {
          toast.success("Offer Send", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setDesc("");
        });
    }
  };

  return (
    <div className="shade-area">
      <div className="modal-container">
        <h4 className="mt-2">Describe Your Offer</h4>
        <hr />
        <p className="red">{error}</p>
        <textarea
          type="text"
          placeholder="Describe Your Offer.."
          className="form-control"
          style={{ height: "250px" }}
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />

        <Button
          variant="primary"
          className="mt-2 w-100"
          type="submit"
          onClick={submitRequest}
        >
          Send Offer
        </Button>

        <div className="delete-icon" onClick={handleCloseModal}>
          X
        </div>
      </div>
    </div>
  );
};
