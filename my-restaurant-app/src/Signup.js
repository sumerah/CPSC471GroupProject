import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
  useEffect(() => {
    document.title = 'Sign Up | Bakery';
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending to backend with axios:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      console.log('Server response:', response.data);
      setSignupSuccess(true);
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center position-relative">
      <Link to="/" className="home-icon position-absolute top-0 start-0 m-4 fs-2" style={{ color: 'rgb(81, 40, 43)' }}>
        <div className="icon-circle">
          <i className="fas fa-home"></i>
        </div>
      </Link>

      <div className="login-box p-5 shadow">
        {!signupSuccess ? (
          <>
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </form>
            <div className="text-center mt-3">
              <span>Already have an account?</span>{' '}
              <Link to="/login" style={{ color: 'rgb(227, 146, 155)' }}>Log In</Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2>You have successfully signed up.</h2>
            <p>You can<a><Link to="/login" style={{ color: 'rgb(227, 146, 155)' }}> log in </Link></a>now.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupPage;