import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../../firebase";
import Avatar from "@material-ui/core/Avatar";
import Left from "@mui/icons-material/ArrowBack";
import NavBar from "../../NavBar";
import ReactPaginate from "react-paginate";
import { useAuth } from "../../context/AuthContext";

const UserDetail = () => {
  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);

  const location = useLocation();
  const itemID = location.pathname.split("/")[2];

  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 12;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(data.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  //--------------------------

  useEffect(() => {
    searchData();
  }, [itemID]);

  const searchData = () => {
    db.collection("items")
      .where("email", "==", itemID)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  };

  useEffect(() => {
    db.collection("users")
      .where("email", "==", itemID)
      .get()
      .then((docs) => {
        setUsers(
          docs.docs.map((docs) => ({
            id: docs.id,
            user: docs.data(),
          }))
        );
      });
  }, []);
  const { currentUser } = useAuth();

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

  return (
    <>
      <NavBar />
      <div className="user_data">
        <div className="user_detail">
          {users.map(({ id, user }) => (
            <>
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
              <div
                className={`user_status ${
                  user.isOnline ? "online" : "offline"
                }`}
              ></div>
              <Avatar
                className={`user_detail_avatar ${
                  user.isOnline ? "online" : "offline"
                }`}
              >
                {user.name[0]}
              </Avatar>

              <h5>{user.email}</h5>

              <h5>Name : {user.name}</h5>
              <p> Total Items Published : {Object.keys(data).length}</p>
            </>
          ))}
        </div>
        <div className="products-box">
          {Object.keys(data)
            .slice(pagesVisited, pagesVisited + usersPerPage)
            .map((id, index) => {
              return (
                <div key={id}>
                  <Link
                    className="underline"
                    to={`/itemDetail/${data[index].itemId}`}
                  >
                    <div className="product mt-4">
                      <div className="product-img">
                        <img src={data[index].itemImg} alt="item-img" />
                      </div>
                      <div className="card__info">
                        <div className="card__btn">
                          <div className="product-text title">
                            {data[index].itemName}
                          </div>
                          <div className="product-text title">
                            PKR {data[index].itemPrice.day} / day
                          </div>
                        </div>
                        <div className="product-text description">
                          {data[index].itemDescription}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
      {Object.keys(data).length > 0 && (
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
      )}
    </>
  );
};

export default UserDetail;
