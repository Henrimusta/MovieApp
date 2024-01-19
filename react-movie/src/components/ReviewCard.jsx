import React from 'react';
import PosterImg from '../styles/review.png'
import PreviewReview from './previewReview';
import { useState } from 'react';


const ReviewCard = ({ review }) => {
    const [showPreview, setShowPreview] = useState(false);

    const handleReviewClick = () => {
        console.log('Clicked on movie:', review);
        setShowPreview((prevShowPreview) => !prevShowPreview);
    }

    const closePreview = () => {
        setShowPreview(false);
    }

    return (
        <div>
            <div className="movielsit">
                <div className="movie" onClick={handleReviewClick}>
                    <div>
                        <p>{new Date(review.dateposted).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div>
                        <img src={PosterImg} alt={review.moviename} />
                    </div>
                    <div>
                        <span>{review.genre}</span>
                        <h3>{review.moviename}</h3>
                    </div>
                </div>
            </div>

            {showPreview && <PreviewReview review={review} onClose={closePreview} />}
        </div>


    );
};

export default ReviewCard;