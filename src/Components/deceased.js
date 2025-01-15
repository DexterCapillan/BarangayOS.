import React, { useEffect, useState } from 'react';
import BackButton from './backbutton.js'; 

const DeceasedTable = () => {
  const [deceased, setDeceased] = useState([]);  // Ensure initial value is an empty array
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

  // Fetch deceased data using fetch API
  useEffect(() => {
    fetch('http://localhost:5000/deceased')
      .then((response) => response.json())
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setDeceased(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  // Calculate age based on birthdate
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Handle form submission using fetch
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
      {/* Render BackButton here */}
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
            {/* Other form fields */}
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
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Deceased Person
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="px-6 py-4">{calculateAge(person.birthdate)}</td>
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
        </div>
      )}
    </div>
  );
};

export default DeceasedTable;
