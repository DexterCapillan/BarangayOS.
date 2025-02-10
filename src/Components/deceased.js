import React, { useEffect, useState } from 'react';
import BackButton from './backbutton.js';
import Pagination from 'react-responsive-pagination'; // Pagination component
import 'react-responsive-pagination/themes/classic.css'; // Pagination CSS

const DeceasedTable = () => {
  const [deceased, setDeceased] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
  const [deathDate, setDeathDate] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5); // Default items per page
 

  // Calculate Age at Death
  const calculateAgeAtDeath = (birthdate, deathDate) => {
    const birth = new Date(birthdate);
    const death = new Date(deathDate);
    let age = death.getFullYear() - birth.getFullYear();
    const m = death.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    return age;
}; 

// Fetch deceased data using fetch API
// Fetch deceased data using fetch API
useEffect(() => {
  // Define the async function to fetch data
  const fetchDeceasedData = async () => {
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch(`http://localhost:5000/deceased?page=${currentPage}&limit=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch deceased data');
      }

      const data = await response.json();
      setDeceased(data.deceased);
      setTotalPages(data.totalPages); // Update totalPages based on the server response
    } catch (error) {
      console.error('Error fetching deceased:', error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  fetchDeceasedData(); // Call the function to fetch data

}, [currentPage, itemsPerPage]); // Include itemsPerPage in the dependency array

// Define the handlePageChange function for pagination
const handlePageChange = (page) => {
  setCurrentPage(page);
};

const handleSubmit = (e) => {
  e.preventDefault();
  const newDeceased = {
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
    death_date: deathDate,
    cause_of_death: causeOfDeath,
  };

  fetch('http://localhost:5000/deceased', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newDeceased),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Deceased person added successfully!');
      setDeceased((prevDeceased) => [...prevDeceased, data]);
      setShowForm(false);
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
      setDeathDate('');
      setCauseOfDeath('');
    })
    .catch((error) => console.error('Error:', error));
};

  // Handle deceased person deletion using fetch
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      fetch(`http://localhost:5000/deceased/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            alert('Record deleted successfully!');
            setDeceased((prevDeceased) =>
              prevDeceased.filter((deceasedPerson) => deceasedPerson.id !== id)
            );
          } else {
            console.error('Failed to delete record');
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <BackButton />

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Deceased Persons List</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? 'Hide Form' : 'Add New Deceased Person'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
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
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Death Date</label>
              <input
                type="date"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Cause of Death</label>
              <input
                type="text"
                value={causeOfDeath}
                onChange={(e) => setCauseOfDeath(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            {/* Add other form fields here (householdNo, householdRole, etc.) */}
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Deceased Person
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto m-10">
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
                <th className="px-6 py-3">Age at Death</th>
                <th className="px-6 py-3">Death Date</th>
                <th className="px-6 py-3">Cause of Death</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(deceased) && deceased.map((person) => (
                <tr key={person.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{person.id_no}</td>
                  <td className="px-6 py-4">{person.last_name}</td>
                  <td className="px-6 py-4">{person.first_name}</td>
                  <td className="px-6 py-4">{person.middle_initial}</td>
                  <td className="px-6 py-4">{person.household_no}</td>
                  <td className="px-6 py-4">{person.household_role}</td>
                  <td className="px-6 py-4">{person.extension}</td>
                  <td className="px-6 py-4">{person.number}</td>
                  <td className="px-6 py-4">{person.street_name}</td>
                  <td className="px-6 py-4">{person.subdivision}</td>
                  <td className="px-6 py-4">{person.place_of_birth}</td>
                  <td className="px-6 py-4">{person.birthdate}</td>
                  <td className="px-6 py-4">
                    {calculateAgeAtDeath(person.birthdate, person.death_date)}
                  </td>
                  <td className="px-6 py-4">{person.death_date}</td>
                  <td className="px-6 py-4">{person.cause_of_death}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DeceasedTable;
