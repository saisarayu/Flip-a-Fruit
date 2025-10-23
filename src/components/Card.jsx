import React from "react";
import "./Card.css";

function Card({ image, flipped, matched, miss, onClick }) {
  return (
    <div
      className={`card ${flipped ? "flipped" : ""} ${matched ? "matched" : ""} ${miss ? "miss" : ""}`}
      onClick={onClick}
    >
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