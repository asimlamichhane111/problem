import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./ProductCarousel.css";

const ProductCarousel = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axiosInstance.get("/inventory/api/top-selling/");
        if (Array.isArray(response.data)) {
          setTopProducts(response.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  useEffect(() => {
    if (topProducts.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === topProducts.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [topProducts]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  if (loading) return <div className="carousel-loading">Loading...</div>;
  if (error) return <div className="carousel-error">{error}</div>;
  if (topProducts.length === 0)
    return <div className="no-products">No bestsellers found</div>;

  return (
    <section className="product-carousel">
      <div className="carousel-header">
        <h2>Our Bestsellers</h2>
        <p>Discover customer favorites</p>
      </div>

      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {topProducts.map((product) => (
            <div key={product.id} className="carousel-slide">
              <div className="slide-image-container">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="slide-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.png";
                    }}
                  />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>
              <div className="slide-content">
                <h3>{product.name}</h3>
                <div className="product-meta">
                  <span className="product-price">Rs {product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-dots">
        {topProducts.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;
