import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import NavBar from "../../NavBar";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Button, Form } from "react-bootstrap";

function ItemManage(props) {
  const [products, setProducts] = useState([]);
  // getting products function
  const getProducts = async () => {
    const products = await db.collection("items").get();
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

  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(products.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  //--------------------------

  // handle filter
  const filterData = (value) => {
    if (value == "Verify") {
      db.collection("items")
        .where("itemVerification", "==", true)
        .onSnapshot((snapshot) => {
          setProducts(snapshot.docs.map((doc) => doc.data()));
        });
    } else if (value == "Not-Verify") {
      db.collection("items")
        .where("itemVerification", "==", false)
        .onSnapshot((snapshot) => {
          setProducts(snapshot.docs.map((doc) => doc.data()));
        });
    }
  };
  const handleReset = () => {
    getProducts();
  };

  const handleChange = (e) => {
    if (e.target.value === "all") {
      getProducts();
    } else {
      db.collection("items")
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
      <div className="filter-btn mt-3">
        <h5>Filter Data : </h5>
        <Button variant="success" onClick={() => filterData("Verify")}>
          Verified Items
        </Button>
        <Button variant="danger" onClick={() => filterData("Not-Verify")}>
          Not-Verified Items
        </Button>
        <Button type="submit" variant="primary" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className="products-request">
        <div className="request-heading">
          <h3>Items </h3>
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
            <div className="request-title">Title</div>
            <div className="request-price">Price</div>
            <div className="request-con">Condition</div>
            <div className="request-description">Description</div>
          </div>
        </div>
        {products
          .slice(pagesVisited, pagesVisited + usersPerPage)
          .map((individualProduct) => (
            <>
              <div className="request-data">
                <Link
                  className="underline"
                  to={`/itemDetail/${individualProduct.itemId}`}
                >
                  <div className="request-item-show">
                    <div className="request-img">
                      <img src={individualProduct.itemImg} alt="item-img" />
                    </div>
                    <div className="request-cat">
                      {individualProduct.itemCategory}
                    </div>
                    <div className="request-title">
                      {individualProduct.itemName}
                    </div>
                    <div className="request-price">
                      PKR {individualProduct.itemPrice.day}
                    </div>
                    <div className="request-con">
                      {individualProduct.itemCondition}
                    </div>
                    <div className="request-description">
                      {individualProduct.itemDescription}
                    </div>
                  </div>

                  <div className="request-owner">
                    Created by :
                    <Link to={`/userDetail/${individualProduct.email}`}>
                      {individualProduct.email}
                    </Link>
                  </div>
                </Link>
              </div>
            </>
          ))}
        {products.length === 0 && (
          <div className="not-found">
            <p>Not Found that such filter data</p>
          </div>
        )}
      </div>

      {products.length > 9 && (
        <div>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      )}
    </>
  );
}

export default ItemManage;
