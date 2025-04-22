import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

function CartPage({ cart, setCart }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || {};
    axios.get('http://localhost:5000/api/menu')
      .then(res => {
        const menuMap = {};
        res.data.forEach(item => {
          menuMap[item.ItemID] = item;
        });
        const itemsInCart = Object.keys(storedCart).map(id => ({
          ...menuMap[id],
          quantity: storedCart[id]
        })).filter(item => item.ItemID);
        setCartItems(itemsInCart);
      })
      .catch(err => console.error('Cart load error:', err));
  }, []);

  const updateCartStorage = (items) => {
    const updated = {};
    items.forEach(item => {
      updated[item.ItemID] = item.quantity;
    });
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleIncrease = (itemId) => {
    const updated = cartItems.map(item =>
      item.ItemID === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
    updateCartStorage(updated);
  };

  const handleDecrease = (itemId) => {
    const updated = cartItems
      .map(item =>
        item.ItemID === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0);
    setCartItems(updated);
    updateCartStorage(updated);
  };

  const handleDelete = (itemId) => {
    const updated = cartItems.filter(item => item.ItemID !== itemId);
    setCartItems(updated);
    updateCartStorage(updated);
  };

  return (
    <div className="App">
      <Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      <div className="container py-5">
        <h2 className="text-center mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <div className="row">
            {cartItems.map(item => (
              <div className="col-md-6 col-lg-4 mb-4" key={item.ItemID}>
                <div className="card h-100">
                  <img src={item.ImageURL || '/images/placeholder.png'} className="card-img-top" alt={item.ItemName} />
                  <div className="card-body">
                    <h5 className="card-title">{item.ItemName}</h5>
                    <p className="card-text">${parseFloat(item.Price).toFixed(2)}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDecrease(item.ItemID)}>-</button>
                        <span className="mx-2">{item.quantity}</span>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleIncrease(item.ItemID)}>+</button>
                      </div>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.ItemID)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
