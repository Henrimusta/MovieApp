import React from 'react';
import PosterImg from '../styles/review.png';
import { useState } from 'react';
import PreviewActorReview from './previewActorReview';

const TopRatedActorCard = ({ actorReview }) => {
  const [showPreviewActorReview, setShowPreviewActorReview] = useState(false);

  const handleActorReviewClick = () => {
    setShowPreviewActorReview((prevShowActorPreview) => !prevShowActorPreview);
  };

  const closePreview = () => {
    setShowPreviewActorReview(false);
  };

  return (
    <div className="top-rated-actor-card">
      <div className="movie-list">
        <div className="movie" onClick={handleActorReviewClick}>
          <div>
            <p>{actorReview.date ? new Date(actorReview.date).toLocaleDateString('en-GB') : 'N/A'}</p>
          </div>
          <div>
            <img src={PosterImg} alt={actorReview.actorname} />
          </div>
          <div>
            <span>{actorReview.actorname || 'N/A'}</span>
            <h3>{`Average Vote Score: ${actorReview.avg_votescore !== null ? parseFloat(actorReview.avg_votescore).toFixed(1) : 'N/A'}`}</h3>
          </div>
        </div>
      </div>
      {showPreviewActorReview && <PreviewActorReview actor={actorReview} onClose={closePreview} />}
    </div>
  );
};

export default TopRatedActorCard;