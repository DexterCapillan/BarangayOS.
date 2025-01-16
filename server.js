const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const moment = require('moment'); // Import Moment.js

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS

// Create a connection pool to MySQL for better handling of multiple requests
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // username
  password: 'barangayOS', // password
  database: 'residents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
  connection.release();  // Release the connection
});

// --- Residents Routes ---

// Route to get all residents
app.get('/residents', (req, res) => {
  pool.query('SELECT * FROM residents', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    res.json(results); // Send the residents as JSON
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

  // Basic validation for missing fields
  if (!id_no || !last_name || !first_name || !birthdate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate age based on birthdate using Moment.js
  const birthDate = moment(birthdate); // Convert the birthdate to a moment object
  const age = moment().diff(birthDate, 'years'); // Calculate the age in years

  console.log("Calculated Age:", age); // Debugging the age calculation

  // SQL query to insert the resident data along with the calculated age
  const query =
    'INSERT INTO residents (id_no, last_name, first_name, middle_initial, household_no, household_role, extension, number, street_name, subdivision, place_of_birth, civil_status, citizenship, birthdate, age, occupation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  pool.query(
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
      age, // Add the calculated age
      occupation,
    ],
    (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'Failed to insert data' });
      }

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
        age, // Include the calculated age in the response
        occupation,
      });
    }
  );
});

// Route to delete a resident by id
app.delete('/residents/:id', (req, res) => {
  const residentId = req.params.id;
  const query = 'DELETE FROM residents WHERE id = ?';

  pool.query(query, [residentId], (err, results) => {
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

// --- Deceased Persons Routes ---

// Route to get all deceased persons
app.get('/deceased', (req, res) => {
  pool.query('SELECT * FROM deceased', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    res.json(results); // Send the deceased persons as JSON
  });
});

// Route to add a new deceased person
app.post('/deceased', (req, res) => {
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
    birthdate,
    death_date,
    cause_of_death,
  } = req.body;

  // Basic validation for missing fields
  if (!id_no || !last_name || !first_name || !birthdate || !death_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query =
    'INSERT INTO deceased (id_no, last_name, first_name, middle_initial, household_no, household_role, extension, number, street_name, subdivision, place_of_birth, birthdate, death_date, cause_of_death) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  pool.query(
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
      birthdate,
      death_date,
      cause_of_death,
    ],
    (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'Failed to insert data' });
      }
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
        birthdate,
        death_date,
        cause_of_death,
      });
    }
  );
});

// Route to delete a deceased person by id
app.delete('/deceased/:id', (req, res) => {
  const deceasedId = req.params.id;
  const query = 'DELETE FROM deceased WHERE id = ?';

  pool.query(query, [deceasedId], (err, results) => {
    if (err) {
      console.error('Error deleting deceased person:', err);
      return res.status(500).json({ error: 'Failed to delete deceased person' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Deceased person not found' });
    }

    res.status(200).json({ message: 'Deceased person deleted successfully' });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
