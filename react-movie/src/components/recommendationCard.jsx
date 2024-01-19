import React, { useState } from 'react';

const RecommendationCard = ({ movie }) => {
  const [showWatchButton, setShowWatchButton] = useState(false);

  const handleMouseEnter = () => {
    setShowWatchButton(true);
  };

  const handleMouseLeave = () => {
    setShowWatchButton(false);
  };

  const handleWatchClick = () => {
    // Replace 'YOUR_YOUTUBE_VIDEO_URL' with the actual YouTube video URL
    window.location.href = 'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran';
  };

  return (
    <div className='movie-list'>
      <div className="movie">
        <div>
          <p>{movie.Year}</p>
        </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'}
            alt={movie.Title}
          />
        </div>
        <div>
          <span>{movie.Type}</span>
          <h3>{movie.Title}</h3>
          <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
          {showWatchButton && (
            <button onClick={handleWatchClick}>Watch this movie</button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;