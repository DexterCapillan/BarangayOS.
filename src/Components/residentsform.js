import React, { useState } from 'react';

const ResidentForm = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [member, setMember] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert birthdate from DD-MM-YYYY to YYYY-MM-DD
    const [day, month, year] = birthdate.split('-');  // Assuming input format is DD-MM-YYYY
    const formattedBirthdate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD

    const newResident = {
      name,
      birthdate: formattedBirthdate,  // Use the formatted birthdate
      address,
      occupation,
      member,
    };

    // Make a POST request to the back-end
    fetch('http://localhost:5000/residents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResident),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Resident added:', data);
        // Optionally, reset the form or show a success message
        setName('');
        setBirthdate('');
        setAddress('');
        setOccupation('');
        setMember('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Resident</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Birthdate</label>
          <input
            type="text"  // Use text input for DD-MM-YYYY format
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="DD-MM-YYYY"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Occupation</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Member</label>
          <input
            type="text"
            value={member}
            onChange={(e) => setMember(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Resident
        </button>
      </form>
    </div>
  );
};

export default ResidentForm;