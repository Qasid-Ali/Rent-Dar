import React, { useEffect, useState } from "react";
import { useLocation, useHistory, useParams, Link } from "react-router-dom";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { storage, db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../../context/AuthContext";
import firebase from "firebase";
import EditIcon from "@mui/icons-material/Edit";
import Left from "@mui/icons-material/ArrowBack";
import Upload from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "../../NavBar";

export const EditItem = () => {
  const [progress, setProgress] = useState(0);
  const [itemImage, setItemImage] = useState([]);
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [category, setCategory] = useState([]);
  const [itemImg, setItemImg] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemCond, setItemCond] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [itemCat, setItemCat] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [priceMonth, setPriceMonth] = useState("");

  //error
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [errorPrice, setErrorPrice] = useState("");
  const [errorprice, setErrorprice] = useState("");
  const [errorCat, setErrorCat] = useState("");
  const [errorCon, setErrorCon] = useState("");

  const location = useLocation();
  const history = useHistory();
  const { id } = useParams();
  const path = location.pathname.split("/")[2];

  useEffect(() => {
    const docRef = db
      .collection("items")
      .doc(id)
      .get("/updateitem/" + path)
      .then((doc) => {
        setItemImg(doc.data().itemImg);
        setItemName(doc.data().itemName);
        setItemCat(doc.data().itemCategory);
        setItemDesc(doc.data().itemDescription);
        setPriceHour(doc.data().itemPrice.hour);
        setPriceDay(doc.data().itemPrice.day);
        setPriceMonth(doc.data().itemPrice.month);
        setItemCond(doc.data().itemCondition);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    return docRef;
  }, [id]);

  const { currentUser } = useAuth();
  const [admin, setAdmin] = useState(false);
  const [lender, setLender] = useState(false);
  const [renter, setRenter] = useState(false);
  //fetch userRoles
  useEffect(async () => {
    var getRole = [];
    var currentUserEmail = currentUser.email;
    const snapshot = await db.collection("users").doc(currentUserEmail).get();
    const data = await snapshot.data();
    getRole.push(data);
    setAdmin(getRole[0].userRoles.includes("admin"));
    setLender(getRole[0].userRoles.includes("lender"));
    setRenter(getRole[0].userRoles.includes("renter"));
  }, [currentUser]);

  //fetch category
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

  //image upload handler
  const productImgHandler = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      setItemImage((prevState) => [...prevState, newImage]);
    }
  };
  //upload image on storage database
  const handleUpload = () => {
    const promises = [];
    itemImage.map((image) => {
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

    //all promise
    Promise.all(promises)
      .then(() => {})
      .catch((err) => console.log(err));
  };
  //delete item
  const deleteItem = async (id) => {
    if (window.confirm("Are you sure that you wanted to delete that item ? ")) {
      await db
        .collection("items")
        .doc(id)
        .delete()
        .then(() => {
          {
            admin && <>{history.push("/items")}</>;
          }
          {
            lender && <>{history.push("/dashboard")}</>;
          }
        })
        .catch((err) => setError(err.message));
    }
  };
  // add product
  const addProduct = (e) => {
    e.preventDefault();
    const hour = Number(priceHour);
    const day = Number(priceDay);
    const month = Number(priceMonth);

    if (!itemDesc) {
      setErrorDesc("* Description field is reqired ! ");
      setTimeout(() => {
        setErrorDesc("");
      }, 3000);
    } else if (itemDesc.length < 50 || itemDesc.length > 700) {
      setErrorDesc("* Min 50 or Max 700 character's are required");
      setTimeout(() => {
        setErrorDesc("");
      }, 3000);
    } else if (!itemName) {
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
    } else if (!itemCond) {
      setErrorCon("* Condition field is reqired ! ");
      setTimeout(() => {
        setErrorCon("");
      }, 3000);
    } else {
      db.collection("items")
        .doc(id)
        .update({
          itemName: itemName,
          itemPrice: { hour, day, month },
          itemDescription: itemDesc,
          itemCondition: itemCond,
          itemCategory: itemCat,
          itemDate: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          setSuccessMsg("Updated item successfully");
          setTimeout(() => {
            setSuccessMsg("");
            history.push("/dashboard");
          }, 3000);
        })
        .catch((err) => setError(err.message));
    }
  };

  const DeleteImage = (index, uccc) => {
    db.collection("items")
      .doc(id)
      .update({
        itemImg: firebase.firestore.FieldValue.arrayRemove(uccc),
      });
    db.collection("items")
      .doc(id)
      .get()
      .then((doc) => {
        setItemImg(doc.data().itemImg);
      });
  };

  const uploadImage = () => {
    if (!progress) {
      setError("* Please Upload First");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      db.collection("items")
        .doc(id)
        .update({
          itemImg: urls,
        })
        .then(() => {
          setTimeout(() => {
            setSuccessMsg("");
            setItemImage("");
            setUrls([]);
            setProgress(0);
          }, 3000);
        });
      db.collection("items")
        .doc(id)
        .get()
        .then((doc) => {
          setItemImg(doc.data().itemImg);
        });
    }
  };

  return (
    <>
      <NavBar />
      <div className="me-4">
        <div className="item_display">
          <div>
            <div className="add__item">
              <Card style={{ borderRadius: 15, padding: 15 }}>
                <Card.Body>
                  <div className="container">
                    <div>
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
                      {renter && (
                        <Link to="/dashboard">
                          <Left />
                          Back
                        </Link>
                      )}
                      <br />
                      <br />
                      <h3>UPDATE ITEMS DETAIL</h3>
                      <hr></hr>
                    </div>
                    {successMsg && (
                      <Alert variant="success">{successMsg}</Alert>
                    )}

                    <div>
                      {itemImg.length >= 1 && (
                        <>
                          <h6 className="red">
                            First Delete Items to Upload New One
                          </h6>
                          {itemImg.map((itemImg, index) => {
                            return (
                              <>
                                <img
                                  style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "15px",
                                    margin: "5px",
                                  }}
                                  key={index}
                                  src={itemImg}
                                  className="item_image"
                                />
                                <DeleteIcon
                                  onClick={(e) => DeleteImage(index, itemImg)}
                                  className="red delete_img"
                                />
                              </>
                            );
                          })}
                        </>
                      )}
                    </div>
                    <div>
                      {itemImg.length < 1 && (
                        <>
                          <progress
                            style={{ width: "100%" }}
                            value={progress}
                            max="100"
                          />
                          <br />
                          {urls.map((url, i) => (
                            <>
                              <img
                                key={i}
                                style={{
                                  width: "130px",
                                  height: "130px",
                                  borderRadius: "15px",
                                  margin: "5px",
                                }}
                                src={url}
                                alt="firebase-image"
                              />
                            </>
                          ))}

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
                          <div className="card__btn">
                            <Button variant="primary" onClick={handleUpload}>
                              <Upload /> Upload
                            </Button>
                            <Button variant="primary" onClick={uploadImage}>
                              Upload Image Images
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <label htmlFor="item-description">Description</label>
                      <p className="red">{errorDesc}</p>
                      <textarea
                        type="text"
                        className="form-control"
                        style={{ height: "250px" }}
                        onChange={(e) => setItemDesc(e.target.value)}
                        value={itemDesc}
                      />
                      <br />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
          {/* --------------two------------------- */}
          <div>
            <div className="add__item">
              <Card style={{ borderRadius: 15, padding: 15 }}>
                <Card.Body>
                  <div className="container">
                    <div className="card__btn">
                      <span className="card_btn">
                        Created by :
                        <Link to={`/userDetail/${currentUser.email}`}>
                          {currentUser.email}
                        </Link>
                      </span>
                      {lender && (
                        <>
                          <span>
                            <DeleteIcon
                              onClick={() => deleteItem(id)}
                              className="red"
                            />
                          </span>
                        </>
                      )}
                    </div>
                    <div>
                      <label htmlFor="item-name">Title </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Set Item Title"
                        onChange={(e) => setItemName(e.target.value)}
                        value={itemName}
                      />
                    </div>
                    <p className="red">{errorTitle}</p>
                    <br />
                    <div>
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
                    </div>
                    <p className="red">{errorprice}</p>
                    <br />
                    <label htmlFor="item-condition">Item Condition</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setItemCond(e.target.value)}
                      value={itemCond}
                    />
                    <p className="red">{errorCon}</p>
                    <br />
                    <label>Item Category : {itemCat}</label>
                    <br />
                    <label htmlFor="item-category">Choose a Category</label>
                    <Form.Select
                      value={itemCat}
                      onChange={(e) => setItemCat(e.target.value)}
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
                      UPDATE ITEM
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditItem;
