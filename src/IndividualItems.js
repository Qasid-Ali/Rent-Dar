import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { useLocation, useParams } from "react-router";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Modal } from "./Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Container, Form, Button } from "react-bootstrap";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Left from "@mui/icons-material/ArrowBack";
import Right from "@mui/icons-material/ArrowForward";
import NavBar from "./NavBar";
import { useAuth } from "./context/AuthContext";
import firebase from "firebase";
import Avatar from "@material-ui/core/Avatar";

toast.configure();

export const IndividualItems = ({ id }) => {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  // show modal state
  const [showModal, setShowModal] = useState(false);

  // trigger modal
  const triggerModal = () => {
    if (!totalPrice) {
      setError("*Please Select your Price ");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      setShowModal(true);
    }
  };

  // hide modal
  const hideModal = () => {
    setShowModal(false);
  };

  const location = useLocation();
  const { itemId } = useParams();
  const path = location.pathname.split("/")[2];

  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemCond, setItemCond] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [itemImg, setItemImg] = useState("");
  const [itemCat, setItemCat] = useState("");
  const [priceHour, setPriceHour] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [priceMonth, setPriceMonth] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState();
  const [itemOwner, setItemOwner] = useState("");

  useEffect(() => {
    const docRef = db
      .collection("items")
      .doc(itemId)
      .get("/item/" + path)
      .then((doc) => {
        setItemImg(doc.data().itemImg);
        setItemName(doc.data().itemName);
        setItemCat(doc.data().itemCategory);
        setItemDesc(doc.data().itemDescription);
        setPrice(doc.data().totalprice);
        setPriceHour(doc.data().itemPrice.hour);
        setPriceDay(doc.data().itemPrice.day);
        setPriceMonth(doc.data().itemPrice.month);
        setItemCond(doc.data().itemCondition);
        setQty(doc.data().quantity);
        setItemOwner(doc.data().email);
        setItemDate(doc.data().itemDate.toDate().toDateString());
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    return docRef;
  });

  const [data, setData] = useState({});
  //fetch feedback
  useEffect(() => {
    searchData();
  }, [path]);

  const searchData = () => {
    db.collection("feedback")
      .where("itemId", "==", path)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  };

  //charging payemnt
  const history = useHistory();
  const handleToken = async (token) => {
    const abc = { price };
    const response = await axios.post("http://localhost:8080/checkout", {
      token,
      abc,
    });

    const itemData = await db.collection("items").doc(itemId).get();
    console.log(response);
    let { status } = response.data;
    console.log(status);
    if (status === "success") {
      db.collection("Orders").add({
        renterName: token.card.name,
        lenderName: itemData.data().name,
        cardId: token.card.id,
        method: "Card",
        itemCategory: itemData.data().itemCategory,
        renterEmail: currentUser.email,
        lenderEmail: itemData.data().email,
        totalprice: price,
        city: token.card.address_city,
        residentialAddress: token.card.address_line1,
        itemId: itemId,
        itemName: itemData.data().itemName,
        itemImg: itemData.data().itemImg,
        itemDescription: itemData.data().itemDescription,
        itemDate: firebase.firestore.FieldValue.serverTimestamp(),
        inProgress: false,
      });
      db.collection("items")
        .doc(itemId)
        .update({
          quantity: Number(1),
          totalprice: 0,
        });
      history.push("/dashboard");
      toast.success("Your item has been rented successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } else {
      alert("Something went wrong in checkout");
    }
  };
  //handle selection for price to select price and store in total price
  const [totalPrice, setTotalPrice] = useState("");
  const handleChange = (e) => {
    setTotalPrice(e.target.value);
    if (qty == 1) {
      db.collection("items").doc(itemId).update({
        totalprice: e.target.value,
      });
    }
    if (qty > 1) {
      db.collection("items")
        .doc(itemId)
        .update({
          totalprice: e.target.value * qty,
        });
    }
  };
  //global variable
  let Product;
  //increase Time
  const handleIncrease = () => {
    Product = qty + 1;
    setQty(Product);
    db.collection("items")
      .doc(itemId)
      .update({
        quantity: Number(Product),
        totalprice: Product * totalPrice,
      })
      .then(() => {
        console.log("increment added");
      });
  };
  //Decrease Time
  const handleDecrease = () => {
    if (qty > 1) {
      Product = qty - 1;
      setQty(Product);
      db.collection("items")
        .doc(itemId)
        .update({
          quantity: Number(Product),
          totalprice: Product * totalPrice,
        })
        .then(() => {
          console.log("decrement added");
        });
    }
  };

  const index = -1;

  //handle image slider
  const length = itemImg.length;
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(itemImg) || itemImg.length <= 0) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="me-4">
        <div className="item_display">
          <div className="item">
            <div>
              <Link to="/dashboard">
                <Left />
                Back
              </Link>
            </div>
            <div>
              <h6>Category / {itemCat}</h6>
            </div>
            <hr></hr>
            <div className="item__img">
              <div>
                <Left size={40} className="icons" onClick={prevSlide} />
              </div>
              <div>
                {itemImg.map((itemImg, index) => {
                  return (
                    <div
                      className={index === current ? "slide active" : "slide"}
                      key={index}
                    >
                      {index === current && (
                        <img src={itemImg} className="item_image" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <Right size={40} className="icons" onClick={nextSlide} />
              </div>
            </div>
            <div className="text-muted">Published on {itemDate}</div>
            <hr />
            <div>
              <h2 className="item-heading-color">Description</h2>
              {itemDesc}
            </div>
            <hr />
            <br />
            <div>
              <h2 className="item-heading-color">Feedback</h2>
              {Object.keys(data).map((id, index) => {
                return (
                  <>
                    <div key={id} className="card__btn">
                      <div
                        className="card_btn"
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          style={{
                            backgroundColor: "lightgrey",
                            color: "#000",
                            textTransform: "capitalize",
                          }}
                        >
                          {data[index].userEmail[0]}
                        </Avatar>
                        <p
                          style={{
                            paddingTop: "13px",
                            fontWeight: "500",
                            paddingLeft: "3px",
                          }}
                        >
                          {data[index].userEmail}
                        </p>
                      </div>
                      <div style={{ fontStyle: "italic", paddingTop: "15px" }}>
                        <p>
                          on {data[index].feedbackDate.toDate().toDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="form-control">{data[index].feedback}</div>
                    </div>
                    <hr />
                  </>
                );
              })}
            </div>
          </div>
          <div className="item_pay">
            <div className="card__btn">
              <span>
                <strong>Created by : </strong>
                {itemOwner}
              </span>
              <Link
                to={`/message/${itemOwner}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="primary">Contact Seller</Button>
              </Link>
            </div>
            <div>
              <strong className="item-heading-color"> Item Name:</strong>{" "}
              {itemName}
            </div>
            <hr />
            <div>
              <strong className="item-heading-color"> Condition :</strong>{" "}
              {itemCond}
            </div>
            <div>
              <Form>
                <h6>Select Your Price </h6>
                <Form.Select onChange={handleChange}>
                  <option value={priceHour}>PKR {priceHour} / Hour</option>
                  <option value={priceDay}>PKR {priceDay} / Day</option>
                  <option value={priceMonth}>PKR {priceMonth} / Month</option>
                </Form.Select>
              </Form>
              <div>
                <h7>You Selected : {totalPrice} </h7>
              </div>
            </div>
            <div>
              <h6>Add more time ( hour/ day / Month ) </h6>
            </div>
            <div className="card__btn">
              <div onClick={handleDecrease}>
                <MinusOutlined size={20} />
              </div>
              <div>{qty} &nbsp; ( hour/ day / Month )</div>
              <div onClick={handleIncrease}>
                <PlusOutlined size={20} />
              </div>
            </div>

            <div>
              <h6>Total Price : {price}</h6>
              <p className="red">{error}</p>
            </div>
            <hr></hr>
            <div>
              <h6 className="item-heading-color">Payement Options</h6>
              <hr></hr>
              <div className="card__btn">
                <StripeCheckout
                  stripeKey="pk_test_51K3nPOK8pT1hdRwQlyxkc90XeljMzxWPpdMi3TpREta9IBGELQFMbZKZeux7ZxhNzcYNVvi1CurBmD7gZmLo8qdN0090d3dItw"
                  token={handleToken}
                  billingAddress
                  name="Rent Item"
                  amount={(price * 100) / 150}
                ></StripeCheckout>
                <h6 className="text-center mt-10">OR</h6>
                <Button variant="primary" onClick={() => triggerModal()}>
                  Cash on Delivery
                </Button>
              </div>
            </div>
            {showModal === true && (
              <Modal itemId={itemId} price={price} hideModal={hideModal} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualItems;
