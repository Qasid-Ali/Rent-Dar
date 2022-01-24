import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { Link } from "react-router-dom";
import { RequestSentModal } from "./RequestSentModal";
import NavBar from "./NavBar";
import { Form } from "react-bootstrap";

function ShowRequest(props) {
  const [products, setProducts] = useState([]);
  const [itemId, setItemId] = useState("");
  // getting products function
  const getProducts = async () => {
    const products = await db.collection("RequestItems").get();
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

  const [showModal, setShowModal] = useState(false);
  // trigger modal
  const triggerModal = (id) => {
    setShowModal(true);
    setItemId(id);
  };
  // hide modal
  const hideModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    if (e.target.value === "all") {
      getProducts();
    } else {
      db.collection("RequestItems")
        .where("itemCategory", "==", e.target.value)
        .onSnapshot((snapshot) => {
          setProducts(snapshot.docs.map((doc) => doc.data()));
        });
    }
  };

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

  return (
    <>
      <NavBar />
      <div className="products-request">
        <div className="request-heading">
          <h3>Lender Request </h3>
        </div>
        <div className="request-card mb-3">
          <div className="request-item-show">
            <div className="request-service">
              <h7 style={{ fontStyle: "italic" }}>
                Total Items : {products.length}
              </h7>
            </div>
            <div className="request-label">
              <label>BROWSE BY CATEGORY</label>
            </div>
            <div className="request-browse-cat">
              <Form.Select onChange={handleChange}>
                <option value="all">All </option>
                {category.map(({ id, category }) => (
                  <option>{category.name}</option>
                ))}
              </Form.Select>
            </div>
          </div>
        </div>
        <div className="request-card">
          <div className="request-item-show">
            <div className="request-img">Items</div>
            <div className="request-cat">Category</div>
            <div className="request-description">Description</div>
            <div className="request-price">Price</div>
            <div className="request-btn">Offers</div>
          </div>
        </div>
        {products.map((individualProduct) => (
          <>
            <div className="request-data">
              <div className="request-item-show">
                <div className="request-img">
                  <img src={individualProduct.itemImg} alt="item-img" />
                </div>
                <div className="request-cat">
                  {individualProduct.itemCategory}
                </div>
                <div className="request-description">
                  {individualProduct.itemDescription}
                </div>
                <div className="request-price">
                  {individualProduct.itemPrice}
                </div>
                <div className="request-btn">
                  <Link onClick={() => triggerModal(individualProduct.ID)}>
                    Send Request
                  </Link>
                </div>
              </div>
              <div className="request-owner">
                Requested by : {individualProduct.itemOwner}
              </div>
            </div>
          </>
        ))}
        {showModal === true && (
          <RequestSentModal itemId={itemId} hideModal={hideModal} />
        )}
        {products.length === 0 && (
          <div className="not-found">
            <p>Not Found that such filter data</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ShowRequest;
