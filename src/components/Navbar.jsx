import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "./CartContext";
import "./Navbar.css";
import logo from "/images/logo-for-store.jpeg";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const cart=cartContext?.cart||[];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="logo">
          <img src={logo} alt="Liquor Store" className="logo-image" />
        </Link>

        <nav className="main-nav">
          <div className="user-nav">
            <Link to="/home"></Link>
            <Link to="/products">Link</Link>
            {isAuthenticated ? (
              <>
                {user?.role === "customer" && (
                  <>
                    <Link to="/order-history">ORDER HISTORY</Link>
                    <Link to="/cart" className="cart-link">
                      CART <span className="cart-count">{cart.length}</span>
                    </Link>
                  </>
                )}
                {user?.role === "owner" && (
                  <>
                    <Link to="/owner/dashboard">DASHBOARD</Link>
                    <Link to="/owner/products">PRODUCTS</Link>
                    <Link to="/owner/sales-analytics">ANALYTICS</Link>
                  </>
                )}
                <button className="logout-btn" onClick={logout}>
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link to="/login">LOGIN</Link>
                <Link to="/register">REGISTER</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
