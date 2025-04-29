import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartContext";
import { useOrder } from "../components/OrderContext";
import "../components/ProductCard.css";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  const { placeOrder } = useOrder();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePlaceOrder = () => {
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }
    placeOrder(cart, phoneNumber);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <Navbar />
        <h1>Your cart is empty!</h1>
        <h1> Feel free to add products</h1>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      <h2 className="cart-header">Your Cart</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.product_name}</h3>
              <p className="cart-item-price">
                {item.quantity} × Rs{item.price}
              </p>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total Price: Rs {getTotalPrice()}</h3>
        </div>

        <div className="phone-input-container">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            className="phone-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
