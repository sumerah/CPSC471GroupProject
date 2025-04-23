import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function KitchenOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/kitchen/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  const markCompleted = (orderId) => {
    axios.put(`http://localhost:5000/api/kitchen/orders/${orderId}`)
      .then(() => {
        setOrders(prev => prev.filter(order => order.orderId !== orderId));
      })
      .catch(err => alert('Failed to update order status'));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">Pending Orders</h2>
        {orders.length === 0 ? (
          <p>No pending orders.</p>
        ) : (
          orders.map(order => (
            <div className="card mb-3" key={order.orderId}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Order #{order.orderId}</strong>
                <span>{new Date(order.orderDate).toLocaleString()}</span>
              </div>
              <div className="card-body">
                <p>Customer: <strong>{order.customerName}</strong></p>
                <ul className="list-group mb-3">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary w-100" onClick={() => markCompleted(order.orderId)}>
                  Mark as Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default KitchenOrders;