import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axiosInstance.get("/api/orders");
        console.log("API Response:", ordersResponse.data);

        const ordersData = ordersResponse.data.orders || [];
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    console.log("Updating order ID:", orderId);
    try {
      const response = await axiosInstance.patch(
        `/api/orders/${orderId}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Order status updated:", response.data);
      alert(`Order ${orderId} has been ${status}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="order-management">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Customer Phone</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.customer_phone}</td>
              <td>
                <ul>
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.product}`}>
                      {item.product_name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </td>
              <td>Rs{order.total_price}</td>
              <td>{order.status}</td>
              <td>
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, "completed")}
                      className="btn-accept"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
