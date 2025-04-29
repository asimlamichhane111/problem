import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import "./OwnerProduct.css";

const OwnerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/inventory/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.low_stock_threshold
  );

  const handleUpdateProduct = async (productId, newPrice, newStock) => {
    try {
      const response = await axiosInstance.put(
        `/inventory/api/products/${productId}/`,
        {
          price: newPrice,
          quantity: newStock,
        }
      );
      if (response.status === 200) {
        alert("Product updated successfully!");
        const updatedProducts = products.map((product) =>
          product.id === productId
            ? { ...product, price: newPrice, quantity: newStock }
            : product
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="owner-products-page">
      <Navbar />
      <div className="owner-products-container">
        <h1 className="page-header">Product Management</h1>

        {lowStockProducts.length > 0 && (
          <div className="low-stock-alert">
            <h2>Low Stock Products</h2>
            <div className="low-stock-list">
              {lowStockProducts.map((product) => (
                <div key={`low-${product.id}`} className="low-stock-item">
                  <span className="product-name">{product.name}</span>
                  <span className="stock-level">
                    (Stock: {product.quantity})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.quantity <= product.low_stock_threshold && (
                <div className="low-stock-banner">Low Stock!</div>
              )}

              {product.image && (
                <img
                  className="product-image"
                  src={`http://127.0.0.1:8000/inventory/${product.image.replace(
                    /^\/|\/$/g,
                    ""
                  )}`}
                  alt={product.name}
                />
              )}

              <h3 className="product-name">{product.name}</h3>

              <div className="input-group">
                <label>Price (Rs):</label>
                <input
                  type="number"
                  defaultValue={product.price}
                  onChange={(e) => {
                    const updatedProducts = products.map((p) =>
                      p.id === product.id ? { ...p, price: e.target.value } : p
                    );
                    setProducts(updatedProducts);
                  }}
                />
              </div>

              <div className="input-group">
                <label>Stock:</label>
                <input
                  type="number"
                  defaultValue={product.quantity}
                  onChange={(e) => {
                    const updatedProducts = products.map((p) =>
                      p.id === product.id
                        ? { ...p, quantity: e.target.value }
                        : p
                    );
                    setProducts(updatedProducts);
                  }}
                />
              </div>

              <button
                className="update-btn"
                onClick={() =>
                  handleUpdateProduct(
                    product.id,
                    product.price,
                    product.quantity
                  )
                }
              >
                Update Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerProducts;
