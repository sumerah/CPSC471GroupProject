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

  try{
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = 'INSERT INTO Customers (FirstName, LastName, Email, PhoneNumber, PasswordHash) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, email, phone, hashedPassword], (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        res.status(500).send('Database error');
      } else {
        res.status(200).json({ success: true, id: result.insertId });
      }
    });

  }
  catch(err){
    console.error('Hashing error:', err);
    res.status(500).send('Server error');
  }
});

//Login 
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM Customers WHERE Email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatch) {
      return res.status(401).send('Incorrect password');
    }

    // ✅ Success
    res.status(200).json({ success: true, message: 'Login successful', userId: user.CustomerID });
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
  const { userId, date, time, guests, requests } = req.body;
  const sql = 'INSERT INTO Reservations (CustomerID, ReservationDate, ReservationTime, NumberOfGuests) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, date, time, guests], (err, result) => {
    if (err) {
      console.error('Insert reservation error:', err);
      return res.status(500).send('Database error');
    }
    res.status(200).json({ success: true });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
