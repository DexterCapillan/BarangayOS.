import React, { useEffect, useState } from 'react';
import BackButton from './backbutton.js'; // Import the BackButton

const ResidentsTable = () => {
  const [residents, setResidents] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [idNo, setIdNo] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [householdNo, setHouseholdNo] = useState('');
  const [householdRole, setHouseholdRole] = useState('');
  const [extension, setExtension] = useState('');
  const [number, setNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [subdivision, setSubdivision] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [occupation, setOccupation] = useState('');
  const [member, setMember] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading indicator state
  
  // Fetch residents data
  useEffect(() => {
    fetch('http://localhost:5000/residents')
      .then((response) => response.json())
      .then((data) => {
        setResidents(data);
        setIsLoading(false); // Data fetched successfully
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newResident = {
      id_no: idNo,
      last_name: lastName,
      first_name: firstName,
      middle_initial: middleInitial,
      household_no: householdNo,
      household_role: householdRole,
      extension: extension,
      number: number,
      street_name: streetName,
      subdivision: subdivision,
      place_of_birth: placeOfBirth,
      birthdate,
      civil_status: civilStatus,
      citizenship: citizenship,
      occupation,
      member,
    };
  
    fetch('http://localhost:5000/residents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResident),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Resident added successfully!');
        setResidents((prevResidents) => [...prevResidents, data]);
        setShowForm(false);
        // Reset form fields
        setIdNo('');
        setLastName('');
        setFirstName('');
        setMiddleInitial('');
        setHouseholdNo('');
        setHouseholdRole('');
        setExtension('');
        setNumber('');
        setStreetName('');
        setSubdivision('');
        setPlaceOfBirth('');
        setBirthdate('');
        setCivilStatus('');
        setCitizenship('');
        setOccupation('');
        setMember('');
      })
      .catch((error) => console.error('Error:', error));
  };
  

  // Handle resident deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      fetch(`http://localhost:5000/residents/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setResidents((prevResidents) => prevResidents.filter((resident) => resident.id !== id));
          } else {
            console.error('Failed to delete resident');
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  
  return (
    <div className="container mx-auto mt-8 px-6">
      {/* Render BackButton here */}
      <BackButton />
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Residents List</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? 'Hide Form' : 'Add New Resident'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700">ID No.</label>
              <input
                type="text"
                value={idNo}
                onChange={(e) => setIdNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Middle Initial</label>
              <input
                type="text"
                value={middleInitial}
                onChange={(e) => setMiddleInitial(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Household No.</label>
              <input
                type="text"
                value={householdNo}
                onChange={(e) => setHouseholdNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Household Role</label>
              <input
                type="text"
                value={householdRole}
                onChange={(e) => setHouseholdRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Extension</label>
              <input
                type="text"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Number</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Street Name</label>
              <input
                type="text"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subdivision</label>
              <input
                type="text"
                value={subdivision}
                onChange={(e) => setSubdivision(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Place of Birth</label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Birthdate</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Civil Status</label>
              <input
                type="text"
                value={civilStatus}
                onChange={(e) => setCivilStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Citizenship</label>
              <input
                type="text"
                value={citizenship}
                onChange={(e) => setCitizenship(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
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
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Resident
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto max-w-full">

        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="px-6 py-3">ID No.</th>
              <th className="px-6 py-3">Last Name</th>
              <th className="px-6 py-3">First Name</th>
              <th className="px-6 py-3">Middle Initial</th>
              <th className="px-6 py-3">Household No.</th>
              <th className="px-6 py-3">Household Role</th>
              <th className="px-6 py-3">Extension</th>
              <th className="px-6 py-3">Number</th>
              <th className="px-6 py-3">Street Name</th>
              <th className="px-6 py-3">Subdivision</th>
              <th className="px-6 py-3">Place of Birth</th>
              <th className="px-6 py-3">Birthdate</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Civil Status</th>
              <th className="px-6 py-3">Citizenship</th>
              <th className="px-6 py-3">Occupation</th>
              <th className="px-6 py-3">Member</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
  {residents.map((resident) => (
    <tr key={resident.id} className="border-b hover:bg-gray-100">
      <td className="px-6 py-4">{resident.id_no}</td>
      <td className="px-6 py-4">{resident.last_name}</td>
      <td className="px-6 py-4">{resident.first_name}</td>
      <td className="px-6 py-4">{resident.middle_initial}</td>
      <td className="px-6 py-4">{resident.household_no}</td>
      <td className="px-6 py-4">{resident.household_role}</td>
      <td className="px-6 py-4">{resident.extension}</td>
      <td className="px-6 py-4">{resident.number}</td>
      <td className="px-6 py-4">{resident.street_name}</td>
      <td className="px-6 py-4">{resident.subdivision}</td>
      <td className="px-6 py-4">{resident.place_of_birth}</td>
      <td className="px-6 py-4">{resident.birthdate}</td>
      <td className="px-6 py-4">{resident.age}</td> {/* The backend should now send 'age' */}
      <td className="px-6 py-4">{resident.civil_status}</td>
      <td className="px-6 py-4">{resident.citizenship}</td>
      <td className="px-6 py-4">{resident.occupation}</td>
      <td className="px-6 py-4">{resident.member}</td>
      <td className="px-6 py-4">
        <button
          onClick={() => handleDelete(resident.id)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default ResidentsTable;
