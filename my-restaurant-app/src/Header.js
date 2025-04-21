import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm py-3">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">Bakery</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item px-3"><Link className="nav-link" to="/menu">Menu</Link></li>
            <li className="nav-item px-3"><a className="nav-link" href="#locations">Locations</a></li>
            <li className="nav-item px-3"><a className="nav-link" href="#order">Order</a></li>
            <Link to="/reservation" className="nav-item px-3"><a className="nav-link" href="#reservations">Reservations</a></Link>
            <li className="nav-item px-3"><a className="nav-link" href="#about">About Us</a></li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <Link to="/login" className="btn btn-primary me-2">LOG IN</Link>
          <Link to="/signup" className="btn btn-outline-primary me-3">SIGN UP</Link>
          <a href="#cart" className="text-dark fs-5">
            <i className="fas fa-shopping-cart" style={{ color: 'rgb(81, 40, 43)' }}></i>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Header;