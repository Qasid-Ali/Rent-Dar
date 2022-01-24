import React, { useEffect, useState } from "react";
import NavBar from "../../NavBar";
import { db, auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Button, Form } from "react-bootstrap";

function Orders(props) {
  const { currentUser } = useAuth();
  const [user] = useAuthState(auth);

  const [renter, setRenter] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [lender, setLender] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLend, setProductsLend] = useState([]);
  const [productsRent, setProductsRent] = useState([]);
  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(products.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  //--------------------------

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

  // getting products function
  const getProducts = async () => {
    const products = await db.collection("Orders").get();
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

  // getting products function
  const getProductsLend = async () => {
    const productsLend = await db
      .collection("Orders")
      .where("lenderEmail", "==", currentUser.email)
      .get();
    const productsArray = [];
    for (var snap of productsLend.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data,
      });
      if (productsArray.length === productsLend.docs.length) {
        setProductsLend(productsArray);
      }
    }
  };

  useEffect(() => {
    getProductsLend();
  }, []);

  // getting products function
  const getProductsRent = async () => {
    const productsRent = await db
      .collection("Orders")
      .where("renterEmail", "==", currentUser.email)
      .get();
    const productsArray = [];
    for (var snap of productsRent.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({
        ...data,
      });
      if (productsArray.length === productsRent.docs.length) {
        setProductsRent(productsArray);
      }
    }
  };

  useEffect(() => {
    getProductsRent();
  }, []);

  const handleChange = (e) => {
    if (e.target.value === "all") {
      getProducts();
      getProductsLend();
      getProductsRent();
    } else {
      db.collection("Orders")
        .where("itemCategory", "==", e.target.value)
        .onSnapshot((snapshot) => {
          setProducts(snapshot.docs.map((doc) => doc.data()));
          setProductsLend(snapshot.docs.map((doc) => doc.data()));
          setProductsRent(snapshot.docs.map((doc) => doc.data()));
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
      {admin && (
        <>
          <div className="products-request">
            <div className="request-heading">
              <h3>Orders </h3>
            </div>
            <div className="request-card mb-3">
              <div className="request-item-show">
                <div className="request-service">
                  <h7 style={{ fontStyle: "italic" }}>
                    Total Orders : {products.length}
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
                <div className="request-con">Payement Method</div>
                <div className="request-cat">Details</div>
              </div>
            </div>
            {products
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map((individualProduct) => (
                <>
                  <div className="request-data">
                    <div className="request-item-show">
                      <div className="request-img">
                        <img
                          style={{ height: "80px" }}
                          src={individualProduct.itemImg}
                          alt="item-img"
                        />
                      </div>
                      <div className="request-cat">
                        {individualProduct.itemCategory}
                      </div>
                      <div className="request-title">
                        {individualProduct.itemName}
                      </div>
                      <div className="request-price">
                        PKR {individualProduct.totalprice}
                      </div>
                      <div className="request-con">
                        {individualProduct.method}
                      </div>
                      <div className="request-cat">
                        <Link to={`/orderDetail/${individualProduct.ID}`}>
                          See More
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            {products.length === 0 && (
              <div className="not-found">
                <p>Not Found that such filter data</p>
              </div>
            )}
          </div>
        </>
      )}

      {lender && (
        <>
          <div className="products-request">
            <div className="request-heading">
              <h3>My Orders </h3>
            </div>
            <div className="request-card mb-3">
              <div className="request-item-show">
                <div className="request-service">
                  <h7 style={{ fontStyle: "italic" }}>
                    Total Orders : {productsLend.length}
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
            {productsLend.length > 1 && (
              <>
                <div className="request-card">
                  <div className="request-item-show">
                    <div className="request-img">Items</div>
                    <div className="request-cat">Category</div>
                    <div className="request-title">Title</div>
                    <div className="request-price">Price</div>
                    <div className="request-con">Payement Method</div>
                    <div className="request-status">Status</div>
                  </div>
                </div>
                {productsLend.map((individualProduct) => (
                  <>
                    <div className="request-data">
                      <Link
                        className="underline"
                        to={`/orderDetail/${individualProduct.ID}`}
                      >
                        <div className="request-item-show">
                          <div className="request-img">
                            <img
                              style={{ height: "80px" }}
                              src={individualProduct.itemImg}
                              alt="item-img"
                            />
                          </div>
                          <div className="request-cat">
                            {individualProduct.itemCategory}
                          </div>
                          <div className="request-title">
                            {individualProduct.itemName}
                          </div>
                          <div className="request-price">
                            PKR {individualProduct.totalprice}
                          </div>
                          <div className="request-con">
                            {individualProduct.method}
                          </div>
                          <div
                            className={`request-status ${
                              individualProduct.inProgress
                                ? "complete"
                                : "inprogress"
                            }`}
                          >
                            {individualProduct.inProgress
                              ? "Completed"
                              : "In Progress"}
                          </div>
                        </div>
                      </Link>
                      <div className="request-owner">
                        By : {individualProduct.renterEmail}
                      </div>
                    </div>
                  </>
                ))}
              </>
            )}
            {productsLend.length === 0 && (
              <div className="not-found">
                <p>Not Found any data</p>
              </div>
            )}
          </div>
        </>
      )}

      {renter && (
        <>
          <div className="products-request">
            <div className="request-heading">
              <h3>My Orders </h3>
            </div>

            <div className="request-card mb-3">
              <div className="request-item-show">
                <div className="request-service">
                  <h7 style={{ fontStyle: "italic" }}>
                    Total Orders : {productsRent.length}
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
            {productsRent.length > 0 && (
              <>
                <div className="request-card">
                  <div className="request-item-show">
                    <div className="request-img">Items</div>
                    <div className="request-cat">Category</div>
                    <div className="request-title">Title</div>
                    <div className="request-price">Price</div>
                    <div className="request-con">Payement Method</div>
                    <div className="request-status">Status</div>
                  </div>
                </div>
                {productsRent.map((individualProduct) => (
                  <>
                    <div className="request-data">
                      <Link
                        className="underline"
                        to={`/orderDetail/${individualProduct.ID}`}
                      >
                        <div className="request-item-show">
                          <div className="request-img">
                            <img
                              style={{ height: "80px" }}
                              src={individualProduct.itemImg}
                              alt="item-img"
                            />
                          </div>
                          <div className="request-cat">
                            {individualProduct.itemCategory}
                          </div>
                          <div className="request-title">
                            {individualProduct.itemName}
                          </div>
                          <div className="request-price">
                            PKR {individualProduct.totalprice}
                          </div>
                          <div className="request-con">
                            {individualProduct.method}
                          </div>
                          <div
                            className={`request-status ${
                              individualProduct.inProgress
                                ? "complete"
                                : "inprogress"
                            }`}
                          >
                            <p className="status-show">
                              {individualProduct.inProgress
                                ? "Completed"
                                : "In Progress"}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="request-owner">
                        Item Owner : {individualProduct.lenderEmail}
                      </div>
                    </div>
                  </>
                ))}
              </>
            )}
            {productsRent.length === 0 && (
              <div className="not-found">
                <p>Not Found any data</p>
              </div>
            )}
          </div>
        </>
      )}

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

export default Orders;
