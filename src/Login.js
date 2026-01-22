import React, { useState } from 'react';
import './Login.css';
import Footer from './components/Footer';
import { mcpAsset } from "./lib/publicAssets";

const imgLogo2 = mcpAsset("2de5f7ba-d054-4a79-be06-6a4a8cb4d47b");

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { username, password });
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-nav-links">
          <a href="/" className="login-nav-link">Home</a>
          <button className="login-nav-link">About</button>
          <a href="/products" className="login-nav-link">Products</a>
          <a href="/articles" className="login-nav-link">Articles</a>
          <a href="/plan" className="login-nav-link">Plan</a>
        </div>
        <button className="login-header-button">Login</button>
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-logo-container">
              <img alt="LIFTLY Logo" className="login-logo" src={imgLogo2} />
            </div>
            <h1 className="login-title">Welcome Back</h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Enter Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>

            <div className="login-links">
              <a href="/signup" className="signup-link">
                Don't have an account? <span className="signup-link-highlight">Sign up</span>
              </a>
              <a href="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-submit-button">
              Login
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

