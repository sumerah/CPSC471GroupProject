import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function MenuPage(){
    useEffect(() => {
        document.title = 'Menu | Bakery';
    }, []);

    const [items, setItems] = useState([]);

    useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
        .then(res => setItems(res.data))
        .catch(err => console.error('Error fetching menu:', err));
    }, []);

    return (
    <div className="App">
        <Header />
        <section className="container py-5">
        <h2 className="text-center mb-4">Our Menu</h2>
        <div className="row">
            {items.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100">
                <img src={item.ImageURL || '/images/placeholder.png'} className="card-img-top" alt={item.ItemName} />
                <div className="card-body">
                    <h5 className="card-title">{item.ItemName}</h5>
                    <p className="card-text">{item.Description}</p>
                    <p className="card-text fw-bold">${item.Price}</p>
                </div>
                </div>
            </div>
            ))}
        </div>
        </section>
        <Footer />
    </div>
    );
}

export default MenuPage;