import React from "react";
import "./Card.css";

function Card({ image, flipped, onClick }) {
  return (
    <div className={`card ${flipped ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        <div className="card-front">
          <img src="/images/cover.png" alt="cover" />
        </div>
        <div className="card-back">
          <img src={image} alt="fruit" />
        </div>
      </div>
    </div>
  );
}

export default Card;