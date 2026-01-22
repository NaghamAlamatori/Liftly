import React, { useState } from 'react';
import './ProductInfo.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { mcpAsset } from "./lib/publicAssets";

const imgThumb1 = mcpAsset("952e8a21-f1c1-4562-b5c1-10c11a701bdb");
const imgThumb2 = mcpAsset("bcd8d731-3540-4baa-bc67-3407b4cb0fb9");
const imgMain = mcpAsset("fbb60eae-f2f1-4331-8659-8a800f741cf6");
const imgVector = mcpAsset("35f0c453-cf4a-4f88-ac23-82f9148603d9");
const imgStars = mcpAsset("3d2e966c-32d2-43fe-a13a-fe9575dcedfe");
const imgEllipse1 = mcpAsset("410c19cc-f9ca-4018-9e9a-60d5cd2423ba");
const imgEllipse2 = mcpAsset("283f4766-0231-4cb4-b0f2-ee912406c803");
const imgEllipse3 = mcpAsset("83c55436-9422-4812-8377-9035252e0b56");
const imgArrow = mcpAsset("a01b6efe-83ba-479a-a29a-43430626d5b7");

export default function ProductInfo() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(imgMain);

  const sizes = [36, 37, 38, 39, 40];
  const colors = [
    { img: imgEllipse1, name: 'Black' },
    { img: imgEllipse2, name: 'Pink' },
    { img: imgEllipse3, name: 'Green' }
  ];

  return (
    <div className="product-info-page">
      <div className="product-info-header">
        <Navigation activePage="products" />
        <div className="cart-icon">
          <img alt="Cart" className="cart-icon-img" src={imgVector} />
        </div>
      </div>

      <div className="product-info-content">
        <a href="/products" className="back-button">Back</a>
        <p className="breadcrumb">Home &gt; Products &gt; Women's shose</p>

        <div className="product-details-container">
          <div className="product-images-section">
            <div className="product-thumbnails">
              <div 
                className={`thumbnail ${mainImage === imgThumb1 ? 'active' : ''}`}
                onClick={() => setMainImage(imgThumb1)}
              >
                <img alt="Thumbnail 1" className="thumbnail-img" src={imgThumb1} />
              </div>
              <div 
                className={`thumbnail ${mainImage === imgThumb2 ? 'active' : ''}`}
                onClick={() => setMainImage(imgThumb2)}
              >
                <img alt="Thumbnail 2" className="thumbnail-img" src={imgThumb2} />
              </div>
              <div 
                className={`thumbnail ${mainImage === imgThumb1 ? 'active' : ''}`}
                onClick={() => setMainImage(imgThumb1)}
              >
                <img alt="Thumbnail 3" className="thumbnail-img" src={imgThumb1} />
              </div>
              <div 
                className={`thumbnail ${mainImage === imgThumb2 ? 'active' : ''}`}
                onClick={() => setMainImage(imgThumb2)}
              >
                <img alt="Thumbnail 4" className="thumbnail-img" src={imgThumb2} />
              </div>
            </div>
            <div className="product-main-image">
              <img alt="Adidas Initiator Class 2.2" className="main-image" src={mainImage} />
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-header-info">
              <div className="product-title-group">
                <h1 className="product-name">Adidas Initiator Class 2.2</h1>
                <div className="product-rating">
                  <img alt="Rating" className="rating-img" src={imgStars} />
                </div>
              </div>
              <p className="product-price">$200</p>
            </div>

            <div className="product-options">
              <div className="color-selector">
                <p className="option-label">Color</p>
                <div className="color-options">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${selectedColor === index ? 'active' : ''}`}
                      onClick={() => setSelectedColor(index)}
                    >
                      <img alt={color.name} className="color-circle" src={color.img} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="size-selector">
                <p className="option-label">Select Size</p>
                <div className="size-options">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="add-to-cart-button">Add to Cart</button>

            <div className="product-details">
              <p className="details-title">Details</p>
              <p className="details-text">
                Lightweight Athletic Sneakers for Women– Breathable Mesh, Soft Cushioned Interior, Non-Slip EVA Sole, Adjustable Strap & Elastic Laces – Stylish Sage Green & Pink Comfort Shoes.
              </p>
            </div>
          </div>
        </div>

        <div className="image-navigation">
          <button className="nav-arrow prev">
            <img alt="Previous" className="arrow-img" src={imgArrow} />
          </button>
          <button className="nav-arrow next">
            <img alt="Next" className="arrow-img" src={imgArrow} />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

