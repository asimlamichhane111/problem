import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import OrderManagement from "./OrderManagement";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/owner/dashboard/");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="owner-dashboard">
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-header">Owner Dashboard</h1>

        {dashboardData && (
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Sales</h3>
              <p className="stat-value">Rs {dashboardData.total_sales}</p>
            </div>

            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{dashboardData.total_orders}</p>
            </div>

            <div className="stat-card">
              <h3>Top Products</h3>
              <ul className="top-products-list">
                {dashboardData.top_products.map((product, index) => (
                  <li key={index}>{product}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="order-management-section">
          <h2 className="section-title">Order Management</h2>
          <OrderManagement />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
