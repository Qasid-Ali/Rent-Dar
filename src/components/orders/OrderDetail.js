import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import Left from "@mui/icons-material/ArrowBack";
import firebase from "firebase";
import NavBar from "../../NavBar";
import { Alert, Button } from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";

function OrderDetail(props) {
  const [feedback, setFeedback] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [renter, setRenter] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [lender, setLender] = useState(false);

  const { currentUser } = useAuth();

  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [itemImg, setItemImg] = useState("");
  const [itemCat, setItemCat] = useState("");
  const [price, setPrice] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [lenderEmail, setlenderEmail] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState();
  const [method, setMethod] = useState("");
  const [inprogress, setInprogress] = useState();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const docRef = db
      .collection("Orders")
      .doc(path)
      .get("/orderDetail/" + path)
      .then((doc) => {
        setItemId(doc.data().itemId);
        setItemImg(doc.data().itemImg);
        setItemName(doc.data().itemName);
        setItemCat(doc.data().itemCategory);
        setItemDesc(doc.data().itemDescription);
        setPrice(doc.data().totalprice);
        setCity(doc.data().city);
        setAddress(doc.data().residentialAddress);
        setMethod(doc.data().method);
        setlenderEmail(doc.data().lenderEmail);
        setRenterEmail(doc.data().renterEmail);
        setInprogress(doc.data().inProgress);
        setStatus(doc.data().feedbackStatus);
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
      .where("orderId", "==", path)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  };

  const submitRequest = () => {
    if (!feedback) {
      setError("*Field cannot be empty!");
    } else {
      db.collection("feedback")
        .add({
          itemId: itemId,
          orderId: path,
          feedback: feedback,
          userEmail: renterEmail,
          feedbackDate: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          setSuccessMsg("Thanks For your Feedback..");
          setTimeout(() => {
            setSuccessMsg("");
            setError("");
            setFeedback("");
          }, 3000);
        });
      db.collection("Orders").doc(path).update({
        feedbackStatus: true,
      });
    }
  };

  //fetch userRoles
  useEffect(async () => {
    var getRole = [];
    var currentUserEmail = currentUser.email;

    const snapshot = await db.collection("users").doc(currentUserEmail).get();
    const data = await snapshot.data();
    getRole.push(data);

    setRenter(getRole[0].userRoles.includes("renter"));
    setAdmin(getRole[0].userRoles.includes("admin"));
    setLender(getRole[0].userRoles.includes("lender"));
  }, [currentUser]);

  const handleChange = (e) => {
    if (e.target.value === "ok") {
      db.collection("Orders").doc(path).update({
        inProgress: true,
      });
      setInprogress(true);
      db.collection("items").doc(itemId).update({
        inprogress: true,
      });
    }
  };

  return (
    <>
      <NavBar />

      <div style={{ backgroundColor: "#f3f3f3" }}>
        <div className="item_display">
          <div className="item">
            <div>
              <Link to="/orders">
                <Left />
                Back
              </Link>
            </div>
            <div className="card__btn">
              <div>
                <h3 style={{ textTransform: "capitalize" }}>{itemName}</h3>
                <p>
                  Item ID : <Link to={`/item/${itemId}`}>{itemId}</Link>
                </p>
              </div>
              <div>
                <h3>Price</h3> PKR {price}
              </div>
            </div>
            <div>
              <div className="order__btn">
                {renter && <h7>Lender : {lenderEmail}</h7>}
                {lender && <h7>Renter : {renterEmail}</h7>}
                <h7>
                  <strong>Date ordered </strong> | <h8>{itemDate}</h8>
                </h7>
              </div>
            </div>
            <div>
              {admin && (
                <div className="card__btn">
                  <h7>Lender : {lenderEmail}</h7>
                  <h7>Renter : {renterEmail}</h7>
                </div>
              )}
            </div>
            <div>
              <hr />
              <h6>Order Number : {path}</h6>
              <hr />
            </div>
            <div className="item__img">
              <img
                src={itemImg}
                alt="item-img"
                className="item_image_display"
              />
            </div>
            <div>
              <h2>Description</h2>
              <hr />
              {itemDesc}
              <hr />
            </div>
          </div>
          <div className="item_pay">
            <div className="text-center">
              <h4>ORDER DETAIL</h4>
            </div>
            <div className="card__btn">
              <h6>City : {city}</h6>
              <h6>Address : {address}</h6>
            </div>
            <div className="card__btn">
              <h6>Payement Method : {method}</h6>
              <h6>Price : {price}</h6>
            </div>
            <div>
              Order Status :
              <h7
                className={`status-check-completion ${
                  inprogress ? "complete" : "inprogress"
                }`}
              >
                {inprogress ? "Completed" : "In Progress"}
              </h7>
            </div>
            {renter && (
              <>
                {inprogress ? (
                  <>
                    {status ? (
                      <>
                        <div>
                          <hr />
                          <h6 className="item-heading-color">Your Feedback</h6>
                          <hr />
                          {Object.keys(data).map((id, index) => {
                            return (
                              <>
                                <div
                                  key={id}
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
                                      fontWeight: "500",
                                      paddingTop: "14px",
                                    }}
                                  >
                                    {data[index].userEmail}
                                  </p>
                                </div>

                                <div className="form-control">
                                  {data[index].feedback}
                                </div>

                                <hr />
                              </>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div>
                        <form>
                          {successMsg && (
                            <Alert variant="success">{successMsg}</Alert>
                          )}
                          <label>Give Feedback to this Item</label>
                          <br />
                          <p className="red">{error}</p>
                          <textarea
                            type="text"
                            placeholder="Give Your Feedback.."
                            className="form-control"
                            style={{ height: "250px" }}
                            onChange={(e) => setFeedback(e.target.value)}
                            value={feedback}
                          />
                          <Button className="mt-2" onClick={submitRequest}>
                            Submit Feedback
                          </Button>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <label>Mark You Order as Completed</label>
                    <select onChange={handleChange} className="form-control">
                      <option>Mark You Order</option>
                      <option value="ok">Completed</option>
                    </select>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
