import './App.css';
import { Link } from 'react-router-dom';

function ReservationPage() {
  return (
    <div className="App">
      {/* Header/Navbar */}
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
              <li className="nav-item px-3"><a className="nav-link" href="/reservation">Reservations</a></li>
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

      {/* Reservation Form */}
      <div className="reservation-section py-5 d-flex justify-content-center align-items-center">
        <div className="reservation-box p-5 shadow">
          <h2 className="text-center mb-4">Reserve a Table</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="name" placeholder="Jane Doe" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" placeholder="name@example.com" />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input type="date" className="form-control" id="date" />
            </div>
            <div className="mb-3">
              <label htmlFor="time" className="form-label">Time</label>
              <input type="time" className="form-control" id="time" />
            </div>
            <div className="mb-3">
              <label htmlFor="guests" className="form-label">Number of Guests</label>
              <input type="number" className="form-control" id="guests" min="1" max="20" />
            </div>
            <div className="mb-3">
              <label htmlFor="requests" className="form-label">Special Requests</label>
              <textarea className="form-control" id="requests" rows="2" placeholder="Optional..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Book Now</button>
          </form>
        </div>
      </div>

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

export default ReservationPage;
