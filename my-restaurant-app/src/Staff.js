import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function StaffPage() {
  const role = localStorage.getItem('role');
  useEffect(() => {
    if (role !== 'Admin') {
      window.location.href = '/'; // redirect to home if not admin
    }
  }, [role]);
  useEffect(() => {
    document.title = 'Staff | Bakery';
  }, []);
  const [staffList, setStaffList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/staff')
      .then(res => setStaffList(res.data))
      .catch(err => console.error('Failed to fetch staff:', err));
  }, []);

  const handleAddStaff = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      password: form.password.value,
      role: form.role.value
    };
  
    axios.post('http://localhost:5000/api/staff', data)
      .then(() => {
        // Refresh list
        return axios.get('http://localhost:5000/api/staff');
      })
      .then(res => setStaffList(res.data))
      .catch(err => {
        console.error('Failed to add staff:', err);
        alert('Failed to add staff. Email may already exist.');
      });
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setEditFormData({
      firstName: staff.FirstName,
      lastName: staff.LastName,
      phone: staff.PhoneNumber,
      role: staff.Role
    });
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditStaff = (e, staffId) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/staff/${editingStaff.StaffID}`, editFormData)
      .then(() => axios.get('http://localhost:5000/api/staff'))
      .then(res => {
        setStaffList(res.data);
        setEditingStaff(null);
    })
    .catch(err => console.error('Failed to update staff:', err));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container py-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Staff Members</h2>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStaffModal">
                Add Staff Member
            </button>
        </div>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No staff found</td></tr>
            ) : (
              staffList.map(staff => (
                <tr key={staff.StaffID}>
                  <td>{staff.StaffID}</td>
                  <td>{staff.FirstName}</td>
                  <td>{staff.LastName}</td>
                  <td>{staff.Email}</td>
                  <td>{staff.PhoneNumber}</td>
                  <td>{staff.Role}</td>
                  <td>
                    <button className="btn btn-sm p-2" data-bs-toggle="modal" data-bs-target="#editStaffModal" onClick={() => openEditModal(staff)}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="modal fade" id="addStaffModal" tabIndex="-1" aria-labelledby="addStaffModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="addStaffModalLabel">Add New Staff Member</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form id="addStaffForm" onSubmit={handleAddStaff}>
                    <input required className="form-control mb-2" name="firstName" placeholder="First Name" />
                    <input required className="form-control mb-2" name="lastName" placeholder="Last Name" />
                    <input required type="email" className="form-control mb-2" name="email" placeholder="Email" />
                    <input required className="form-control mb-2" name="phone" placeholder="Phone Number" />
                    <input required type="password" className="form-control mb-2" name="password" placeholder="Password" />
                    <select required className="form-select mb-2" name="role">
                        <option value="">Select Role</option>
                        <option value="KitchenStaff">Kitchen Staff</option>
                        <option value="FrontOfHouse">Front of House</option>
                    </select>
                    <button type="submit" className="btn btn-primary w-100">Add</button>
                    </form>
                </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="editStaffModal" tabIndex="-1" aria-labelledby="editStaffModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Staff Member</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form id="editStaffForm" onSubmit={handleEditStaff}>
                  <input required className="form-control mb-2" name="firstName" value={editFormData.firstName} onChange={handleEditInputChange} placeholder="First Name" />
                  <input required className="form-control mb-2" name="lastName" value={editFormData.lastName} onChange={handleEditInputChange} placeholder="Last Name" />
                  <input required className="form-control mb-2" name="phone" value={editFormData.phone} onChange={handleEditInputChange} placeholder="Phone Number" />
                  <select required className="form-select mb-2" name="role" value={editFormData.role} onChange={handleEditInputChange}>
                    <option value="">Select Role</option>
                    <option value="KitchenStaff">Kitchen Staff</option>
                    <option value="FrontOfHouse">Front of House</option>
                  </select>
                  <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                  <button
                    type="button"
                    className="btn btn-danger w-100 mt-2"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this staff member?')) {
                        axios.delete(`http://localhost:5000/api/staff/${editingStaff.StaffID}`)
                            .then(() => axios.get('http://localhost:5000/api/staff'))
                            .then(res => {
                            setStaffList(res.data);
                            setEditingStaff(null);
                            })
                            .catch(err => {
                            console.error('Failed to delete staff:', err);
                            alert('Failed to delete staff.');
                            });
                        }
                    }}
                    >
                    Delete Staff Member
                </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StaffPage;