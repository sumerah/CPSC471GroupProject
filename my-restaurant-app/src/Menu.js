import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function MenuPage() {
  useEffect(() => {
    document.title = 'Menu | Bakery';
  }, []);

  const [items, setItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    ItemName: '',
    Description: '',
    Price: '',
    Category: '',
    ImageURL: '',
    IsAvailable: true
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching menu:', err));

    const role = localStorage.getItem('role');
    if (role === 'Admin') setIsAdmin(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/menu/add', newItem)
      .then(res => {
        setItems(prev => [...prev, res.data]);
        setNewItem({
          ItemName: '', Description: '', Price: '', Category: '', ImageURL: '', IsAvailable: true
        });
        setShowForm(false);
      })
      .catch(err => console.error('Add menu item error:', err));
  };

  
  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem(item);
    // const modal = new window.bootstrap.Modal(document.getElementById('editMenuItemModal'));
    // modal.show();
  };
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/menu/update/${editingItem.ItemID}`, newItem)
      .then(res => {
        setItems(prev => prev.map(it => it.ItemID === editingItem.ItemID ? newItem : it));
        setEditingItem(null);
      })
      .catch(err => console.error('Edit menu item error:', err));
  };



  return (
    <div className="App">
      <Header />
      <section className="container py-5">
        <h2 className="text-center mb-4">Our Menu</h2>
  
        {isAdmin && (
          <div className="text-end mb-3">
            <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addMenuItemModal">
              Add Menu Item
            </button>
          </div>
        )}
  
        <div className="row">
          {items.map((item, index) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
              <div className="card h-100">
                <img src={item.ImageURL || '/images/placeholder.png'} className="card-img-top" alt={item.ItemName}/>
                {isAdmin && (
                  <button className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light p-2" data-bs-toggle="modal" data-bs-target="#editMenuItemModal" onClick={() => handleEdit(item)}>
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.ItemName}</h5>
                  <p className="card-text">{item.Description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
  
      {/* Modal for Adding Menu Item */}
      {isAdmin && (
        <div className="modal fade" id="addMenuItemModal" tabIndex="-1" aria-labelledby="addMenuItemModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title" id="addMenuItemModalLabel">Add Menu Item</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        name="ItemName"
                        placeholder="Item Name"
                        value={newItem.ItemName}
                        onChange={handleInputChange}
                        required/>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text" className="form-control" name="Category" placeholder="Category" value={newItem.Category} onChange={handleInputChange}/>
                    </div>
                    <div className="col-12">
                      <textarea className="form-control" name="Description" placeholder="Description" value={newItem.Description} onChange={handleInputChange}/>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="Price"
                        placeholder="Price"
                        value={newItem.Price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" name="ImageURL" placeholder="Image URL" value={newItem.ImageURL} onChange={handleInputChange}/>
                    </div>
                    <div className="col-12">
                      <label className="form-check-label me-3">
                        <input type="checkbox" className="form-check-input me-2" name="IsAvailable" checked={newItem.IsAvailable} onChange={handleInputChange}/>
                        Available
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Item</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Menu Item */}
      <div className="modal fade" id="editMenuItemModal" tabIndex="-1" aria-labelledby="editMenuItemModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleEditSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="editMenuItemModalLabel">Edit Menu Item</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control" name="ItemName" placeholder="Item Name" value={newItem.ItemName} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" name="Category" placeholder="Category" value={newItem.Category} onChange={handleInputChange} />
                  </div>
                  <div className="col-12">
                    <textarea className="form-control" name="Description" placeholder="Description" value={newItem.Description} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-6">
                    <input type="number" step="0.01" className="form-control" name="Price" placeholder="Price" value={newItem.Price} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" name="ImageURL" placeholder="Image URL" value={newItem.ImageURL} onChange={handleInputChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-check-label me-3">
                      <input type="checkbox" className="form-check-input me-2" name="IsAvailable" checked={newItem.IsAvailable} onChange={handleInputChange} />
                      Available
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <Footer />
    </div>
  );
}

export default MenuPage;
