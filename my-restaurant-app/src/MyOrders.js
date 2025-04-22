import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:5000/api/orders/${userId}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch orders:', error);
      });
  }, [userId]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          orders.map(order => (
            <div className="card mb-3" key={order.orderId}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Order #{order.orderId}</strong>
                <span>{new Date(order.date).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })}</span>
              </div>
              <div className="card-body">
                <p>Status: <strong>{order.status}</strong></p>
                <p>Total Amount: ${order.total.toFixed(2)}</p>
                <button className="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target={`#details-${order.orderId}`}>
                  View Items
                </button>
                <div className="collapse mt-3" id={`details-${order.orderId}`}>
                  <ul className="list-group">
                    {order.items.map(item => (
                      <li className="list-group-item d-flex justify-content-between" key={item.itemId}>
                        <span>{item.itemName}</span>
                        <span>Qty: {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyOrdersPage;