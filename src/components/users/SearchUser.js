import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import NavBar from "../../NavBar";
import Left from "@mui/icons-material/ArrowBack";
import SearchBar from "./SearchBar";

toast.configure();

const SearchUser = () => {
  const [data, setData] = useState({});

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  let search = query.get("name");

  useEffect(() => {
    searchData();
  }, [search]);

  const searchData = () => {
    db.collection("users")
      .where("name", "==", search)
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
      <SearchBar />

      {Object.keys(data).length === 0 ? (
        <div className="not-found">
          <h6>No Found Data with that data : {query.get("name")}</h6>
          <Link to="/dashboard" className="btn btn-primary cart-btn ">
            <Left />
            Go Back
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-2">
            <Link to="/dashboard" className="cart-btn">
              <button className="btn btn-back">
                <Left /> Back to HomePage
              </button>
            </Link>
          </div>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data).map((id, index) => {
                return (
                  <tr key={id}>
                    <td>{data[index].uid}</td>
                    <td>{data[index].name}</td>
                    <td>
                      <Link to={`/userDetail/${data[index].email}`}>
                        {data[index].email}
                      </Link>
                    </td>
                    <td>{data[index].userRoles}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default SearchUser;
