import React, { useEffect, useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function OrderPage() {
    useEffect(() => {
        document.title = 'Place an Order | Bakery';
    }, []);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId);

        if (userId) {
        axios.get('http://localhost:5000/api/menu')
            .then(res => setMenuItems(res.data))
            .catch(err => console.error('Menu fetch error:', err));
        }
    }, []);

    const handleAddToCart = (item) => {
        setCart(prevCart => [...prevCart, item]);
    };

    return (
        <div className="App">
        <Header />
        <div className="container py-5 min-vh-100">
            {!isLoggedIn ? (
            <div className="text-center">
                <h2>Please log in to place an order</h2>
                <p>
                <Link to="/login" style={{ color: 'rgb(227, 146, 155)' }}>Log in</Link> or <Link to="/signup" style={{ color: 'rgb(227, 146, 155)' }}>Create an Account</Link> to start ordering.
                </p>
            </div>
            ) : (
            <>
                <h2 className="text-center mb-4">Place Your Order</h2>
                <div className="row">
                {menuItems.map((item, index) => (
                    <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                    <div className="card h-100">
                        <img src={item.ImageURL || '/images/placeholder.png'} className="card-img-top" alt={item.ItemName} />
                        <div className="card-body">
                        <h5 className="card-title">{item.ItemName}</h5>
                        <p className="card-text fw-bold">${parseFloat(item.Price || 0).toFixed(2)}</p>
                        <button className="btn btn-outline-primary w-100" onClick={() => handleAddToCart(item)}>
                            Add to Cart
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </>
            )}
        </div>
        <Footer />
        </div>
    );
}

export default OrderPage;
