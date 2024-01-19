import React from 'react';
import PosterImg from '../styles/review.png'
import { useState } from 'react';
import PreviewActorReview from './previewActorReview';

const ActorReviewCard = ({ actorReview }) => {

    const [showpreviewActorReview, setpreviewActorReview] = useState(false);

    const handleActoReviewClick = () => {
        
        setpreviewActorReview((prevShowActorPreview) => !prevShowActorPreview);
    }

    const closePreview = () => {
        setpreviewActorReview(false);
    }

  return (
    <div className="actor-review-card">
      <div className="movielsit">
        <div className="movie" onClick={handleActoReviewClick}>
        <div>
            <p>{actorReview.date ? new Date(actorReview.date).toLocaleDateString('en-GB') : 'N/A'}</p>
          </div>
          <div>
            <img src={PosterImg} alt={actorReview.actorname} />
          </div>
          <div>
            <span>{actorReview.movie || 'N/A'}</span>
            <h3>{actorReview.actorname}</h3>
          </div>
        </div>
      </div>
      {showpreviewActorReview && <PreviewActorReview actor={actorReview} onClose={closePreview} />}
    </div>
  );
};

export default ActorReviewCard;