import React, { useState } from 'react';
import './CreateAccount.css';
import Footer from './components/Footer';
import { mcpAsset } from "./lib/publicAssets";

const imgLogo2 = mcpAsset("e0bffe54-c439-490a-a47b-e946a8b1f5f8");

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup:', formData);
  };

  return (
    <div className="create-account-page">
      <div className="create-account-header">
        <div className="create-account-nav-links">
          <a href="/" className="create-account-nav-link">Home</a>
          <button className="create-account-nav-link">About</button>
          <a href="/products" className="create-account-nav-link">Products</a>
          <a href="/articles" className="create-account-nav-link">Articles</a>
          <a href="/plan" className="create-account-nav-link">Plan</a>
        </div>
        <button className="create-account-header-button">Login</button>
      </div>

      <div className="create-account-content">
        <div className="create-account-card">
          <div className="create-account-card-header">
            <div className="create-account-logo-container">
              <img alt="LIFTLY Logo" className="create-account-logo" src={imgLogo2} />
            </div>
            <h1 className="create-account-title">Create Account</h1>
          </div>

          <form className="create-account-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Enter Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
              />
            </div>

            <button type="submit" className="create-account-submit-button">
              Create Account
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

