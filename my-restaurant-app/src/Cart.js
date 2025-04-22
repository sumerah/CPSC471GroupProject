import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : {};
  });

  const updateQuantity = (id, delta) => {
    const updated = { ...cart };
    updated[id].quantity += delta;
    if (updated[id].quantity <= 0) {
      delete updated[id];
    }
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = Object.values(cart).reduce((sum, item) => sum + item.Price * item.quantity, 0);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">Your Cart</h2>
        {Object.keys(cart).length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="list-group">
            {Object.values(cart).map(item => (
              <div key={item.ItemID} className="list-group-item d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img 
                    src={item.ImageURL || '/images/placeholder.png'} 
                    alt={item.ItemName} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }} 
                  />
                  <div>
                    <h5 className="mb-1">{item.ItemName}</h5>
                    <p className="mb-0 fw-bold">${parseFloat(item.Price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm"
                  onClick={() => updateQuantity(item.ItemID, -1)}
                  title={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}>
                  {item.quantity === 1 ? (
                    <i className="fas fa-trash-alt"></i>
                  ) : ('-')}
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button className="btn btn-sm" onClick={() => updateQuantity(item.ItemID, 1)}>+</button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center fw-bold mb-3">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="text-center">
              <button className="btn btn-primary px-4"
                onClick={() => {
                  localStorage.setItem('checkoutInProgress', 'true');
                  navigate('/checkout');}}>
                Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
