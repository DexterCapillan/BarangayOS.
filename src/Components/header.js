// Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-green-500 text-white p-4 grid grid-cols-2">
    <h1 className="text-2xl px-6">Barangay Dashboard</h1>
    <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-500 justify-self-end">
      Logout
    </button>
  </header>
  
  );
};

export default Header;
