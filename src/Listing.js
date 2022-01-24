import React, { useState } from "react";
import { ListingItems } from "./ListingItems";
import NavBar from "./NavBar";

export const Listing = ({ products }) => {
  //--------------------------
  return products.map((individualProduct) => (
    <>
      <ListingItems individualProduct={individualProduct} />
    </>
  ));
};

export default Listing;
