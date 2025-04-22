import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function ReservationPage({ cart, setCart }) {
  useEffect(() => {
      document.title = 'Make a Reservation | Bakery';
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '1'
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    try {
      await axios.post('http://localhost:5000/api/reservations', {
        userId,
        ...formData
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Reservation error:', err);
      alert('Reservation failed. Please try again.');
    }
  };

  return (
    <div className="App">
      <Header cartCount={Object.values(cart).reduce((sum, qty) => sum + qty, 0)} />

      <div className="reservation-section py-5 d-flex justify-content-center align-items-center">
        <div className="reservation-box p-5 shadow">
          {!isLoggedIn ? (
            <div className="text-center">
              <h2>Please log in to make a reservation</h2>
              <p>
                <Link to="/login" style={{ color: 'rgb(227, 146, 155)' }}>Log in</Link> or <Link to="/signup" style={{ color: 'rgb(227, 146, 155)' }}>Create an Account</Link> to reserve a table.
              </p>
            </div>
          ) : submitted ? (
            <div className="text-center">
              <h2>Reservation successful!</h2>
              <p>We look forward to serving you!</p>
            </div>
          ) : (
            <>
              <h2 className="text-center mb-4">Reserve a Table</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">Date</label>
                  <input type="date" className="form-control" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="time" className="form-label">Time</label>
                  <input type="time" className="form-control" id="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="guests" className="form-label">Number of Guests</label>
                  <input type="number" className="form-control" id="guests" name="guests" value={formData.guests} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Book Now</button>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ReservationPage;