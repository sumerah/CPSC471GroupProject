import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function StaffReservations() {
  const [reservations, setReservations] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/staff/reservations')
      .then(res => setReservations(res.data))
      .catch(err => console.error('Failed to fetch reservations:', err));
  }, []);

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/staff/reservations/${editData.ReservationID}`, {
      date: editData.ReservationDate,
      time: editData.ReservationTime,
      guests: editData.NumberOfGuests
    }).then(() => {
      setEditData(null);
      return axios.get('http://localhost:5000/api/staff/reservations');
    }).then(res => setReservations(res.data))
      .catch(err => console.error('Failed to update reservation:', err));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">Manage Reservations</h2>
        {reservations.map(res => (
          <div key={res.ReservationID} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{res.FirstName} {res.LastName} ({res.PhoneNumber})</h5>
              {editData?.ReservationID === res.ReservationID ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="ReservationDate"
                        value={editData.ReservationDate?.split('T')[0] || ''}
                        onChange={handleEditChange}
                        required
                    />
                    </div>

                    <div className="mb-2">
                    <label className="form-label">Time</label>
                    <input
                        type="time"
                        className="form-control"
                        name="ReservationTime"
                        value={editData.ReservationTime?.slice(0, 5) || ''}
                        onChange={handleEditChange}
                        required
                    />
                  </div>
                  <input className="form-control mb-2" name="NumberOfGuests" value={editData.NumberOfGuests} onChange={handleEditChange} />
                  <button className="btn btn-success me-2" type="submit">Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditData(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <p>
                    Date: {new Date(res.ReservationDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                    </p>
                    <p>
                    Time: {res.ReservationTime.slice(0, 5)}
                  </p>
                  <p>Guests: {res.NumberOfGuests}</p>
                  <button className="btn btn-outline-primary" onClick={() => setEditData(res)}>Edit</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default StaffReservations;