import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  useEffect(() => {
    document.title = 'Log In | Bakery';
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending login data:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', response.data.role);
      navigate('/'); //redirect to home page after successful login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <Link to="/" className="home-icon position-absolute top-0 start-0 m-4 fs-2" style={{ color: 'rgb(81, 40, 43)' }}>
        <div className="icon-circle">
          <i className="fas fa-home"></i>
        </div>
      </Link>
      <div className="login-box p-5 shadow">
        <h2 className="text-center mb-4">Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="••••••••" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <a className="small" style={{ color: 'rgb(227, 146, 155)' }}>Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-primary w-100">Log In</button>
        </form>
        <div className="text-center mt-3">
          <span>Don't have an account?</span>{' '}
          <Link to="/signup" style={{ color: 'rgb(227, 146, 155)' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;