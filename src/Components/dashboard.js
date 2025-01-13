// Dashboard.js
import React from 'react';
import Sidebar from './sidebar';
import Header from './header';
import ResidentsTable from './resident-table';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <ResidentsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
