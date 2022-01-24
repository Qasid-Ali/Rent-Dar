import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { useAuth } from "./context/AuthContext";
import { useHistory, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

toast.configure();

export const ListingItems = ({ individualProduct }) => {
  const [renter, setRenter] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [lender, setLender] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const history = useHistory();

  const { currentUser } = useAuth();
  const [user] = useAuthState(auth);

  db.collection("items").doc(individualProduct.ID).update({
    itemId: individualProduct.ID,
  });

  const handleDeleteItem = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("items")
          .doc(individualProduct.ID)
          .delete()
          .then(() => {
            toast("Deleted Succesfully ", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
            history.push("/");
          });
      }
    });
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

  //delete item
  const deleteItem = async (id) => {
    if (window.confirm("Are you sure that you wanted to delete that item ? ")) {
      await db
        .collection("items")
        .doc(id)
        .delete()
        .then(() => {
          setSuccessMsg(" Item Deleted Successfully ");
          setTimeout(() => {
            setSuccessMsg("");
            history.push("/items");
          }, 3000);
        })
        .catch((err) => setError(err.message));
    }
  };

  return (
    <>
      {lender && (
        <>
          {user && individualProduct.email === currentUser.email && (
            <>
              <Link
                className="underline"
                to={`/itemDetail/${individualProduct.itemId}`}
              >
                <div className="product mt-4">
                  <div className="product-img">
                    <img src={individualProduct.itemImg} alt="item-img" />
                  </div>
                  <div className="card__info">
                    <div className="card__btn">
                      <div className="product-text title">
                        {individualProduct.itemName}
                      </div>
                      <div className="product-text title">
                        PKR {individualProduct.itemPrice.day} / day
                      </div>
                    </div>
                    <div className="product-text description">
                      {individualProduct.itemDescription}
                    </div>
                  </div>
                  <div
                    className="card_btn"
                    style={{
                      justifyContent: "space-between",
                      padding: "5px 20px",
                    }}
                  >
                    {user && individualProduct.email === currentUser.email && (
                      <>
                        <Link to={`/updateitem/${individualProduct.ID}`}>
                          <EditIcon style={{ color: "grey" }} />
                        </Link>
                        <DeleteIcon
                          onClick={handleDeleteItem}
                          className="red"
                        />
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </>
          )}
        </>
      )}
    </>
  );
};
export default ListingItems;
