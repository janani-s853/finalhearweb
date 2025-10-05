import React from "react";
import "./hero3.css";
import { ChevronRight } from "lucide-react";
import phoneImage from "./assets/phone.png"; // Replace with your phone image

const features = [
  "Connect your hearing aid easily",
  "Customize sound with AI auto-tune",
  "Monitor hearing progress anytime",
  "Quick adjustments & notifications",
];

const Hero3 = () => {
  return (
    <section className="hero3-container">
      <div className="hero3-content">
        {/* Left: Phone Image */}
        <div className="hero3-left">
          <img src={phoneImage} alt="H.E.A.R App on phone" />
        </div>

        {/* Right: App Info */}
        <div className="hero3-right">
          <h2>Download the H.E.A.R App</h2>
          <p>Customize and control your hearing aids directly from your phone.</p>
          
          <ul className="hero3-features">
            {features.map((feat, idx) => (
              <li key={idx}>
                <ChevronRight className="chevron-icon" /> {feat}
              </li>
            ))}
          </ul>

          <div className="hero3-buttons">
            <a href="#" className="download-btn android">Download for Android</a>
            <a href="#" className="download-btn ios">Download for iOS</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero3;
