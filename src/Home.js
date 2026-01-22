import React from 'react';
import './Home.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { mcpAsset } from "./lib/publicAssets";

const imgFrame7 = mcpAsset("81f79675-1738-4fa2-9d34-bc21977fd535");
const imgProduct1 = mcpAsset("060da4a0-6a94-4740-8b2b-c8a9218d3c6d");
const imgProduct2 = mcpAsset("ef4a916a-3bb3-4588-853e-d57cacf90dbd");
const imgProduct3 = mcpAsset("34c01d7c-1a17-429a-97fd-a6838d1ac421");
const imgArticle1 = mcpAsset("23a925a9-2c26-4de0-854c-f3cf87ba275b");
const imgFrame21 = mcpAsset("cac28f93-186c-4aeb-82a9-8740635aaf71");

function ProductCard({ image, title, colors, price }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img alt={title} className="product-image" src={image} />
      </div>
      <div className="product-info">
        <div className="product-text">
          <p className="product-title">{title}</p>
          <p className="product-colors">{colors}</p>
        </div>
        <div className="product-footer">
          <p className="product-price">{price}</p>
          <button className="buy-button">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ image, title, description }) {
  return (
    <div className="article-card">
      <div className="article-image-container">
        <img alt={title} className="article-image" src={image} />
      </div>
      <div className="article-content">
        <p className="article-title">{title}</p>
        <p className="article-description">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <Navigation activePage="home" />
          <div className="hero-text-container">
            <div className="hero-title-wrapper">
              <h1 className="hero-title">
                Discover the best version of yourself
              </h1>
            </div>
            <p className="hero-subtitle">
              start your journey toward greater strength, better health, and endless energy.
            </p>
            <button className="hero-button">Build Your Plan</button>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-section">
        <div className="about-content">
          <h2 className="section-title">About US</h2>
          <p className="about-description">
            We are a sports platform that aims to help you improve your fitness and build a healthy lifestyle in a simple and practical way.
            <br />
            We provide reliable sports articles, carefully selected products, and the ability to create a fitness plan that matches your goals and level by yourself.
          </p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-number">12<span className="stat-plus">+</span></p>
            <p className="stat-text">stick to their plan after week one</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">8K<span className="stat-plus">+</span></p>
            <p className="stat-text">athletes supported through content</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">4,200<span className="stat-plus">+</span></p>
            <p className="stat-text">strength and wellness products explored</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">200<span className="stat-plus">+</span></p>
            <p className="stat-text">expert articles read daily</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="section-header">
          <div className="section-title-group">
            <h2 className="section-title">Products</h2>
            <p className="section-description">
              Gear built to improve training, recovery, and everyday performance.
            </p>
          </div>
          <button className="section-button">Explore All Products</button>
        </div>
        <div className="products-grid">
          <ProductCard 
            image={imgProduct1}
            title="Running Shoes 2"
            colors="4 Colors"
            price="180$"
          />
          <ProductCard 
            image={imgProduct2}
            title="Running Shoes 1"
            colors="3 Colors"
            price="200$"
          />
          <ProductCard 
            image={imgProduct3}
            title="Running Shoes 3"
            colors="3 Colors"
            price="225$"
          />
        </div>
      </div>

      {/* Articles Section */}
      <div className="articles-section">
        <div className="section-header">
          <div className="section-title-group">
            <h2 className="section-title">Articles</h2>
            <p className="section-description">
              Our articles give athletes the knowledge to train smarter and feel stronger every day.
            </p>
          </div>
          <button className="section-button">Read More Articles</button>
        </div>
        <div className="articles-grid">
          <ArticleCard 
            image={imgArticle1}
            title="Build a Better Strength Routine"
            description="Here's how to structure your workouts for steady progress."
          />
          <ArticleCard 
            image={imgArticle1}
            title="Fueling for All-Day Energy"
            description="The right foods at the right time keep your body performing."
          />
          <ArticleCard 
            image={imgArticle1}
            title="Recover Like an Athlete"
            description="Learn what helps muscles rebuild so tomorrow you're stronger, not sore."
          />
        </div>
      </div>

      {/* Make Your Plan Section */}
      <div className="plan-section">
        <div className="plan-overlay" />
        <div className="plan-content">
          <div className="plan-text-group">
            <h2 className="section-title">Make Your Plan</h2>
            <p className="section-description">
              Build a plan that fits your training, tracks your progress, and keeps you moving.
            </p>
          </div>
          <button className="section-button">Create My Plan</button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

