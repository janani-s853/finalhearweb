import React from "react";
import "./footer.css";
import logo from "./assets/fonts/logo_white.png";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Floating gradient circles */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>
      <div className="circle circle4"></div>
      <div className="circle circle5"></div>
      <div className="circle circle6"></div>

      <div className="footer-container">
        {/* Column 1 - Logo + Tagline */}
        <div className="footer-col footer-logo-col">
          <img src={logo} alt="H.E.A.R Logo" className="footer-logo-img" />
          <p className="footer-tagline">
            We don't just enhance hearing, we amplify lives
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/products">Products</a>
            <a href="/blogs">Blogs</a>
            <a href="/hearingtest">Take a Hearing Test</a>
            <a href="#">Book a Consultation</a>
          </div>
        </div>

        {/* Column 3 - Contact */}
        <div className="footer-col">
          <h3 className="footer-heading">Contact</h3>
          <p>
            Email: <a href="mailto:hearcompany25@gmail.com">hearcompany25@gmail.com</a>
          </p>
          <p>
            Phone: <a href="tel:+918148662839">+91 8148662839</a>
          </p>
          <p>
            Saraswathi Nagar, 7th street,<br />
            Adambakkam, Chennai-88, India
          </p>
        </div>

        {/* Column 4 - Let's Connect + Help */}
        <div className="footer-col">
          <h3 className="footer-heading">Let's Connect</h3>
          <div className="footer-links">
            <a href="/profile">My Account</a>
            <a href="/support">Support</a>
          </div>
          <div className="footer-socials social-combined">
            <a
              href="https://www.linkedin.com/company/h-e-a-r-pvt-ltd/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/hearzone25?igsh=MWtvcmI0cHY1ZjVwdA=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <p className="footer-bottom">© 2025 H.E.A.R. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
