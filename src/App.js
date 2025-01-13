import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './Components/dashboard';
import Residents from './Components/resident-table';
import ResidentForm from './Components/residentsform'; // Import the ResidentForm component
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Route for the Residents table */}
        <Route path="/resident-table" element={<Residents />} />

        {/* Route for adding a new resident */}
        <Route path="/add-resident" element={<ResidentForm />} />  {/* This will display the form */}
      </Routes>
    </Router>
  );
}

export default App;
