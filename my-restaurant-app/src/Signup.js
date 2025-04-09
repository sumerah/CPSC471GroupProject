import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function SignupPage() {
  return (
    <div className="login-container d-flex align-items-center justify-content-center position-relative">
      <Link to="/" className="home-icon position-absolute top-0 start-0 m-4 fs-2" style={{ color: 'rgb(81, 40, 43)' }}>
        <div className="icon-circle">
            <i className="fas fa-home"></i>
        </div>
      </Link>

      <div className="login-box p-5 shadow">
        <h2 className="text-center mb-4">Sign Up</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input type="text" className="form-control" id="name" placeholder="Jane Doe" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
        <div className="text-center mt-3">
          <span>Already have an account?</span>{' '}
          <Link to="/login" style={{ color: 'rgb(227, 146, 155)' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;