// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-4">
      <ul>
        <li className="py-2">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded">Dashboard</Link>
        </li>
        <li className="py-2">
          <Link to="/residents" className="block px-4 py-2 hover:bg-gray-700 rounded">Residents</Link>
        </li>
        <li className="py-2">
          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
