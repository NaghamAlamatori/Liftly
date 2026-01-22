import React from 'react';
import './Navigation.css';
import { mcpAsset } from "../lib/publicAssets";

const imgLogo2 = mcpAsset("6680259d-380b-4863-8164-84549f5e8b31");

export default function Navigation({ activePage = 'home' }) {
  return (
    <nav className="navigation">
      <div className="nav-logo">
        <div className="logo-img-container">
          <img alt="LIFTLY Logo" className="logo-img" src={imgLogo2} />
        </div>
        <p className="logo-text">LIFTLY</p>
      </div>
      <div className="nav-links">
        <a href="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>Home</a>
        <button className="nav-link">About</button>
        <a href="/products" className={`nav-link ${activePage === 'products' ? 'active' : ''}`}>Products</a>
        <a href="/articles" className={`nav-link ${activePage === 'articles' ? 'active' : ''}`}>Articles</a>
        <a href="/plan" className={`nav-link ${activePage === 'plan' ? 'active' : ''}`}>Plan</a>
      </div>
      <button className="nav-login-button">Login</button>
    </nav>
  );
}

