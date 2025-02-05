import React, { useEffect, useState } from 'react';
import BackButton from './backbutton.js'; // Import the BackButton
import Pagination from 'react-responsive-pagination'; // Pagination component
import 'react-responsive-pagination/themes/classic.css'; // Pagination CSS

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
  const [sex, setSex] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [occupation, setOccupation] = useState('');
  const [loading, setLoading] = useState(true);// Loading indicator state
  const [currentPage, setCurrentPage] = useState(1); // Current page state for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages state for pagination
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');


  
  // Fetch residents data
  const fetchResidents = async (page = 1, min = '', max = '') => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: 5,
        minAge: min || '',
        maxAge: max || '',
      }).toString();
      
      const response = await fetch(`http://localhost:5000/residents?${query}`);
      const data = await response.json();
      setResidents(data.residents);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents(currentPage, minAge, maxAge);
  }, [currentPage, minAge, maxAge]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  

  
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
      sex: sex,
      civil_status: civilStatus,
      citizenship: citizenship,
      occupation,
     
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
        setSex('');
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

  
// Handle transfer to Deceased table
const handleTransfer = (resident) => {
  fetch('http://localhost:5000/transfer-to-deceased', {
    method: 'POST',  //  POST
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ residentId: resident.id }), // Sending the correct residentId
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Data transferred:', data);
      fetchResidents();  // Reload the residents list after transfer
    })
    .catch((error) => console.error('Error:', error));
};


  return (
    <div className="container mx-auto mt-8 px-6">
      {/* Render BackButton here */}
      <BackButton />
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Residents List</h2>

 {/* Age Filter */}
 <div className="mb-4 flex gap-4">
        <input
          type="number"
          placeholder="Min Age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Max Age"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button 
          onClick={() => fetchResidents(1, minAge, maxAge)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>
      
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? 'Hide Form' : 'Add New Resident'}
      </button>
      
      <div className="relative">
      {showForm && (
   <div className="absolute top-0 left-0 right-0 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg z-10">
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
          <label className="block text-gray-700">Extension</label>
          <input
            type="text"
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
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
          <label className="block text-gray-700">Subdivision/Purok</label>
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
  <label className="block text-gray-700">Sex</label>
  <select
    value={sex}
    onChange={(e) => setSex(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">Select</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
</div>

<div className="mb-4">
  <label className="block text-gray-700">Civil Status</label>
  <select
    value={civilStatus}
    onChange={(e) => setCivilStatus(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">Select</option>
    <option value="Single">Single</option>
    <option value="Married">Married</option>
    <option value="Widowed">Widowed</option>
    <option value="Separated">Separated</option>
  </select>
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
       
      </div>
      <button 
        type="submit" 
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        Add Resident
      </button>
    </form>
  </div>
)}

{loading ? (
  <div className="flex justify-center items-center h-20">
    <p className="text-gray-500 text-lg">Loading residents...</p>
  </div>
) : (
        <div className="overflow-x-auto m-16">

        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="px-6 py-3">ID No.</th>
              <th className="px-6 py-3">Last Name</th>
              <th className="px-6 py-3">First Name</th>
              <th className="px-6 py-3">Middle Initial</th>
              <th className="px-6 py-3">Extension</th>
              <th className="px-6 py-3">Household No.</th>
              <th className="px-6 py-3">Household Role</th>
              <th className="px-6 py-3">Number</th>
              <th className="px-6 py-3">Street Name</th>
              <th className="px-6 py-3">Subdivision/Purok</th>
              <th className="px-6 py-3">Place of Birth</th>
              <th className="px-6 py-3">Birthdate</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Sex</th>
              <th className="px-6 py-3">Civil Status</th>
              <th className="px-6 py-3">Citizenship</th>
              <th className="px-6 py-3">Occupation</th>
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
      <td className="px-6 py-4">{resident.extension}</td>
      <td className="px-6 py-4">{resident.household_no}</td>
      <td className="px-6 py-4">{resident.household_role}</td>
      <td className="px-6 py-4">{resident.number}</td>
      <td className="px-6 py-4">{resident.street_name}</td>
      <td className="px-6 py-4">{resident.subdivision}</td>
      <td className="px-6 py-4">{resident.place_of_birth}</td>
      <td className="px-6 py-4">{resident.birthdate}</td>
      <td className="px-6 py-4">{resident.age}</td> {/* The backend should now send 'age' */}
      <td className="px-6 py-4">{resident.sex}</td>
      <td className="px-6 py-4">{resident.civil_status}</td>
      <td className="px-6 py-4">{resident.citizenship}</td>
      <td className="px-6 py-4">{resident.occupation}</td>
      <td className="px-6 py-4 flex space-x-2">
        <button
          onClick={() => handleDelete(resident.id)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
        <button
  onClick={() => handleTransfer(resident)}
  className="bg-yellow-500 text-white px-4 py-2 rounded"
>
  Transfer to Deceased
</button>

        
      </td>
    </tr>
  ))}
</tbody>
        </table>
        {/* Pagination Component */}
        <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={handlePageChange}
          />
      </div>
      )}
    </div>
    </div>
  );
};

export default ResidentsTable;