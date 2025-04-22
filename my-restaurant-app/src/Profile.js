// src/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Fetch current profile
    axios.get('/api/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios.put('/api/profile', profile)
      .then(res => alert('Profile updated!'))
      .catch(err => console.error(err));
  };

  return (
    <div className="container py-5">
      <h2>My Profile</h2>
      <div className="form-group mb-3">
        <label>Name</label>
        <input name="name" className="form-control" value={profile.name} onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <label>Email</label>
        <input name="email" className="form-control" value={profile.email} onChange={handleChange} />
      </div>
      <div className="form-group mb-3">
        <label>Phone</label>
        <input name="phone" className="form-control" value={profile.phone} onChange={handleChange} />
      </div>
      <button className="btn btn-primary" onClick={handleUpdate}>Update Profile</button>
    </div>
  );
};

export default Profile;
