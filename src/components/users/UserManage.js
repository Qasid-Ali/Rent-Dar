import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { Link, useHistory } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";
import { Alert, Button } from "react-bootstrap";
import ViewUser from "./ViewUser";
import ReactPaginate from "react-paginate";

function UserManage(props) {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userId, setUserId] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sort, setSort] = useState(false);

  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(users.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  //--------------------------

  const history = useHistory();
  // show modal state
  const [showModal, setShowModal] = useState(false);
  // trigger modal
  const triggerModal = (id) => {
    setShowModal(true);
    console.log(id);
    setUserId(id);
  };
  // hide modal
  const hideModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    db.collection("users")
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

  const deleteUser = async (id) => {
    if (currentUser.email === id) {
      setError("This is your account");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      if (
        window.confirm("Are you sure that you wanted to delete that user ? ")
      ) {
        await db
          .collection("users")
          .doc(id)
          .delete()
          .then(() => {
            setSuccessMsg(" User Deleted Successfully ");
            setSuccessMsg("");
            history.push("/");
          })
          .catch((err) => setError(err.message));
      }
    }
  };

  //handle change
  const handleChange = (e) => {
    if (e.target.value == "ascName") {
      setSort(true);
      db.collection("users")
        .orderBy("name", "asc")
        .onSnapshot((querySnapshot) => {
          const sortedData = [];
          querySnapshot.forEach((doc) => {
            sortedData.push(doc.data());
          });
          setSortedData(sortedData);
        });
    } else if (e.target.value == "descName") {
      setSort(true);
      db.collection("users")
        .orderBy("name", "desc")
        .onSnapshot((querySnapshot) => {
          const sortedData = [];
          querySnapshot.forEach((doc) => {
            sortedData.push(doc.data());
          });
          setSortedData(sortedData);
        });
    } else if (e.target.value == "ascEmail") {
      setSort(true);
      db.collection("users")
        .orderBy("email", "asc")
        .onSnapshot((querySnapshot) => {
          const sortedData = [];
          querySnapshot.forEach((doc) => {
            sortedData.push(doc.data());
          });
          setSortedData(sortedData);
        });
    } else if (e.target.value == "descEmail") {
      setSort(true);
      db.collection("users")
        .orderBy("email", "desc")
        .onSnapshot((querySnapshot) => {
          const sortedData = [];
          querySnapshot.forEach((doc) => {
            sortedData.push(doc.data());
          });
          setSortedData(sortedData);
        });
    }
  };
  //handle reset
  const handleReset = () => {
    setSort(false);
    db.collection("users")
      .get()
      .then((docs) => {
        setUsers(
          docs.docs.map((docs) => ({
            id: docs.id,
            user: docs.data(),
          }))
        );
      });
  };
  // handle filter
  const filterData = (value) => {
    if (value == "Active") {
      db.collection("users")
        .where("isOnline", "==", true)
        .get()
        .then((docs) => {
          setUsers(
            docs.docs.map((docs) => ({
              id: docs.id,
              user: docs.data(),
            }))
          );
        });
    } else if (value == "Offline") {
      db.collection("users")
        .where("isOnline", "==", false)
        .get()
        .then((docs) => {
          setUsers(
            docs.docs.map((docs) => ({
              id: docs.id,
              user: docs.data(),
            }))
          );
        });
    }
  };

  return (
    <>
      <div className="filter-btn">
        <h5>Filter Data : </h5>
        <Button variant="success" onClick={() => filterData("Active")}>
          Active
        </Button>
        <Button variant="danger" onClick={() => filterData("Offline")}>
          Offline
        </Button>
        <Button type="submit" variant="primary" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className="filter-btn">
        <label> Sort By: </label>
        <select className="form-control w-50" onChange={handleChange}>
          <option>Please Select</option>
          <option value="ascName">Name (A -- z) </option>
          <option value="descName">Name (z -- A) </option>
          <option value="ascEmail">Email (A -- z) </option>
          <option value="descEmail">Email (z -- A) </option>
        </select>
      </div>
      <div style={{ marginTop: "10px" }}>
        <div className="alert_msg">
          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          <h6>Total Users : {users.length}</h6>
        </div>

        <table className="styled-table w-50">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {!sort && (
            <tbody>
              {users
                .slice(pagesVisited, pagesVisited + usersPerPage)
                .map(({ id, user }) => (
                  <tr key={id}>
                    <td>{user.name}</td>
                    <td>
                      <Link to={`/userDetail/${user.email}`}>{user.email}</Link>
                    </td>
                    <td>{user.userRoles}</td>
                    <td>
                      <div className={`${user.isOnline ? "Active" : "Block"}`}>
                        {user.isOnline ? "Active" : "Offline"}
                      </div>
                    </td>
                    <td>
                      <Link to={`/updateUser/${id}`}>
                        <EditIcon className="grey" />
                      </Link>
                      <DeleteIcon
                        onClick={() => deleteUser(id)}
                        className="red"
                      />

                      <button
                        className="btn_user btn_view"
                        onClick={() => triggerModal(id)}
                      >
                        View
                      </button>
                      {showModal === true && (
                        <ViewUser id={userId} hideModal={hideModal} />
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          )}

          {sort && (
            <tbody>
              {sortedData
                .slice(pagesVisited, pagesVisited + usersPerPage)
                .map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>
                        <Link to={`/userDetail/${user.email}`}>
                          {user.email}
                        </Link>
                      </td>
                      <td>{user.userRoles}</td>
                      <td>
                        <div
                          className={`${user.userStatus ? "Active" : "Block"}`}
                        >
                          {user.userStatus ? "Active" : "Block"}
                        </div>
                      </td>
                      <td>
                        <Link to={`/updateUser/${user.email}`}>
                          <EditIcon className="grey" />
                        </Link>
                        <DeleteIcon
                          onClick={() => deleteUser(user.email)}
                          className="red"
                        />

                        <button
                          className="btn_user btn_view"
                          onClick={() => triggerModal(user.email)}
                        >
                          View
                        </button>
                        {showModal === true && (
                          <ViewUser id={userId} hideModal={hideModal} />
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>
      </div>
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
    </>
  );
}

export default UserManage;
