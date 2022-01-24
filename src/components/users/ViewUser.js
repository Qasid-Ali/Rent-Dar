import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useHistory, useLocation, useParams } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";

const ViewUser = ({ hideModal, id }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userAuth, setUserAuth] = useState("");
  const [userId, setUserId] = useState("");

  // close modal
  const handleCloseModal = () => {
    hideModal();
  };

  useEffect(() => {
    const docRef = db
      .collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        setName(doc.data().name);
        setEmail(doc.data().email);
        setUserRole(doc.data().userRoles);
        setUserAuth(doc.data().authProvider);
        setUserId(doc.data().uid);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    return docRef;
  }, [id]);

  return (
    <>
      <div className="shade-area">
        <div className="modal-container">
          <table>
            <thead>
              <tr>
                <th colSpan={2}>User Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>User ID</td>
                <td>{userId}</td>
              </tr>

              <tr>
                <td>Email</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>User Role</td>
                <td>{userRole}</td>
              </tr>
              <tr>
                <td>User Auth Provide</td>
                <td>{userAuth}</td>
              </tr>
            </tbody>
          </table>

          <div className="delete-icon" onClick={handleCloseModal}>
            <CloseIcon />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewUser;
