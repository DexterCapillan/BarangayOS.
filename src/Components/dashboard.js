// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Sidebar from './sidebar';
import Header from './header';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-gray-700 mb-4">Welcome to the dashboard! You can navigate to the following pages:</p>

          {/* Navigation links */}
          <div className="mb-4">
            <Link
              to="/resident-table"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
            >
              View Residents
            </Link>
            <Link
              to="/deceased"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              View Deceased Residents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
