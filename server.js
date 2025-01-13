const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS

// Create a connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'barangayOS', // Replace with your MySQL password
  database: 'residents_db',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Route to get all residents
app.get('/residents', (req, res) => {
  db.query('SELECT * FROM residents', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      res.json(results); // Send the residents as JSON
    }
  });
});

// Route to add a new resident
app.post('/residents', (req, res) => {
  const {
    id_no,
    last_name,
    first_name,
    middle_initial,
    household_no,
    household_role,
    extension,
    number,
    street_name,
    subdivision,
    place_of_birth,
    civil_status,
    citizenship,
    birthdate,
    occupation,
  } = req.body;

  // Calculate age based on birthdate
  const birthDate = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  const query =
    'INSERT INTO residents (id_no, last_name, first_name, middle_initial, household_no, household_role, extension, number, street_name, subdivision, place_of_birth, civil_status, citizenship, birthdate, age, occupation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    query,
    [
      id_no,
      last_name,
      first_name,
      middle_initial,
      household_no,
      household_role,
      extension,
      number,
      street_name,
      subdivision,
      place_of_birth,
      civil_status,
      citizenship,
      birthdate,
      age,
      occupation,
    ],
    (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Failed to insert data' });
      } else {
        res.status(201).json({
          id: results.insertId,
          id_no,
          last_name,
          first_name,
          middle_initial,
          household_no,
          household_role,
          extension,
          number,
          street_name,
          subdivision,
          place_of_birth,
          civil_status,
          citizenship,
          birthdate,
          age,
          occupation,
        });
      }
    }
  );
});

// Route to delete a resident by id
app.delete('/residents/:id', (req, res) => {
  const residentId = req.params.id;
  const query = 'DELETE FROM residents WHERE id = ?';

  db.query(query, [residentId], (err, results) => {
    if (err) {
      console.error('Error deleting resident:', err);
      return res.status(500).json({ error: 'Failed to delete resident' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.status(200).json({ message: 'Resident deleted successfully' });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
