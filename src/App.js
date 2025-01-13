import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from './Components/dashboard';
import Residents from './Components/resident-table';
import './index.css';



function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Route for the Residents page */}
        <Route path="/resident-table" element={<Residents />} />
      </Routes>
    </Router>
  );
}

export default App;
