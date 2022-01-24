import React from "react";
import { Link } from "react-router-dom";
import Left from "@mui/icons-material/ArrowBack";

export const NotFound = () => {
  return (
    <>
      <div className="not-found">
        <h6>Oops..... The page you're looking for doesn't exist.</h6>
        <Link to="/dashboard" className="btn btn-primary cart-btn">
          <Left />
          Go Back
        </Link>
      </div>
    </>
  );
};
