import './App.css';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function ReservationPage() {
  return (
    <div className="App">
      {/* Header/Navbar */}
      <Header />

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
      <Footer/>
    </div>
  );
}

export default ReservationPage;
