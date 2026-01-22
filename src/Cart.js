import React, { useState } from 'react';
import './Cart.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { mcpAsset } from "./lib/publicAssets";

const imgProduct1 = mcpAsset("f501e03f-232b-4a22-bc76-449acf71f701");
const imgProduct2 = mcpAsset("7330381b-f71e-4c5a-a600-c97179b834a4");
const imgProduct3 = mcpAsset("41508925-1ab1-44b8-9e7c-e7a4a99b595e");
const imgVector = mcpAsset("fedc2c2b-3390-4a5b-8ffc-4fa60795c246");
const imgDelete = mcpAsset("b11bd1b4-ef3a-4e11-a945-fac5103d293f");
const imgLine = mcpAsset("69bff03c-fa8e-41cd-bd6f-1f3783bf0087");

function CartItem({ image, name, color, size, price, quantity, onQuantityChange, onDelete }) {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img alt={name} className="item-image" src={image} />
      </div>
      <div className="cart-item-info">
        <p className="item-name">{name}</p>
        <p className="item-detail">Color : {color}</p>
        <p className="item-detail">Size : {size}</p>
        <p className="item-price">Price : {price}</p>
      </div>
      <div className="cart-item-controls">
        <button className="delete-button" onClick={onDelete}>
          <img alt="Delete" className="delete-icon" src={imgDelete} />
        </button>
        <div className="quantity-control">
          <button className="quantity-button" onClick={() => onQuantityChange(Math.max(1, quantity - 1))}>-</button>
          <span className="quantity-value">{quantity}</span>
          <button className="quantity-button" onClick={() => onQuantityChange(quantity + 1)}>+</button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, image: imgProduct1, name: 'Adidas Initiator Class 2.2', color: 'Black', size: '36', price: '200$', quantity: 1 },
    { id: 2, image: imgProduct2, name: 'Adidas Initiator Class 2.2', color: 'Black', size: 'M', price: '150$', quantity: 1 },
    { id: 3, image: imgProduct3, name: 'Adidas Initiator Class 2.2', color: 'Black', size: 'XL', price: '150$', quantity: 1 }
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleDelete = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const discount = Math.round(subtotal * 0.2);
  const total = subtotal - discount;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Navigation activePage="products" />
        <div className="cart-icon">
          <img alt="Cart" className="cart-icon-img" src={imgVector} />
        </div>
      </div>

      <div className="cart-content">
        <a href="/products" className="back-button">Back</a>
        <p className="breadcrumb">Home &gt; Products &gt; Cart</p>

        <h1 className="cart-title">YOUR CART</h1>

        <div className="cart-container">
          <div className="cart-items-section">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                image={item.image}
                name={item.name}
                color={item.color}
                size={item.size}
                price={item.price}
                quantity={item.quantity}
                onQuantityChange={(newQty) => handleQuantityChange(item.id, newQty)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>

          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-details">
              <div className="summary-labels">
                <p className="summary-label">Subtotal</p>
                <p className="summary-label">Discount (-20%)</p>
                <p className="summary-label">Delivery Free</p>
              </div>
              <div className="summary-values">
                <p className="summary-value">{subtotal}$</p>
                <p className="summary-value discount">{discount}$</p>
                <p className="summary-value">0$</p>
              </div>
            </div>
            <div className="summary-divider">
              <img alt="" className="divider-img" src={imgLine} />
            </div>
            <div className="summary-total">
              <p className="total-label">Total</p>
              <p className="total-value">{total}$</p>
            </div>
            <button className="checkout-button">Go to Checkout</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

