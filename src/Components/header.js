// Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-green-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Barangay Dashboard</h1>
      <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-500">Logout</button>
    </header>
  );
};

export default Header;
