import React, { useState } from 'react';
import { jwtToken } from './Signals';
import axios from 'axios';

const ReviewFormForActor = ({ selectedMovie, selectedActor, setSelectedMovie, setSelectedActor, onClose }) => {
  const [localReview, setLocalReview] = useState('');
  const [date, setdate] = useState('');
  const [votescore, setvotescore] = useState('');
  const [username, setUserName] = useState('');

  const handleChange = (event) => {
    const { id, value } = event.target;

    switch (id) {
      case 'review':
        setLocalReview(value);
        break;
      default:
        break;
    }
  };

  const handlevotescoreChange = (event) => {
    setvotescore(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = jwtToken.value;

    if (!token) {
      console.log('Please log in to add reviews.');
      alert("You must be logged in to submit a review.");
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    console.log("headers", headers);

    const currentdate = new Date();
    const daterew = currentdate.toISOString().slice(0, 10);

    const reviewActorData = {
      movie: selectedMovie || '',
      date: daterew || '',
      content: localReview,
      actorname: selectedActor || '',
      votescore: votescore || '',
    };

    console.log('Review Data:', reviewActorData);

    try {
      const response = await axios.post('http://localhost:3001/user/addActorReview', reviewActorData, { headers });

      setLocalReview('');
      setvotescore('');

      console.log('Review submitted successfully:', response.data);
      alert("Thank you for submitting a review.");
    } catch (error) {
      console.error(error);
      console.log('Failed to add review:', error.response?.data.error || error.message);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className='review-form-overlay'>
      <div className='review-form-container'>
        <form onSubmit={handleSubmit} className="ReviewFormForActor">
          <label htmlFor="review">Review</label>
          <input id="review" type="text" value={localReview} onChange={handleChange} required />
          <label htmlFor="votescore">Vote Score</label>
          <select id="votescore" value={votescore} onChange={handlevotescoreChange} required>
            <option value="">Select Vote Score</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <button type="submit">Submit</button>
          <button onClick={handleClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormForActor;