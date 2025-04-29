import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";
import "./SalesAnalytics.css";

const OwnerSalesAnalytics = () => {
  const [chart, setChart] = useState("");

  useEffect(() => {
    const fetchSalesAnalytics = async () => {
      try {
        const response = await axiosInstance.get(
          "/billing/api/sales-analytics/"
        );
        setChart(response.data.chart);
      } catch (error) {
        console.error("Error fetching sales analytics:", error);
      }
    };

    fetchSalesAnalytics();
  }, []);

  return (
    <div className="sales-analytics-container">
      <Navbar />
      <h1 className="sales-analytics-header">Sales Analytics</h1>
      {chart && (
        <div className="sales-analytics-chart-container">
          <img src={`data:image/png;base64,${chart}`} alt="Sales Chart" />
        </div>
      )}
    </div>
  );
};

export default OwnerSalesAnalytics;
