import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

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
            <li className="nav-item px-3"><Link className="nav-link" to="/order">Order</Link></li>
            <li className="nav-item px-3"><Link className="nav-link" to="/reservation">Reservations</Link></li>
            <li className="nav-item px-3"><a className="nav-link" href="#about">About Us</a></li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn btn-primary me-2">LOG IN</Link>
              <Link to="/signup" className="btn btn-outline-primary me-3">SIGN UP</Link>
            </>
          ) : (
            <div className="dropdown">
              <button className="btn dropdown-toggle" type="button" id="profileMenu" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-user" style={{ color: 'rgb(81, 40, 43)' }}></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileMenu">
                <li><button className="dropdown-item" onClick={() => alert('Profile settings coming soon!')}>Profile Settings</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Log Out</button></li>
              </ul>
            </div>
          )}
          {isLoggedIn && (
            <a href="#cart" className="text-dark fs-5 ms-3">
              <i className="fas fa-shopping-cart" style={{ color: 'rgb(81, 40, 43)' }}></i>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
