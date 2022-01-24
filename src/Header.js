import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ShowItems from "./ShowItems";
import { Button } from "@material-ui/core";
import Icon from "@mui/icons-material/ArrowDropDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Header() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [cat, setCat] = useState("");
  const [category, setCategory] = useState([]);
  const [sort, setSort] = useState(false);
  const { currentUser } = useAuth();

  //getting username
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

  useEffect(() => {
    if (loading) return;
    fetchUserName();
  }, [user, loading]);

  //fetch category
  useEffect(() => {
    db.collection("category")
      .get()
      .then((docs) => {
        setCategory(
          docs.docs.map((docs) => ({
            id: docs.id,
            data: docs.data(),
          }))
        );
      });
  }, []);
  // sorting with category
  const handleCategory = (category) => {
    setSort(true);
    console.log(category);

    db.collection("items")
      .where("itemCategory", "==", category)
      .onSnapshot((querySnapshot) => {
        const sortedData = [];
        querySnapshot.forEach((doc) => {
          sortedData.push(doc.data());
        });
        setSortedData(sortedData);
      });
  };
  //handle sort
  const handleSort = () => {
    setSort(false);
  };
  return (
    <>
      <div className="header_container">
        <div className="header-left">
          <h6>Hi, {name}</h6>
          <p>Create a request offer for Items</p>
          <Link to="/requestItem" style={{ textDecoration: "none" }}>
            <Button variant="outlined" color="primary">
              Request for Item
            </Button>
          </Link>
        </div>
        <div className="header-right"></div>
      </div>

      <Navbar expand="lg">
        <div className="btn-group-cat">
          <Button>Browse By Category</Button>
        </div>
        <Navbar.Toggle className="dropdown-icon">
          <div>
            <h6>
              See All <Icon />
            </h6>
          </div>
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Nav>
            <div className="btn-group">
              <Button
                className="btn-group__item"
                variant="outlined"
                onClick={handleSort}
              >
                All
              </Button>
            </div>
          </Nav>
          {category.map(({ id, data }) => (
            <Nav>
              <div className="btn-group">
                <Button
                  className="btn-group__item"
                  variant="outlined"
                  onClick={() => handleCategory(data.name)}
                >
                  {data.name}
                </Button>
              </div>
            </Nav>
          ))}
        </Navbar.Collapse>
      </Navbar>

      {/* Show All data without sorted data */}
      {!sort && <ShowItems />}
      {/* Show All data with sorted data through category*/}
      {sort && (
        <>
          {sortedData.length < 1 && (
            <>
              <div className="not-found">
                <h6>No Items Found For Your Search</h6>
                <p>Try Another one</p>
              </div>
            </>
          )}
          <div className="products-box">
            {sortedData.map((item, index) => {
              return (
                <div className="product">
                  <div
                    className="card_btn"
                    style={{
                      justifyContent: "space-between",
                      padding: "5px 20px",
                    }}
                  >
                    {user && <div className="product-status">Status : </div>}
                    {user && item.email === currentUser.email && (
                      <>
                        <div className="card_btn">
                          <EditIcon />
                          <DeleteIcon className="red" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="product-img">
                    <img src={item.itemImg} alt="product-img" />
                  </div>
                  <div className="card__info">
                    <div className="card__btn">
                      <div className="product-text title">{item.itemName}</div>
                      <div className="product-text title">
                        PKR {item.itemPrice.hour}
                      </div>
                    </div>
                    <div className="product-text description">
                      {item.itemDescription}
                    </div>
                    <div className="card__btn">
                      <Link
                        to={`/item/${item.itemId}`}
                        className="btn btn-danger cart-btn"
                      >
                        RENT IT
                      </Link>
                      <div>
                        <FavoriteIcon className="fav-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default Header;
