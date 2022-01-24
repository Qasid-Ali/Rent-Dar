import React, { useEffect, useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import Left from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "../../NavBar";
import { Alert, Form, Button } from "react-bootstrap";

const ItemDetail = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { currentUser } = useAuth();
  const [user] = useAuthState(auth);

  const [renter, setRenter] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [lender, setLender] = useState(false);

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

  const history = useHistory();

  const location = useLocation();
  const itemID = location.pathname.split("/")[2];

  useEffect(() => {
    searchData();
  }, [itemID]);

  //search data from item collection
  const searchData = () => {
    db.collection("items")
      .where("itemId", "==", itemID)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  };

  //delete item
  const deleteItem = async (id) => {
    if (window.confirm("Are you sure that you wanted to delete that item ? ")) {
      await db
        .collection("items")
        .doc(id)
        .delete()
        .then(() => {
          setSuccessMsg(" Item Deleted Successfully ");
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

  //handle select
  const handleChange = (e) => {
    if (e.target.value == "Verified") {
      setError("");
      db.collection("items").doc(itemID).update({
        itemVerification: true,
      });
    } else if (e.target.value == "Not-Verified") {
      setError("");
      db.collection("items").doc(itemID).update({
        itemVerification: false,
      });
    } else if (e.target.value == "no") {
      setError(" * Not Updated..Please Select any option ");
    }
  };

  return (
    <>
      <NavBar />
      <div className="alert_msg">
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
      </div>
      <div className="item_display">
        {Object.keys(data).map((id, index) => {
          return (
            <>
              <div key={id} className="item">
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
                </div>
                <div>
                  <div>
                    <h6>Category / {data[index].itemCategory}</h6>
                  </div>
                </div>
                <div className="item__img">
                  <img
                    src={data[index].itemImg}
                    alt="item-img"
                    className="item_image_display"
                  />
                </div>
                <hr />
                <div className="text-muted">
                  Published on {data[index].itemDate.toDate().toDateString()}
                </div>
                <hr />
                <div>
                  <h2>Description</h2>
                  {data[index].itemDescription}
                </div>
              </div>
              <div className="item_pay">
                <div className="card__btn">
                  <span className="card_btn">
                    Created by :
                    <Link to={`/userDetail/${data[index].email}`}>
                      {data[index].email}
                    </Link>
                  </span>
                  {user && !renter && (
                    <>
                      <span>
                        <DeleteIcon
                          onClick={() => deleteItem(data[index].itemId)}
                          className="red"
                        />
                      </span>
                    </>
                  )}
                  {lender && !renter && (
                    <>
                      <span>
                        <Link to={`/updateitem/${data[index].itemId}`}>
                          <EditIcon style={{ color: "grey" }} />
                        </Link>
                      </span>
                    </>
                  )}
                </div>
                <div>
                  <strong> Item Name :</strong> {data[index].itemName}
                </div>
                <div>
                  <strong> Condition :</strong> {data[index].itemCondition}
                </div>
                <div className="product-text title">
                  Pricing for this Item :
                </div>
                <div className="card__btn">
                  <span className="price_border">
                    PKR {data[index].itemPrice.hour} / hour
                  </span>
                  <span className="price_border">
                    PKR
                    {data[index].itemPrice.day} / day
                  </span>
                  <span className="price_border">
                    PKR
                    {data[index].itemPrice.month} / month
                  </span>
                </div>
                <div>
                  <strong> Item Verification Status :</strong>
                  <span
                    className={`${
                      data[index].itemVerification ? "verify" : "not-verify"
                    }`}
                  >
                    {data[index].itemVerification
                      ? " Verified "
                      : " Not-Verified "}
                  </span>
                </div>
                <div>
                  {admin && (
                    <>
                      <strong> Update Item Verification Status </strong>
                      <EditIcon />
                      <div>
                        <Form>
                          <Form.Select onChange={handleChange}>
                            <option value="no"> Select Your Status </option>
                            <option value="Verified">Verified</option>
                            <option value="Not-Verified">Not-Verified</option>
                          </Form.Select>
                        </Form>
                        <p className="red">{error}</p>
                      </div>
                    </>
                  )}

                  {renter && (
                    <>
                      <div>
                        <Link to={`/item/${data[index].itemId}`}>
                          <Button variant="primary" style={{ width: "100%" }}>
                            RENT IT
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ItemDetail;
