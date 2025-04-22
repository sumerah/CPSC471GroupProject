// ---- App.js ----
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import LoginPage from './Login';
import SignupPage from './Signup';
import ReservationPage from './Reservation';
import MenuPage from './Menu';
import Header from './Header';
import Footer from './Footer';
import OrderPage from './Order';
import CartPage from './Cart';
import CheckoutPage from './Checkout';
import MyOrdersPage from './MyOrders';


function Home() {
  return (
    <div className="App">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <header className="hero-section text-center text-white d-flex align-items-center justify-content-center">
        <div className="hero-text">
          <h1><span className="delight">Savor the Taste</span> of Every Bite!</h1>
          <p>Delicious food, easy online ordering, and hassle-free reservations.</p>
          <Link to="/order" className="hero-button btn btn-primary me-2">ORDER NOW</Link>
          <Link to="/reservation" className="hero-button btn btn-primary">RESERVE A TABLE</Link>
          
        </div>
      </header>

      {/* Signature Dishes */}
      <section className="signature-section text-center m-0 d-flex flex-column align-items-center justify-content-center">
        <h2>Our Signature</h2>
        <div className="row">
          {[
            { name: 'Plain Croissant', img: '/images/croissant.png' },
            { name: 'Raspberry Pie', img: '/images/pie.png' },
            { name: 'Cupcake', img: '/images/cupcake.png' },
          ].map((item, i) => (
            <div key={i} className="col-md-4">
              <div className="card mb-4">
                <img src={item.img} className="card-img-top" alt={item.name} />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reservation" element={<ReservationPage/>} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order" element={<OrderPage/>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;