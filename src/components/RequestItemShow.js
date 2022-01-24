import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import NavBar from "../NavBar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";

function RequestItemShow(props) {
  const [products, setProducts] = useState([]);
  const { currentUser } = useAuth();
  // getting products function
  const getProducts = async () => {
    const products = await db
      .collection("RequestItems")
      .where("itemOwner", "==", currentUser.email)
      .get();
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data,
      });
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray);
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteRequest = (id) => {
    db.collection("RequestItems").doc(id).delete();
    getProducts();
  };

  const [data, setData] = useState({});
  const searchData = (id) => {
    db.collection("requests")
      .where("itemId", "==", id)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  };

  return (
    <>
      <NavBar />
      <div className="products-box mt-5">
        {products.map((individualProduct) => (
          <>
            <div className="product">
              <div className="product-img">
                <img src={individualProduct.itemImg} alt="product-img" />
              </div>
              <div className="card__info">
                <p className="product-text description">
                  {individualProduct.itemDescription}
                </p>
                <p>{individualProduct.itemCategory}</p>
                <div className="requestItem-show">
                  <p>
                    <strong> PKR </strong>
                    {individualProduct.itemPrice}
                  </p>
                  <Link onClick={() => searchData(individualProduct.ID)}>
                    View All Requests
                  </Link>
                  <DeleteIcon
                    onClick={() => deleteRequest(individualProduct.ID)}
                    className="red"
                  />
                </div>
              </div>
            </div>
          </>
        ))}
        {products.length === 0 && (
          <>
            <div className="not-found">
              <h6>Empty.No items Found</h6>
              <Link to="/dashboard">Go Back Homepage</Link>
            </div>
          </>
        )}
      </div>
      <div>
        <table className="styled-table">
          {Object.keys(data).map((id, index) => {
            return (
              <tbody>
                <tr>
                  <td>{index}</td>
                  <td>
                    <Avatar
                      style={{
                        backgroundColor: "lightgrey",
                        color: "#000",
                        textTransform: "capitalize",
                      }}
                    >
                      {data[index].userEmail[0]}
                    </Avatar>
                  </td>
                  <td>
                    <Link to={`/userDetail/${data[index].userEmail}`}>
                      {data[index].userEmail}
                    </Link>
                  </td>
                  <td>{data[index].requestDescription}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
}

export default RequestItemShow;
