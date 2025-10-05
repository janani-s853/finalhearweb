import React from "react";
import "./products.css";
import comingImg from "./assets/coming.png"; // Replace with your image path

const Products = () => {
  return (
    <div className="products-page">
      <div className="coming-soon-container">
        <img
          src={comingImg}
          alt="Coming Soon"
          className="coming-soon-image"
        />
        <h1>Products Coming Soon</h1>
        <p>We're working hard to bring you our latest products. Stay tuned!</p>
      </div>
    </div>
  );
};

export default Products;
