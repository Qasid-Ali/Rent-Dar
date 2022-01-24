import React, { useEffect, useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { storage, db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import NavBar from "./NavBar";
import { useAuth } from "./context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Left from "@mui/icons-material/ArrowBack";
import Upload from "@mui/icons-material/Upload";

function AddItems(props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [priceMonth, setPriceMonth] = useState("");
  const [cond, setCond] = useState("");
  const [cat, setCat] = useState("");
  const [itemImg, setItemImg] = useState([]);
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [progress, setProgress] = useState(0);

  const { currentUser } = useAuth();
  const history = useHistory();
  const [admin, setAdmin] = useState(false);
  const [lender, setLender] = useState(false);

  //fetch userRoles
  useEffect(async () => {
    var getRole = [];
    var currentUserEmail = currentUser.email;

    const snapshot = await db.collection("users").doc(currentUserEmail).get();
    const data = await snapshot.data();
    getRole.push(data);

    setAdmin(getRole[0].userRoles.includes("admin"));
    setLender(getRole[0].userRoles.includes("lender"));
  }, [currentUser]);

  //error
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [errorPrice, setErrorPrice] = useState("");
  const [errorprice, setErrorprice] = useState("");
  const [errorCat, setErrorCat] = useState("");
  const [errorCon, setErrorCon] = useState("");

  const types = ["image/png", "image/jpeg"]; // image types4
  const [category, setCategory] = useState([]);

  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");

  //getting username
  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("email", "==", user.email)
        .get();
      const data = await query.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchUserName();
  }, [user, loading]);

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
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      if (newImage && types.includes(newImage.type)) {
        setItemImg((prevState) => [...prevState, newImage]);
      } else {
        setItemImg(null);
        setError("Please select a valid image type (jpg or png)");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    }
  };
  const handleUpload = () => {
    const promises = [];
    itemImg.map((image) => {
      const uploadTask = storage.ref(`items-images/${image.name}`).put(image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          await storage
            .ref("items-images")
            .child(image.name)
            .getDownloadURL()
            .then((urls) => {
              setUrls((prevState) => [...prevState, urls]);
            });
        }
      );
    });

    Promise.all(promises)
      .then(() => {
        alert("All images uploaded");
      })
      .catch((err) => console.log(err));
  };

  // add product
  const addProduct = (e) => {
    e.preventDefault();
    const hour = Number(priceHour);
    const day = Number(priceDay);
    const month = Number(priceMonth);

    if (!itemImg || !progress) {
      setError("* Upload Image ! ");
      setError("* Upload Image first ! ");
      setTimeout(() => {
        setError("");
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
    } else if (!title) {
      setErrorTitle("* Title field is reqired ! ");
      setTimeout(() => {
        setErrorTitle("");
      }, 3000);
    } else if (!hour || !day || !month) {
      setErrorprice("* Price fields are reqired ! (Hour, Day, Month)");
      setTimeout(() => {
        setErrorprice("");
      }, 3000);
    } else if (hour < 2 || day < 2 || month < 2) {
      setErrorprice(
        "* Price cannot be negative or 0 ! Must be Greater than 1 "
      );
      setTimeout(() => {
        setErrorprice("");
      }, 3000);
    } else if (!cond) {
      setErrorCon("* Condition field is reqired ! ");
      setTimeout(() => {
        setErrorCon("");
      }, 3000);
    } else if (!cat) {
      setErrorCat("* Category field is reqired ! ");
      setTimeout(() => {
        setErrorCat("");
      }, 3000);
    } else {
      db.collection("items")
        .add({
          name: name,
          email: user.email,
          itemName: title,
          quantity: 1,
          itemPrice: { hour, day, month },
          itemDescription: desc,
          itemCondition: cond,
          inprogress: true,
          itemVerification: false,
          itemCategory: cat,
          itemDate: firebase.firestore.FieldValue.serverTimestamp(),
          itemImg: urls,
        })
        .then(() => {
          setSuccessMsg("Item added successfully");
          setProgress(0);
          setTitle("");
          setPriceHour("");
          setPriceDay("");
          setPriceMonth("");
          setDesc("");
          setCond("");
          setCat("");
          setItemImg("");
          setUrls([]);
          setProgress("");
          setError("");
          setErrorCat("");
          setErrorDesc("");
          setErrorPrice("");
          setErrorprice("");
          setErrorTitle("");
          document.getElementById("file").value = "";
          setTimeout(() => {
            setSuccessMsg("");
            history.push("/dashboard");
          }, 3000);
        })
        .catch((err) => setError(err.message));
    }
  };

  return (
    <>
      <NavBar />
      <form autoComplete="off" className="form-group">
        <div className="form-container">
          <div className="item_display">
            {/* one */}
            <div>
              <div className="add__item">
                <Card style={{ borderRadius: 15, padding: 15 }}>
                  <Card.Body>
                    <div className="container">
                      {admin && (
                        <Link to="/items">
                          <Left />
                          Back
                        </Link>
                      )}
                      {lender && (
                        <Link to="/dashboard">
                          <Left />
                          Back
                        </Link>
                      )}

                      <br />

                      <br />
                      <h2>ADD ITEMS</h2>
                      <hr />
                    </div>
                    <br></br>
                    {successMsg && (
                      <Alert variant="success">{successMsg}</Alert>
                    )}
                    <progress
                      style={{ width: "100%" }}
                      value={progress}
                      max="100"
                    />
                    <br />
                    <p className="red">{error}</p>
                    <input
                      type="file"
                      multiple
                      className="form-control"
                      id="file"
                      required
                      onChange={productImgHandler}
                    />
                    <br />
                    <Button variant="primary" onClick={handleUpload}>
                      <Upload /> Upload
                    </Button>
                    <br />
                    <br />
                    {urls.map((url, i) => (
                      <>
                        <img
                          key={i}
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "15px",
                            margin: "5px",
                          }}
                          src={url}
                          alt="firebase-image"
                        />
                      </>
                    ))}
                    <br />
                    <label htmlFor="item-description">Description</label>
                    <p className="red">{errorDesc}</p>
                    <textarea
                      type="text"
                      className="form-control"
                      style={{ height: "250px" }}
                      onChange={(e) => setDesc(e.target.value)}
                      value={desc}
                    />
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </div>
            {/* two */}
            <div>
              <div className="add__item">
                <Card style={{ borderRadius: 15, padding: 15 }}>
                  <Card.Body>
                    <div className="container">
                      <label htmlFor="item-name">Title </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Set Item Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                      <p className="red">{errorTitle}</p>
                      <br />
                      <label htmlFor="item-price">Set Your Item Pricing</label>
                      <p className="red">{errorPrice}</p>
                      <div className="price__btn">
                        <div>
                          <label>Hourly Price</label>
                          <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setPriceHour(e.target.value)}
                            value={priceHour}
                          />
                        </div>
                        <div>
                          <label>One Day Price</label>
                          <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setPriceDay(e.target.value)}
                            value={priceDay}
                          />
                        </div>
                        <div>
                          <label>Monthly Price</label>
                          <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setPriceMonth(e.target.value)}
                            value={priceMonth}
                          />
                        </div>
                      </div>
                      <p className="red">{errorprice}</p>
                      <br />
                      <label htmlFor="item-condition">Item Condition</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setCond(e.target.value)}
                        value={cond}
                      />
                      <p className="red">{errorCon}</p>
                      <br />
                      <label htmlFor="item-category">Choose a Category</label>
                      <Form.Select
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                      >
                        <option>Select Your Category </option>
                        {category.map(({ id, category }) => (
                          <option>{category.name}</option>
                        ))}
                      </Form.Select>
                      <p className="red">{errorCat}</p>
                      <br />

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
                        onClick={addProduct}
                      >
                        ADD ITEM
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddItems;
