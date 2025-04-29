import React from "react";
import Navbar from "../components/Navbar";
import ProductCarousel from "../components/ProductCarousel";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Premium Spirits Collection</h1>
            <p>Discover the finest selection of whiskey, vodka, rum and more</p>
            <a href="/products" className="btn">
              Shop Now
            </a>
          </div>
        </section>

        <ProductCarousel />

        <section className="categories">
          <div className="section-header">
            <h2>Explore Categories</h2>
            <p>Find your favorite spirits</p>
          </div>

          <div className="category-grid">
            <a href="/products/Whisky" className="category-card">
              <div className="category-image whiskey"></div>
              <h3>WHISKEY</h3>
            </a>

            <a href="/products/Beer" className="category-card">
              <div className="category-image brandy"></div>
              <h3>BEER</h3>
            </a>

            <a href="/products/Vodka" className="category-card">
              <div className="category-image vodka"></div>
              <h3>VODKA</h3>
            </a>

            <a href="/products/Rum" className="category-card">
              <div className="category-image rum"></div>
              <h3>RUM</h3>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
