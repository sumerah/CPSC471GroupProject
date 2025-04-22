import React, { useEffect, useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function OrderPage() {
    //Setting page title
    useEffect(() => {
        document.title = 'Place an Order | Bakery';
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
      
    
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId);

        if (userId) {
        axios.get('http://localhost:5000/api/menu')
            .then(res => setMenuItems(res.data))
            .catch(err => console.error('Menu fetch error:', err));
        }
    }, []);

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    });
    
    const updateCart = (item, delta) => {
        setCart(prev => {
          const updated = JSON.parse(JSON.stringify(prev)); // full copy
          const id = item.ItemID;
      
          if (!updated[id]) {
            updated[id] = { ...item, quantity: 0 };
          }
          updated[id].quantity = (updated[id].quantity || 0) + delta;
      
          if (updated[id].quantity <= 0) {
            delete updated[id];
          }
      
          return updated;
        });
    };
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    return (
        <div className="App">
        <Header/>
        <div className="container py-5 order-section">
            {!isLoggedIn ? (
            <div className="text-center order-box p-5 shadow">
                <h2>Please log in to place an order</h2>
                <p>
                <Link to="/login" style={{ color: 'rgb(227, 146, 155)' }}>Log in</Link> or <Link to="/signup" style={{ color: 'rgb(227, 146, 155)' }}>Create an Account</Link> to start ordering.
                </p>
            </div>
            ) : (
            <>
                <h2 className="text-center mb-4">Place Your Order</h2>
                <div className="row">
                {menuItems.map((item) => {
                    const quantity = cart[item.ItemID]?.quantity || 0;
                    return (
                        <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={item.ItemID}>
                        <div className="card h-100">
                            <img src={item.ImageURL || '/images/placeholder.png'} className="card-img-top" alt={item.ItemName} />
                            <div className="card-body">
                            <h5 className="card-title">{item.ItemName}</h5>
                            <p className="card-text fw-bold">${parseFloat(item.Price || 0).toFixed(2)}</p>
                            <div className="d-flex justify-content-center align-items-center">
                                <button className="btn btn-sm" onClick={() => updateCart(item, -1)}>-</button>
                                <span className="mx-2">{quantity}</span>
                                <button className="btn btn-sm" onClick={() => updateCart(item, 1)}>+</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                })}
                </div>
            </>
            )}
        </div>
        <Footer />
        </div>
    );
}

export default OrderPage;
