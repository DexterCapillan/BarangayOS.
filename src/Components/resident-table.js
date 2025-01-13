// ResidentsTable.js
import React, { useEffect, useState } from 'react';

const ResidentsTable = () => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/residents')  // Replace with actual API URL
      .then((response) => response.json())
      .then((data) => setResidents(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Residents List</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Birthdate</th>
            <th className="px-6 py-3">Age</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((resident) => (
            <tr key={resident.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-4">{resident.name}</td>
              <td className="px-6 py-4">{resident.birthdate}</td>
              <td className="px-6 py-4">{calculateAge(resident.birthdate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResidentsTable;
