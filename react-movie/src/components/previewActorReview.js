import React, { useState, useEffect } from "react";

const PreviewActorReview = ({ actor }) => {
  const [specificReview, setSpecificReview] = useState(null);

  useEffect(() => {
    const fetchSpecificActorReview = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/getSpecificActorReview/${actor.actorreviewid}`);
        const data = await response.json();

        console.log(data); // Log the data to inspect its structure

        setSpecificReview(data);
        console.log("Specific Actor Review state:", specificReview);
      } catch (error) {
        console.error("Error fetching specific actor review:", error);
      }
    };

    fetchSpecificActorReview(); // Call the fetch function when the component mounts

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor.actorreviewid]); // Empty dependency array to run the effect only once

  if (!specificReview) {
    return <p>Loading specific actor review...</p>;
  }

  return (
    <div className="review-preview">
      <h2>{actor.actorname}</h2>
      <p>Date Posted: {new Date(actor.date).toLocaleDateString('en-GB')}</p>
      <p>Movie: {actor.movie}</p>
      <p>Content: {actor.content}</p>
      <p>Vote Score: {actor.votescore}</p>
      <p>Username: {actor.username}</p>
    </div>
  );
};

export default PreviewActorReview;