import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Header from "./Header";
import AddIcon from "@mui/icons-material/Add";
import { Card } from "react-bootstrap";
import { db, auth } from "./firebase";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import ShowListingItems from "./ShowListingItems";
import { useAuthState } from "react-firebase-hooks/auth";
import UserManage from "./components/users/UserManage";
import SearchBar from "./components/users/SearchBar";

function Dashboard() {
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

  return (
    <>
      <NavBar />
      {lender && (
        <>
          <div className="card_btn_add">
            <div className="Container">
              <Card className="dashboard">
                <Link to="/addItem">
                  <AddIcon
                    style={{
                      color: "white",
                      background: "#212529",
                      borderRadius: "80px",
                      padding: "0 10px",
                      fontSize: "50px",
                      margin: "10px",
                    }}
                  />
                </Link>
                <h4>Create New Items</h4>
              </Card>
            </div>
            <div>
              <ShowListingItems />
            </div>
          </div>
        </>
      )}
      {renter && (
        <>
          <Header />
        </>
      )}
      {admin && (
        <>
          <SearchBar />
          <UserManage />
        </>
      )}
    </>
  );
}
export default Dashboard;
