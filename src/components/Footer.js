import React from 'react';
import './Footer.css';
import { mcpAsset } from "../lib/publicAssets";

const imgLogo3 = mcpAsset("b5c70880-093d-43df-a847-1e95ca3df35f");

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <div className="footer-logo-img-container">
            <img alt="LIFTLY Logo" className="footer-logo-img" src={imgLogo3} />
          </div>
          <p className="footer-logo-text">LIFTLY</p>
        </div>
        <div className="footer-links">
          <a href="/" className="footer-link active">Home</a>
          <button className="footer-link">About</button>
          <a href="/products" className="footer-link">Products</a>
          <a href="/articles" className="footer-link">Articles</a>
          <a href="/plan" className="footer-link">Plan</a>
        </div>
      </div>
      <p className="footer-copyright">
        © 2025 Liftly. All rights reserved.
      </p>
    </footer>
  );
}

