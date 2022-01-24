import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Alert, Button } from "react-bootstrap";
import { db } from "../../firebase";

function ViewCategory({ id, categoryName, hideModal }) {
  const [name, setName] = useState(categoryName);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCloseModal = () => {
    hideModal();
  };

  const addCategory = (e) => {
    e.preventDefault();

    if (!name) {
      setError("*Input Field are required !");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      if (name.length < 3 || name.length > 20) {
        setError("*Enter correct name! Min 3 letters or Max 20 letters ");
        setTimeout(() => {
          setError("");
        }, 3000);
      } else {
        setError("");
        db.collection("category").doc(id).update({
          name: name,
        });
        setSuccessMsg(" Updated Category Successfully");
        setTimeout(() => {
          setSuccessMsg("");
        }, 1000);
      }
    }
  };

  return (
    <div className="shade-area">
      <div className="modal-container">
        <form className="form-group" onSubmit={addCategory}>
          <h4 className="mt-2">Update Category</h4>
          <hr />
          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="red">{error}</p>
          <Button type="submit">Update Category</Button>
        </form>

        <div className="delete-icon" onClick={handleCloseModal}>
          <CloseIcon />
        </div>
      </div>
    </div>
  );
}

export default ViewCategory;
