import React from 'react';
import './Articles.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { mcpAsset } from "./lib/publicAssets";

const imgPhoto1 = mcpAsset("10b712c0-bf8f-4149-bb5a-f7f62a25b20b");
const imgGrapefruit = mcpAsset("10510689-80cf-4b9d-bb93-18aeafc4c8f2");
const imgVector = mcpAsset("c42e5c12-47d2-4339-b56f-f31019c59dba");
const imgVector1 = mcpAsset("1801fc60-534e-48a9-aef5-6ca47d59472a");

function ArticleCard({ image, title, description, featured = false }) {
  return (
    <a href={`/articles/${title.toLowerCase().replace(/\s+/g, '-')}`} className={`article-card ${featured ? 'featured' : ''}`}>
      <div className="article-image-wrapper">
        <img alt={title} className="article-image" src={image} />
      </div>
      <div className="article-text">
        <p className="article-title">{title}</p>
        <p className="article-description">{description}</p>
      </div>
      {featured && <div className="article-featured-overlay" />}
    </a>
  );
}

export default function Articles() {
  return (
    <div className="articles-page">
      <div className="articles-header">
        <Navigation activePage="articles" />
        <div className="cart-icon">
          <img alt="Cart" className="cart-icon-img" src={imgVector} />
        </div>
      </div>

      <div className="articles-content">
        <h1 className="articles-title">Articles</h1>
        
        <div className="search-bar-container">
          <div className="search-bar">
            <div className="search-icon">🔍</div>
          </div>
        </div>

        <div className="articles-grid">
          <div className="articles-row">
            <ArticleCard 
              image={imgPhoto1}
              title="Build a Better Strength Routine"
              description="Here's how to structure your workouts for steady progress."
            />
            <ArticleCard 
              image={imgGrapefruit}
              title="Athletic Nutrition"
              description="Learn how to care for your nutrition to build a healthy and athletic body."
              featured={true}
            />
            <ArticleCard 
              image={imgPhoto1}
              title="Fueling for All-Day Energy"
              description="The right foods at the right time keep your body performing."
            />
          </div>
          <div className="articles-row">
            <ArticleCard 
              image={imgPhoto1}
              title="Build a Better Strength Routine"
              description="Here's how to structure your workouts for steady progress."
            />
            <ArticleCard 
              image={imgPhoto1}
              title="Fueling for All-Day Energy"
              description="The right foods at the right time keep your body performing."
            />
            <ArticleCard 
              image={imgPhoto1}
              title="Recover Like an Athlete"
              description="Learn what helps muscles rebuild so tomorrow you're stronger, not sore."
            />
          </div>
        </div>

        <div className="pagination">
          <button className="page-button prev">‹</button>
          <button className="page-button active">1</button>
          <button className="page-button">2</button>
          <button className="page-button">...</button>
          <button className="page-button">9</button>
          <button className="page-button">10</button>
          <button className="page-button next">›</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

