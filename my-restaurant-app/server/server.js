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


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
