import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  // Navigate to the previous page or fallback to the home page
  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button 
      onClick={goBack} 
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      Back
    </button>
  );
};

export default BackButton;
