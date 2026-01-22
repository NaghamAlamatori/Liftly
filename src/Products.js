import React from 'react';
import './Products.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { mcpAsset } from "./lib/publicAssets";

const imgFrame64 = mcpAsset("b1096c3e-f693-44c3-9303-648f87674b05");
const imgFrame65 = mcpAsset("be02ad68-925c-4196-a1d8-18690f106e86");
const imgFrame66 = mcpAsset("5a8dc429-0f89-41f5-8d0d-6f7ad00ec068");
const imgFrame67 = mcpAsset("edd46031-9e67-4921-a046-efa5040c2ea8");
const imgFrame68 = mcpAsset("9afb2a3f-ffdf-4f0c-a796-dfbda414b394");
const imgFrame69 = mcpAsset("1fe30f96-630c-46c1-b8e8-7fcd3e7e5d4b");
const imgVector = mcpAsset("8433be66-609f-481c-a227-29f5495ae72e");

function CategoryCard({ image, title, link }) {
  const content = (
    <div className="category-card">
      <div className="category-overlay" />
      <p className="category-title">{title}</p>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="category-link">
        {content}
      </a>
    );
  }

  return content;
}

export default function Products() {
  return (
    <div className="products-page">
      <div className="products-header">
        <Navigation activePage="products" />
        <div className="cart-icon">
          <img alt="Cart" className="cart-icon-img" src={imgVector} />
        </div>
      </div>

      <div className="products-content">
        <h1 className="products-title">Products</h1>
        
        <div className="search-bar-container">
          <div className="search-bar">
            <div className="search-icon">🔍</div>
          </div>
        </div>

        <div className="categories-section">
          <div className="categories-row">
            <CategoryCard 
              image={imgFrame64}
              title="Men's shoes"
            />
            <CategoryCard 
              image={imgFrame65}
              title="Accessories"
            />
            <CategoryCard 
              image={imgFrame66}
              title="Women's shoes"
              link="/products/womens-shoes"
            />
          </div>
        </div>

        <div className="categories-section">
          <div className="categories-row">
            <CategoryCard 
              image={imgFrame67}
              title="Men's clothing"
            />
            <CategoryCard 
              image={imgFrame68}
              title="Women's clothing"
            />
            <CategoryCard 
              image={imgFrame69}
              title="Sports Nutrition"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

