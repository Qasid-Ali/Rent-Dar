import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams, Link } from "react-router-dom";
import NavBar from "../../NavBar";
import { db, auth } from "../../firebase";
import { Button, Card, Container, Alert } from "react-bootstrap";
import Left from "@mui/icons-material/ArrowBack";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState();
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const location = useLocation();
  const history = useHistory();
  const { id } = useParams();
  const path = location.pathname.split("/")[2];

  useEffect(() => {
    const docRef = db
      .collection("users")
      .doc(id)
      .get("/updateUser/" + path)
      .then((doc) => {
        setName(doc.data().name);
        setEmail(doc.data().email);
        setUserRole(doc.data().userRoles);
        setUserStatus(doc.data().userStatus);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    return docRef;
  }, [id]);

  //handle select
  const handleChange = (e) => {
    if (e.target.value == "Active") {
      setErrorStatus("");
      setUserStatus(true);
      db.collection("users").doc(id).update({
        userStatus: true,
      });
    } else if (e.target.value == "Block") {
      setErrorStatus("");
      setUserStatus(false);
      db.collection("users").doc(id).update({
        userStatus: false,
      });
    } else if (e.target.value == "no") {
      setErrorStatus(" * Not Updated..Please Select any option ");
    }
  };

  //   Handle Submit
  const handleSubmit = (e) => {
    if (!userRole) {
      setError("* Input Field is required");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      setError("");
      db.collection("users")
        .doc(id)
        .update({
          userRoles: userRole,
          userStatus: userStatus,
        })
        .then(() => {
          setSuccessMsg("Updated Successfully");
          setTimeout(() => {
            setSuccessMsg("");
            history.push("/dashboard");
          }, 1000);
        });
    }
  };

  return (
    <>
      <NavBar />

      <Container
        className="d-flex align-items-center justify-content-center mt-3"
        style={{ minHeight: "75vh" }}
      >
        <div className="w-100" style={{ maxWidth: "500px" }}>
          <Card className="shadow-lg p-3 mb-2 bg-white rounded">
            <Link to="/">
              <Left />
              Back
            </Link>
            <Card.Body className="my-form my-3">
              <h4 className="mt-2">Edit User</h4>
              <hr />
              {successMsg && <Alert variant="success">{successMsg}</Alert>}
              <form autoComplete="off">
                <label className="label-form">Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  disabled
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="label-form">Email</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  disabled
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="label-form">User Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                />
                <p className="red">{error}</p>
                <label className="label-form">User Status : </label>
                &nbsp;{userStatus ? "Active" : "Block"}
                <br></br>
                <select className="form-control" onChange={handleChange}>
                  <option value="no">Select Your User Status </option>
                  <option value="Active">Active</option>
                  <option value="Block">Block</option>
                </select>
                <p className="red">{errorStatus}</p>
                <Button
                  onClick={handleSubmit}
                  className="mt-2 p-2"
                  variant="primary"
                  className="w-100"
                >
                  Update User
                </Button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default EditUser;
