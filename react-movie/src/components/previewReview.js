import React, { useState, useEffect } from "react";

const PreviewReview = ({ review }) => {
    const [specificReview, setSpecificReview] = useState(null);

    useEffect(() => {
        const fetchSpecificReview = async () => {
            try {
                // Assuming you have a unique identifier for the review, e.g., reviewID
                const response = await fetch(`http://localhost:3001/user/getSpecificReview/${review.reviewid}`);
                console.log("reviewid previewreview:", review.reviewid);
                const data = await response.json();

                console.log(data); // Log the data to inspect its structure

                // Assuming the specific review is directly in the response
                setSpecificReview(data);
                console.log("Specific Review state:", specificReview);
            } catch (error) {
                console.error("Error fetching specific review:", error);
            }
        };

        fetchSpecificReview(); // Call the fetch function when the component mounts

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run the effect only once

    if (!specificReview) {
        return <p>Loading specific review...</p>;
    }

    return (
        <div className="review-preview">
            <h2>{review.moviename}</h2>
            <p>Genre: {review.genre}</p>
            <p>Date Posted: {new Date(review.dateposted).toLocaleDateString('en-GB')}</p>
            <p>Content: {review.content}</p>
            <p>User Vote Score: {review.uservotescore}</p>
            <p>Username: {review.username}</p>
        </div>
    );
};

export default PreviewReview;