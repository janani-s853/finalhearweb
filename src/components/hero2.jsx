import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import nobg from './assets/products/nobg.png';
import './hero2.css';

const products = [
  { id: 1, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.2 },
  { id: 2, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.5 },
  { id: 3, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.0 },
  { id: 4, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.3 },
  { id: 5, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.1 },
  { id: 6, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.4 },
  { id: 7, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.0 },
  { id: 8, name: 'Hearing Aid', desc: 'Description', price: 'Price', originalPrice: 'Price', offer: 'xx% off', rating: 4.2 },
];

const TopPicks = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isSwipeView, setIsSwipeView] = useState(window.innerWidth < 1155);

  useEffect(() => {
    const updateView = () => {
      const screenWidth = window.innerWidth;
      // Updated breakpoint to 1155px
      setIsSwipeView(screenWidth < 1155);

      if (screenWidth >= 1155) {
        setCardsPerView(4);
      }
    };

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  const handleNext = () => {
    if (startIndex + cardsPerView < products.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const productsToDisplay = isSwipeView
    ? products
    : products.slice(startIndex, startIndex + cardsPerView);

  return (
    <div className="top-picks-wrapper">
      <div className="top-picks-container">
        <h2 className="section-title">Browse Products</h2>

        <div className="carousel-wrapper">
          {!isSwipeView && startIndex > 0 && (
            <button className="arrow left" onClick={handlePrev}>
              <ChevronLeft size={22} />
            </button>
          )}

          <div className={`product-slider ${isSwipeView ? "swipe-view" : ""}`}>
            {productsToDisplay.map((product) => (
              <div key={product.id} className="product-card">
                <img src={nobg} alt={product.name} className="product-img" />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>

                <div className="price-section">
                  <span className="price">₹{product.price}</span>
                  <span className="original-price">₹{product.originalPrice}</span>
                  <span className="offer">{product.offer}</span>
                </div>

                <div className="rating">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      fill={index < Math.round(product.rating) ? '#ffc107' : 'none'}
                      stroke={index < Math.round(product.rating) ? '#ffc107' : '#ccc'}
                    />
                  ))}
                  <span className="rating-num">{product.rating.toFixed(1)}</span>
                </div>

                <button className="buy-btn">
                  Buy Now
                  <ChevronRight className="chevron-icon" size={20} />
                </button>
              </div>
            ))}
          </div>

          {!isSwipeView && startIndex + cardsPerView < products.length && (
            <button className="arrow right" onClick={handleNext}>
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPicks;