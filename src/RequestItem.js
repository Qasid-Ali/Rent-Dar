import React, { useEffect, useState } from "react";
import { Button, Card, Form, Alert, Container } from "react-bootstrap";
import { storage, db } from "./firebase";
import firebase from "firebase";
import NavBar from "./NavBar";
import { Link, useHistory } from "react-router-dom";
import Left from "@mui/icons-material/ArrowBack";
import { useAuth } from "./context/AuthContext";

function RequestItem(props) {
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("");
  const [itemImg, setItemImg] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const history = useHistory();
  const { currentUser } = useAuth();

  const types = ["image/png", "image/jpeg"]; // image types4

  const [category, setCategory] = useState([]);

  useEffect(() => {
    db.collection("category")
      .get()
      .then((docs) => {
        setCategory(
          docs.docs.map((docs) => ({
            id: docs.id,
            category: docs.data(),
          }))
        );
      });
  }, []);

  const productImgHandler = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setItemImg(selectedFile);
      setError("");
    } else {
      setItemImg(null);
      setError("Please select a valid image type (jpg or png)");
    }
  };
  //error

  const [errorDesc, setErrorDesc] = useState("");
  const [errorprice, setErrorprice] = useState("");
  const [errorCat, setErrorCat] = useState("");

  // add product
  const addRequestProduct = (e) => {
    e.preventDefault();

    if (!price) {
      setErrorprice("* Price fields are reqired !");
      setTimeout(() => {
        setErrorprice("");
      }, 3000);
    } else if (price < 2) {
      setErrorprice(
        "* Price cannot be negative or 0 ! Must be Greater than 1 "
      );
      setTimeout(() => {
        setErrorprice("");
      }, 3000);
    } else if (!cat) {
      setErrorCat("* Category field is reqired ! ");
      setTimeout(() => {
        setErrorCat("");
      }, 3000);
    } else if (!desc) {
      setErrorDesc("* Description field is reqired ! ");
      setTimeout(() => {
        setErrorDesc("");
      }, 3000);
    } else if (desc.length < 50 || desc.length > 700) {
      setErrorDesc("* Min 50 or Max 700 character's are required");
      setTimeout(() => {
        setErrorDesc("");
      }, 3000);
    } else {
      const uploadTask = storage
        .ref(`reqitems-images/${itemImg.name}`)
        .put(itemImg);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (err) => setError(err.message),
        () => {
          storage
            .ref("reqitems-images")
            .child(itemImg.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("RequestItems")
                .add({
                  itemPrice: Number(price),
                  itemDescription: desc,
                  itemCategory: cat,
                  itemDate: firebase.firestore.FieldValue.serverTimestamp(),
                  itemImg: url,
                  itemOwner: currentUser.email,
                })
                .then(() => {
                  setSuccessMsg("Requested successfully");
                  setPrice(0);
                  setDesc("");
                  setCat("");
                  setItemImg("");
                  setError("");
                  document.getElementById("file").value = "";
                  setTimeout(() => {
                    setSuccessMsg("");
                    history.push("/dashboard");
                  }, 3000);
                })
                .catch((err) => setError(err.message));
            });
        }
      );
    }
  };

  return (
    <>
      <NavBar />
      <div className="form-container d-flex align-items-center justify-content-center">
        <div className="add__item">
          <Card style={{ borderRadius: 15, padding: 15 }}>
            <Card.Body>
              <div className="container">
                <Link to="/dashboard">
                  <Left />
                  Back
                </Link>
                <br />
                <br />
                <h2>REQUEST ITEMS</h2>
                <hr />
                {error && <Alert variant="danger">{error}</Alert>}
                {successMsg && <Alert variant="success">{successMsg}</Alert>}
                <form
                  autoComplete="off"
                  className="form-group"
                  onSubmit={addRequestProduct}
                >
                  <label htmlFor="item-img">Attach File </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    required
                    onChange={productImgHandler}
                  />
                  <br />
                  <label htmlFor="item-price">
                    What is your Price for this ?
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                  />
                  <p className="red">{errorprice}</p>
                  <br />
                  <label htmlFor="item-category">Choose a category</label>
                  <Form.Select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                  >
                    <option>Select Your Category</option>
                    {category.map(({ id, category }) => (
                      <option>{category.name}</option>
                    ))}
                  </Form.Select>
                  <p className="red">{errorCat}</p>
                  <br />
                  <label htmlFor="item-description">
                    Describe the item you're looking to rent - please be as
                    detailed as possible:
                  </label>
                  <textarea
                    type="text"
                    placeholder="I'm looking for...."
                    className="form-control"
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                  />
                  <p className="red">{errorDesc}</p>
                  <br />
                  <Button variant="primary" type="submit" className="w-100">
                    Submit Request
                  </Button>
                </form>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default RequestItem;
