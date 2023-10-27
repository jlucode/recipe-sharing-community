import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import PopupMessage from './PopupMessage';

const StarRating = ({ recordId, updateAverageRating }) => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [alreadyVotedMessage, setAlreadyVotedMessage] = useState(false);

  const token = localStorage.getItem("token");  // Get the JWT token from local storage

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleClick = async (value) => {
    if (!loggedIn) {
      // Prompt the user to log in
      console.log('Please log in to vote.');
      setShowLoginMessage(true);
      return;
    }

    if (alreadyVotedMessage) {
      setShowLoginMessage(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/record/updateRating/${recordId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ rating: value }),
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        return;
      }

      setRating(value);
      updateAverageRating(value);
      setAlreadyVotedMessage(true); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
              style={{ display: 'none' }}
            />
            <FaStar
              className="star"
              color={ratingValue <= rating ? '#ffc107' : '#FF5A5F'}
              size={20}
            />
          </label>
        );
      })}

      <PopupMessage
        show={showLoginMessage || alreadyVotedMessage}
        onClose={() => {
          setShowLoginMessage(false);
          setAlreadyVotedMessage(false);
        }}
        message={alreadyVotedMessage ? "Thank you for voting!" : "Please log in to vote"}
      />
    </div>
  );
};

export default StarRating;