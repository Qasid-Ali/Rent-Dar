import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useHistory, Link } from "react-router-dom";
import { db, auth } from "./firebase";
import { useAuth } from "./context/AuthContext";
import Avatar from "@material-ui/core/Avatar";
import { Navbar, Nav, Container, NavDropdown, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import SearchIcon from "@material-ui/icons/Search";

function NavBar() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");

  const [renter, setRenter] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [lender, setLender] = useState(false);
  const [search, setSearch] = useState("");

  const [data, setData] = useState({});
  const [itemEmail, setItemEmail] = useState("");
  // message fetch
  useEffect(() => {
    db.collection("messages")
      .where("itemEmail", "==", currentUser.email)
      .onSnapshot((snapshot) => {
        setItemEmail(snapshot.docs.map((doc) => doc.data().email));
      });
  }, []);

  useEffect(() => {
    db.collection("messages")
      .where("itemEmail", "==", currentUser.email)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  }, []);

  const history = useHistory();
  const { currentUser } = useAuth();
  const uid = currentUser.email;

  const logout = () => {
    db.collection("users").doc(currentUser.email).update({
      isOnline: false,
    });
    auth.signOut();
  };

  //update users collection
  function toggleLenderRole() {
    db.collection("users")
      .doc(uid)
      .update({ userRoles: "lender" })

      .then(() => {
        toast.success("Switching to Lender..", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push("/");
      });
  }
  //update users collection
  function toggleRenterRole() {
    db.collection("users")
      .doc(uid)
      .update({ userRoles: "renter" })
      .then(() => {
        toast.success("Switching to Renter..", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push("/");
      });
  }

  //fetch userRoles
  useEffect(async () => {
    var getRole = [];
    var currentUserEmail = user.email;

    const snapshot = await db.collection("users").doc(currentUserEmail).get();
    const data = await snapshot.data();
    getRole.push(data);

    setRenter(getRole[0].userRoles.includes("renter"));
    setAdmin(getRole[0].userRoles.includes("admin"));
    setLender(getRole[0].userRoles.includes("lender"));
  }, [user]);

  //fetch username
  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("email", "==", user.email)
        .get();
      const data = await query.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  //fetch loading
  useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");

    fetchUserName();
  }, [user, loading]);

  //  saerch result
  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/search?itemName=${search}`);
    setSearch("");
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">RENT-DAR</Navbar.Brand>
          {renter && (
            <>
              <form onSubmit={handleSubmit} className="header__center">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <SearchIcon style={{ color: "#fff" }} />
              </form>
            </>
          )}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <NavDropdown title="Chats">
                <div className="message-container">
                  <h3>Top Recent Chats</h3>
                  <hr />
                  {Object.keys(data).map((id, index) => {
                    return (
                      <>
                        <p>
                          {data[index].email != itemEmail[index + 1] ? (
                            <>
                              <div className="message-email">
                                <div>
                                  <Avatar
                                    style={{
                                      backgroundColor: "lightgrey",
                                      color: "#000",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {data[index].email[0]}
                                  </Avatar>
                                </div>
                                <div>
                                  <Link to={`/message/${data[index].email}`}>
                                    {data[index].email}
                                  </Link>
                                  <p>{data[index].text}</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </p>
                      </>
                    );
                  })}
                </div>
              </NavDropdown>
              {/* <Nav.Link href={`/message/renter1@gmail.com`}>Message</Nav.Link> */}
              {lender && (
                <>
                  <Nav.Link href="/addItem">Add Items</Nav.Link>
                  <Nav.Link href="/listing">Listing</Nav.Link>
                  <Nav.Link href="/orders">Orders</Nav.Link>
                  <Nav.Link href="/lenderRequest">Lender Request</Nav.Link>
                </>
              )}
              {admin && (
                <>
                  <NavDropdown title="Items Manage">
                    <NavDropdown.Item href="/additem">
                      Add Item
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/items">
                      View Items
                    </NavDropdown.Item>
                  </NavDropdown>

                  <Nav.Link href="/manageCategory">Manage Category</Nav.Link>
                  <Nav.Link href="/orders">Orders</Nav.Link>
                </>
              )}

              {renter && (
                <>
                  <Nav.Link href="/itemRequest">Request Items </Nav.Link>
                  <Nav.Link href="/favourite">Whislist</Nav.Link>
                  <Nav.Link href="/orders">Orders</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {lender && (
                <>
                  <Nav.Link onClick={toggleRenterRole}>
                    Switch to Renter
                  </Nav.Link>
                </>
              )}
              {renter && (
                <>
                  <Nav.Link onClick={toggleLenderRole}>
                    Switch to Lender
                  </Nav.Link>
                </>
              )}
              <div className="user-avatar">
                <Avatar
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    textTransform: "capitalize",
                  }}
                >
                  {name[0]}
                </Avatar>
              </div>
              <NavDropdown title="Signed in ">
                <NavDropdown.Item>{user?.email}</NavDropdown.Item>
                <NavDropdown.Item href="/updateProfile">
                  Update Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
