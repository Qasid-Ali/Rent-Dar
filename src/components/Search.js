import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../firebase";
import { toast } from "react-toastify";
import NavBar from "../NavBar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Container } from "react-bootstrap";
import Left from "@mui/icons-material/ArrowBack";

toast.configure();

const Search = () => {
  const [data, setData] = useState({});

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  let search = query.get("itemName");

  useEffect(() => {
    searchData();
  }, [search]);

  const searchData = () => {
    db.collection("items")
      .where("itemName", "==", search)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
      });
  };

  return (
    <>
      <NavBar />

      {Object.keys(data).length === 0 ? (
        <Container>
          <div className="not-found">
            <h6>
              OOPS ! No Found Data with that name : {query.get("itemName")}
            </h6>
            <p>
              You can also Request for this
              <Link to="/requestItem"> Request Item </Link> OR
              <Link to="/dasboard"> Home Page </Link>
            </p>
          </div>
        </Container>
      ) : (
        <Container>
          {Object.keys(data).map((id, index) => {
            return (
              <div key={id}>
                <div className="searchResult">
                  <img src={data[index].itemImg} alt="product-img" />
                  <FavoriteIcon className="fav-icon searchResult__heart" />
                  <div className="searchResult__info">
                    <div className="searchResult__infoTop">
                      <h3>{data[index].itemName}</h3>

                      <p className="itemResult__infoTopDesc">
                        {data[index].itemDescription}
                      </p>
                      <p>{data[index].itemCondition}</p>
                    </div>

                    <div className="searchResult__infoBottom">
                      <div className="searchResult__stars ">
                        <p>
                          <Link
                            to={`/item/${data[index].itemId}`}
                            className="btn btn-danger cart-btn"
                          >
                            RENT IT
                          </Link>
                        </p>
                      </div>
                      <div className="searchResults__price">
                        <p>
                          <strong> PKR </strong>
                          {data[index].itemPrice.hour} / Hour
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Container>
      )}
    </>
  );
};

export default Search;
