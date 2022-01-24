import React from "react";
import { IndividualFavItems } from "./IndividualFavItems";

export const FavouriteItem = ({ favouriteProducts }) => {
  return favouriteProducts.map((favouriteProduct) => (
    <IndividualFavItems
      key={favouriteProduct.ID}
      favouriteProduct={favouriteProduct}
    />
  ));
};
