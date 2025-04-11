// ---- App.js ----
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
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

function Home() {
  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm py-3">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">Bakery</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item px-3"><a className="nav-link" href="#menu">Menu</a></li>
              <li className="nav-item px-3"><a className="nav-link" href="#locations">Locations</a></li>
              <li className="nav-item px-3"><a className="nav-link" href="#order">Order</a></li>
              <Link to="/reservation" className="nav-item px-3"><a className="nav-link" href="#reservations">Reservations</a></Link>
              <li className="nav-item px-3"><a className="nav-link" href="#about">About Us</a></li>
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <Link to="/login" className="btn btn-primary me-2">LOG IN</Link>
            <Link to="/signup" className="btn btn-outline-primary me-3">SIGN UP</Link>
            <a href="#cart" className="text-dark fs-5"><i className="fas fa-shopping-cart" style={{ color: 'rgb(81, 40, 43)' }}></i></a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section text-center text-white d-flex align-items-center justify-content-center">
        <div className="hero-text">
          <h1><span className="delight">Savor the Taste</span> of Every Bite!</h1>
          <p>Delicious food, easy online ordering, and hassle-free reservations.</p>
          <button className="hero-button btn btn-primary me-2">ORDER NOW</button>
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
      <footer className="text-center py-4">
        <div className="mb-3">
          <a href="#" className="text-dark mx-2"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="text-dark mx-2"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-dark mx-2"><i className="fab fa-instagram"></i></a>
          <a href="#" className="text-dark mx-2"><i className="fab fa-youtube"></i></a>
        </div>
        <p>© 2025 Bakery. All rights reserved.</p>
        <p>123 Main St, Calgary, AB | (403) 123-4567</p>
      </footer>
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
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
    </Router>
  );
}

export default App;