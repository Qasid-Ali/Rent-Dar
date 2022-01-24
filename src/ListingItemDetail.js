import React from "react";
import NavBar from "./NavBar";
import ShowListingItems from "./ShowListingItems";

function ListingItemDetail(props) {
  return (
    <>
      <NavBar />
      <div
        style={{
          width: "90%",
          border: "1px solid grey",
          margin: "30px auto",
          alignItem: "center",
          borderLeft: "5px solid grey",
          background: "#f7f7f7",
          padding: "10px",
        }}
      >
        <h4>My Listing</h4>
      </div>
      <ShowListingItems />
    </>
  );
}

export default ListingItemDetail;
