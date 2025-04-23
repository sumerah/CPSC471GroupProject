import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    useEffect(() => {
        document.title = 'Profile Settings | Bakery';
    }, []);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: ''
    });

    useEffect(() => {
        if (!userId) {
            navigate('/'); // redirect to home if not logged in
            return;
        }
        axios.get(`http://localhost:5000/api/users/${userId}`)
        .then(res => setFormData({ ...res.data, password: '' }))
        .catch(err => console.error('Failed to fetch profile:', err));
    }, [userId]);

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios.put(`http://localhost:5000/api/users/${userId}`, formData)
        .then(() => alert('Profile updated successfully!'))
        .catch(err => alert('Failed to update profile'));
    };

    return (
        <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="container py-5 flex-grow-1">
            <h2 className="mb-4">Profile Settings</h2>
            <form onSubmit={handleSubmit}>
            <input className="form-control mb-3" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
            <input className="form-control mb-3" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
            <input className="form-control mb-3" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input className="form-control mb-3" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
            <input className="form-control mb-3" name="password" value={formData.password} onChange={handleChange} placeholder="New Password (optional)" />
            <button type="submit" className="btn btn-primary w-100">Update Profile</button>
            </form>
        </div>
        <Footer />
        </div>
    );
}

export default ProfilePage;