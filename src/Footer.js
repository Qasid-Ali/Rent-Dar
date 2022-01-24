import React from "react";
import { Link } from "react-router-dom";

function Footer(props) {
  return (
    <div className="footer">
      <div className="card__btn">
        <h5>Rent-Dar</h5>
        <p>
          Less production, more re-usability and a culture of sharing are the
          basis of Rent-dar. By Rent-dar, we are solving the biggest
          climate/price challenges.
        </p>
      </div>
      <div>
        2022, All Right Reserverd <Link> Rent-Dar</Link>
      </div>
    </div>
  );
}

export default Footer;
