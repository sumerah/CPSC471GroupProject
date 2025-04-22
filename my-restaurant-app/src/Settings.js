// src/Settings.js
import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const updatePassword = () => {
    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    axios.put('/api/settings/password', { password })
      .then(() => alert("Password updated!"))
      .catch(err => console.error(err));
  };

  return (
    <div className="container py-5">
      <h2>Settings</h2>
      <div className="form-group mb-3">
        <label>New Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label>Confirm Password</label>
        <input
          type="password"
          className="form-control"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={updatePassword}>Update Password</button>
    </div>
  );
};

export default Settings;
