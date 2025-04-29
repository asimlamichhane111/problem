import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../api/billing";
import OrderItem from "../components/OrderItem";
import Navbar from "../components/Navbar";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrderHistory = async () => {
      try {
        const data = await fetchOrderHistory();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    loadOrderHistory();
  }, []);

  return (
    <div className="order-history-page">
      <Navbar />
      <div className="order-history-container">
        <h1 className="order-history-header">Order History</h1>
        {orders.length === 0 ? (
          <p className="no-orders-message">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
