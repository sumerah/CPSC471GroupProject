const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Create MySQL connection to restaurant database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'RestaurantDB'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

//Signup
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 1. Insert into Users
    const userSql = 'INSERT INTO Users (Email, PasswordHash, Role) VALUES (?, ?, ?)';
    db.query(userSql, [email, hashedPassword, 'Customer'], (err, userResult) => {
      if (err) {
        console.error('User insert error:', err);
        return res.status(500).send('Database error');
      }

      const userId = userResult.insertId;

      // 2. Insert into Customers
      const customerSql = 'INSERT INTO Customers (UserID, FirstName, LastName, PhoneNumber) VALUES (?, ?, ?, ?)';
      db.query(customerSql, [userId, firstName, lastName, phone], (err, customerResult) => {
        if (err) {
          console.error('Customer insert error:', err);
          return res.status(500).send('Database error');
        }

        res.status(200).json({ success: true, userId: userId });
      });
    });

  } catch (err) {
    console.error('Hashing error:', err);
    res.status(500).send('Server error');
  }
});

//Login 
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM Users WHERE Email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(401).send('User not found');

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatch) return res.status(401).send('Incorrect password');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      userId: user.UserID,
      role: user.Role
    });
  });
});

//Menu
app.get('/api/menu', (req, res) => {
  const sql = 'SELECT * FROM MenuItems';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Menu fetch error:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

//Reservation
app.post('/api/reservations', (req, res) => {
  const { userId, date, time, guests } = req.body;

  // First, get CustomerID from UserID
  const getCustomerIdSql = 'SELECT CustomerID FROM Customers WHERE UserID = ?';
  db.query(getCustomerIdSql, [userId], (err, result) => {
    if (err) {
      console.error('Customer lookup error:', err);
      return res.status(500).send('Database error');
    }

    if (result.length === 0) {
      return res.status(404).send('Customer not found');
    }

    const customerId = result[0].CustomerID;

    // Now insert the reservation
    const insertSql = 'INSERT INTO Reservations (CustomerID, ReservationDate, ReservationTime, NumberOfGuests) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [customerId, date, time, guests], (err, result) => {
      if (err) {
        console.error('Insert reservation error:', err);
        return res.status(500).send('Database error');
      }
      res.status(200).json({ success: true });
    });
  });
});

//Add menu item (admin)
app.post('/api/menu/add', (req, res) => {
  const { ItemName, Description, Price, Category, ImageURL, IsAvailable } = req.body;

  const sql = 'INSERT INTO MenuItems (ItemName, Description, Price, Category, ImageURL, IsAvailable) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [ItemName, Description, Price, Category, ImageURL, IsAvailable], (err, result) => {
    if (err) {
      console.error('Insert menu item error:', err);
      return res.status(500).send('Database error');
    }

    res.status(200).json({ ItemID: result.insertId, ItemName, Description, Price, Category, ImageURL, IsAvailable });
  });
});

//Edit menu item (admin)
app.put('/api/menu/update/:id', (req, res) => {
  const { id } = req.params;
  const { ItemName, Description, Price, Category, ImageURL, IsAvailable } = req.body;

  const sql = `UPDATE MenuItems SET 
    ItemName = ?, 
    Description = ?, 
    Price = ?, 
    Category = ?, 
    ImageURL = ?, 
    IsAvailable = ? 
    WHERE ItemID = ?`;

  db.query(sql, [ItemName, Description, Price, Category, ImageURL, IsAvailable, id], (err, result) => {
    if (err) {
      console.error('Update menu item error:', err);
      return res.status(500).send('Database error');
    }

    res.status(200).json({ success: true });
  });
});

//Delete menu item (admin)
app.delete('/api/menu/delete/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM MenuItems WHERE ItemID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete menu item error:', err);
      return res.status(500).send('Database error');
    }

    res.status(200).json({ success: true });
  });
});

// Place order
app.post('/api/orders', async (req, res) => {
  const { userId, items } = req.body;
  console.log(userId);
  console.log(items);

  try {
      // First get customer ID from user ID
      const getCustomerIdSql = 'SELECT CustomerID FROM Customers WHERE UserID = ?';
      db.query(getCustomerIdSql, [userId], (err, customerResult) => {
          if (err) {
              console.error('Customer lookup error:', err);
              return res.status(500).send('Database error');
          }

          if (customerResult.length === 0) {
              return res.status(404).send('Customer not found');
          }

          const customerId = customerResult[0].CustomerID;

          // Start transaction
          db.beginTransaction(async (err) => {
              if (err) {
                  console.error('Transaction error:', err);
                  return res.status(500).send('Database error');
              }

              try {
                  // 1. Create the order
                  const insertOrderSql = 'INSERT INTO Orders (CustomerID, Status) VALUES (?, ?)';
                  db.query(insertOrderSql, [customerId, 'Pending'], (err, orderResult) => {
                      if (err) throw err;

                      const orderId = orderResult.insertId;
                      let totalAmount = 0;

                      // 2. Add order items
                      const insertItemsPromises = items.map(item => {
                          return new Promise((resolve, reject) => {
                              const insertItemSql = 'INSERT INTO OrderDetails (OrderID, ItemID, Quantity, Price) VALUES (?, ?, ?, ?)';
                              db.query(insertItemSql, [orderId, item.ItemID, item.Quantity, item.Price], (err) => {
                                  if (err) reject(err);
                                  totalAmount += item.Price * item.Quantity;
                                  resolve();
                              });
                          });
                      });

                      Promise.all(insertItemsPromises)
                          .then(() => {
                            db.commit((err) => {
                              if (err) {
                                return db.rollback(() => {
                                  console.error('Commit error:', err);
                                  res.status(500).send('Database commit error');
                                });
                              }
                              res.status(200).json({ success: true, orderId: orderId });
                            });
                          })
                          .catch(err => {
                            db.rollback(() => {
                              console.error('Insert order details error:', err);
                              res.status(500).send('Failed to insert order items');
                            });
                          });
                  });
              } catch (error) {
                  db.rollback(() => {
                      console.error('Order processing error:', error);
                      res.status(500).send('Database error');
                  });
              }
          });
      });
  } catch (error) {
      console.error('Order processing error:', error);
      res.status(500).send('Server error');
  }
});

//Get all orders for a user
app.get('/api/orders/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT o.OrderID, o.OrderDate, o.Status, od.ItemID, mi.ItemName, od.Quantity, od.Price
    FROM Orders o
    JOIN Customers c ON o.CustomerID = c.CustomerID
    JOIN OrderDetails od ON o.OrderID = od.OrderID
    JOIN MenuItems mi ON od.ItemID = mi.ItemID
    WHERE c.UserID = ?
    ORDER BY o.OrderDate DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Order fetch error:', err);
      return res.status(500).send('Database error');
    }

    // Group by order
    const orders = {};
    results.forEach(row => {
      if (!orders[row.OrderID]) {
        orders[row.OrderID] = {
          orderId: row.OrderID,
          date: row.OrderDate,
          status: row.Status,
          items: [],
          total: 0
        };
      }

      orders[row.OrderID].items.push({
        itemId: row.ItemID,
        itemName: row.ItemName,
        quantity: row.Quantity,
        price: row.Price
      });

      orders[row.OrderID].total += row.Price * row.Quantity;
    });

    res.json(Object.values(orders));
  });
});

// Get all staff (admin)
app.get('/api/staff', (req, res) => {
  const sql = `
    SELECT s.StaffID, s.FirstName, s.LastName, u.Email, s.PhoneNumber, s.Role
    FROM Staff s
    JOIN Users u ON s.UserID = u.UserID
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fetch staff error:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// Add staff(admin)
app.post('/api/staff', (req, res) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  const insertUser = 'INSERT INTO Users (Email, PasswordHash, Role) VALUES (?, ?, ?)';
  const insertStaff = 'INSERT INTO Staff (UserID, FirstName, LastName, PhoneNumber, Role) VALUES (?, ?, ?, ?, ?)';

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return res.status(500).send('Password hash error');

    db.query(insertUser, [email, hash, 'Staff'], (err, result) => {
      if (err) return res.status(500).send('User insert error');
      const userId = result.insertId;
      db.query(insertStaff, [userId, firstName, lastName, phone, role], (err) => {
        if (err) return res.status(500).send('Staff insert error');
        res.status(200).json({ success: true });
      });
    });
  });
});

//edit staff (admin)
app.put('/api/staff/:staffId', (req, res) => {
  const { staffId } = req.params;
  const { firstName, lastName, phone, role } = req.body;
  const sql = 'UPDATE Staff SET FirstName = ?, LastName = ?, PhoneNumber = ?, Role = ? WHERE StaffID = ?';
  db.query(sql, [firstName, lastName, phone, role, staffId], (err) => {
    if (err) return res.status(500).send('Update error');
    res.status(200).json({ success: true });
  });
});

// Delete staff by ID(admin)
app.delete('/api/staff/:staffId', (req, res) => {
  const { staffId } = req.params;
  db.query('DELETE FROM Staff WHERE StaffID = ?', [staffId], (err) => {
    if (err) return res.status(500).send('Delete error');
    res.status(200).json({ success: true });
  });
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
