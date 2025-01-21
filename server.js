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

// Function to validate date format
const isValidDate = (dateString) => {
  return moment(dateString, 'YYYY-MM-DD', true).isValid();
};

// --- Residents Routes ---
// Route to get all residents with pagination
app.get('/residents', (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page if not specified
  const offset = (page - 1) * limit;  // Calculate the offset for the query

  const query = 'SELECT * FROM residents LIMIT ? OFFSET ?';

  pool.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    // Get the total number of residents for pagination info
    pool.query('SELECT COUNT(*) AS total FROM residents', (err, countResults) => {
      if (err) {
        console.error('Error fetching total count:', err);
        return res.status(500).json({ error: 'Failed to fetch total count' });
      }

      const totalResidents = countResults[0].total;
      const totalPages = Math.ceil(totalResidents / limit);  // Calculate the total number of pages

      // Format each resident's birthdate to YYYY-MM-DD
      const formattedResults = results.map((resident) => {
        const formattedBirthdate = moment(resident.birthdate).format('YYYY-MM-DD');
        return {
          ...resident,
          birthdate: formattedBirthdate,
        };
      });

      res.json({
        residents: formattedResults,
        currentPage: page,
        totalPages: totalPages,
        totalResidents: totalResidents,
      });
    });
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

  // Validate the birthdate format
  if (!isValidDate(birthdate)) {
    return res.status(400).json({ error: 'Invalid birthdate format. Use YYYY-MM-DD.' });
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

// Route to fetch all deceased persons
app.get('/deceased', (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 15;  // Default to 10 items per page if not specified
  const offset = (page - 1) * limit;  // Calculate the offset for the query

  const query = 'SELECT * FROM deceased LIMIT ? OFFSET ?';

  pool.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error('Error fetching deceased persons:', err);
      return res.status(500).json({ error: 'Failed to fetch deceased persons' });
    }

    // Get the total number of deceased persons for pagination info
    pool.query('SELECT COUNT(*) AS total FROM deceased', (err, countResults) => {
      if (err) {
        console.error('Error fetching total count:', err);
        return res.status(500).json({ error: 'Failed to fetch total count' });
      }

      const totalDeceased = countResults[0].total;
      const totalPages = Math.ceil(totalDeceased / limit);  // Calculate the total number of pages

      // Format each deceased person's birthdate and death_date to YYYY-MM-DD
      const formattedResults = results.map((deceased) => {
        const formattedBirthdate = moment(deceased.birthdate).format('YYYY-MM-DD');
        const formattedDeathDate = moment(deceased.death_date).format('YYYY-MM-DD');
        return {
          ...deceased,
          birthdate: formattedBirthdate,
          death_date: formattedDeathDate,
        };
      });

      res.json({
        deceased: formattedResults,
        currentPage: page,
        totalPages: totalPages,
        totalDeceased: totalDeceased,
      });
    });
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

  // Validate the birthdate and death_date formats
  if (!isValidDate(birthdate) || !isValidDate(death_date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  // Calculate age at the time of death
  const birthDate = moment(birthdate); // Convert the birthdate to a moment object
  const deathDate = moment(death_date); // Convert the death date to a moment object
  const ageAtDeath = deathDate.diff(birthDate, 'years'); // Calculate the age at death in years

  console.log('Calculated Age at Death:', ageAtDeath); // Debugging the age calculation

  const query =
    'INSERT INTO deceased (id_no, last_name, first_name, middle_initial, household_no, household_role, extension, number, street_name, subdivision, place_of_birth, birthdate, death_date, cause_of_death, age_at_death) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

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
      ageAtDeath, // Add the calculated age at death
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
        ageAtDeath, // Include the calculated age at death in the response
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
app.post('/transfer-to-deceased', (req, res) => {
  const { residentId } = req.body;

  // Log the residentId being sent
  console.log('Resident ID:', residentId);

  // Fetch the resident details from the Residents table
  pool.query('SELECT * FROM residents WHERE id = ?', [residentId], (err, results) => {
    if (err) {
      console.error('Error fetching resident:', err);
      return res.status(500).json({ error: 'Failed to fetch resident' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    const resident = results[0]; // Now `resident` is defined here

    // Calculate age at death inside the same scope where `resident` is available
    const deathDate = moment().format('YYYY-MM-DD'); // Use current date for death date
    const causeOfDeath = 'Natural Causes'; // Example cause of death
    const ageAtDeath = moment(deathDate).diff(moment(resident.birthdate), 'years'); // Calculate age at death

    // Define the SQL query string for inserting into the deceased table
    const query = `INSERT INTO deceased (
      id_no, last_name, first_name, middle_initial, household_no, household_role, extension,
      number, street_name, subdivision, place_of_birth, birthdate, death_date, cause_of_death, age_at_death
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Then perform the query
    pool.query(query, [
      resident.id_no,
      resident.last_name,
      resident.first_name,
      resident.middle_initial,
      resident.household_no,
      resident.household_role,
      resident.extension,
      resident.number,
      resident.street_name,
      resident.subdivision,
      resident.place_of_birth,
      resident.birthdate,
      deathDate,
      causeOfDeath,
      ageAtDeath
    ], (insertErr) => {
      if (insertErr) {
        console.error('Error transferring to deceased:', insertErr); // Log insert error
        return res.status(500).json({ error: 'Failed to transfer to deceased' });
      }

      console.log('Data successfully inserted into deceased table');
      
      // Now delete from the Residents table
      pool.query('DELETE FROM residents WHERE id = ?', [residentId], (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting resident:', deleteErr); // Log delete error
          return res.status(500).json({ error: 'Failed to delete resident' });
        }

        res.status(200).json({ message: 'Resident successfully transferred to deceased' });
      });
    });
  });
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});