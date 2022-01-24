import React from "react";
import { AllItems } from "./AllItems";
export const Items = ({ products, addToFavourite, deleteItem }) => {
  return products.map((individualProduct) => (
    <>
      <AllItems
        individualProduct={individualProduct}
        addToFavourite={addToFavourite}
        deleteItem={deleteItem}
      />
    </>
  ));
};

export default Items;
