import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import ActorReviewCard from "./actorReviewCard";
import TopRatedActorCard from "./topRatedActorCard";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [orderBy, setOrderBy] = useState("dateposted");
  const [actorReviews, setActorReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderByActor, setOrderByActor] = useState("date");
  const [TopRatedActors, setTopRatedActors] = useState([]);
  const [resetActors, setResetActors] = useState([]);
  const [showTopRatedActors, setShowTopRatedActors] = useState(false);


  const fetchReviews = async () => {
    try {
      // Fetch reviews based on the current order
      const response = await fetch("http://localhost:3001/user/getAll");
      const data = await response.json();

      console.log(data); // Log the data to inspect its structure

      // Assuming the array of reviews is directly in the response
      setReviews(data.reviewsAll);
      console.log("Reviews state:", reviews);

    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchActorReviews = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/getAllActors");
      const data = await response.json();

      setActorReviews(data.AllActorReviews || []);

    } catch (error) {
      console.error("Error fetching actor reviews:", error);
    }
  };

  const searchActorReviews = async () => {
    try {
      // Fetch actor reviews based on the actor name provided in the search box
      const response = await fetch(`http://localhost:3001/user/getActorReviews/${searchTerm}`);
      const data = await response.json();

      // Assuming the array of actor reviews is directly in the response
      setActorReviews(data.actorReviews);

    } catch (error) {
      console.error("Error fetching actor reviews:", error);
    }
  };

  const fetchActorReviewsTop = async () => {
    try {
      console.log("Fetching Top Rated Actors...");

      const response = await fetch("http://localhost:3001/user/getTopRatedActors");
      const data = await response.json();

      if (!data || !data.topRatedActors) {
        console.error("Error fetching top-rated actors: Invalid response format", data);
        return;
      }

      const topRatedActorsWithDate = data.topRatedActors.map(actor => ({ ...actor, date: 'N/A' }));

      setActorReviews([]);
      setSearchTerm("");
      setTopRatedActors(topRatedActorsWithDate);

      // Set the state to display top-rated actors
      setShowTopRatedActors(true);

      console.log("Top Rated Actors state:", topRatedActorsWithDate);
    } catch (error) {
      console.error("Error fetching top-rated actors:", error);
    }
  };


  const sortedReviews = () => {
    const sortedReviewsAll = [...reviews];
    if (orderBy === "dateposted") {
      sortedReviewsAll.sort((a, b) => b.dateposted.localeCompare(a.dateposted));
    } else if (orderBy === "alphabetical") {
      sortedReviewsAll.sort((a, b) => a.moviename.localeCompare(b.moviename));
    } else if (orderBy === "genre") {
      sortedReviewsAll.sort((a, b) => a.genre.localeCompare(b.genre));
    } else if (orderBy === "uservotescore") {
      sortedReviewsAll.sort((a, b) => b.uservotescore - a.uservotescore);
    }
    return sortedReviewsAll
  };

  const sortedActorReviews = () => {
    const sortedActorReviewsAll = [...actorReviews];
    if (orderByActor === "date") {
      sortedActorReviewsAll.sort((a, b) => b.date.localeCompare(a.date));
    } else if (orderByActor === "alphabetical") {
      sortedActorReviewsAll.sort((a, b) => a.actorname.localeCompare(b.actorname));
    } else if (orderByActor === "votescore") {
      sortedActorReviewsAll.sort((a, b) => b.votescore - a.votescore);
    }
    return sortedActorReviewsAll
  };

  const handleOrderByChange = (event) => {
    // Update the order and fetch reviews again
    setOrderBy(event.target.value);
    setShowTopRatedActors(false);
  };

  const handleOrderByActorChange = (event) => {
    // Update the order for actor reviews
    setOrderByActor(event.target.value);
    setShowTopRatedActors(false);
  };

  const handleSearchActorReviews = () => {
    // Trigger search for actor reviews by actor name
    searchActorReviews();
    setShowTopRatedActors(false);
  };


  const handleFetchTopRatedActors = () => {
    fetchActorReviewsTop();
  };

  const handleresetActors = () => {
    fetchActorReviews(); // Fetch actor reviews again
    setSearchTerm("");
    setShowTopRatedActors(false);
    setResetActors();
  };

  useEffect(() => {
    // Fetch reviews when the component mounts
    fetchReviews();
    fetchActorReviews();
    setShowTopRatedActors(false);
  }, []);
/*
  useEffect(() => {
    // Fetch top-rated actors when TopRatedActors state changes
    if (showTopRatedActors) {
      fetchActorReviewsTop();
    }
  }, [TopRatedActors, showTopRatedActors]);*/

  console.log("11", reviews); // Log the reviews to inspect its structure


  return (
    <div className="reviews-container">
      <div className="reviews-left">
        <div className="component-container">
          <h2>Reviews</h2>
          <label>
            Order By:
            <select value={orderBy} onChange={handleOrderByChange}>
              <option value="dateposted">Date Posted</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="genre">Genre</option>
              <option value="uservotescore">User Vote Score</option>
            </select>
          </label>

          {reviews.length > 0 ? (
            <table>
              <tbody>
                {sortedReviews().map((review) => (
                  <ReviewCard key={review.reviewid} review={review}>
                    <td>{review.moviename || "N/A"}</td>
                    <td>{review.genre || "N/A"}</td>
                    <td>{review.dateposted || "N/A"}</td>
                    <td>{review.content || "N/A"}</td>
                    <td>{review.uservotescore || "N/A"}</td>
                    <td>{review.userid || "N/A"}</td>
                    {console.log("review review id", review.reviewid)}
                  </ReviewCard>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              {console.log("13", reviews)}</p>
          )}
          {console.log("12", reviews)}
        </div>
      </div>

      <div className="reviews-right">
        <div className="component-container">
          <h2>Actor Reviews</h2>
          <div>
            <label>
              Order By:
              <select value={orderByActor} onChange={handleOrderByActorChange}>
                <option value="date">Date Posted</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="votescore">User Vote Score</option>
              </select>
            </label>
            <button onClick={handleFetchTopRatedActors}>Fetch Top Rated Actors</button>
            <button onClick={handleresetActors}>Reset Actor reviews</button>
            <label>
              Search Actor Reviews:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={handleSearchActorReviews}>Search</button>
            </label>
          </div>

          {actorReviews && actorReviews.length > 0 ? (
            <table>
              <tbody>
                {sortedActorReviews().map((actorReview, index) => (
                  <ActorReviewCard key={`${actorReview.actorname}-${index}`} actorReview={actorReview}>
                    <td>{actorReview.movie || "N/A"}</td>
                    <td>{actorReview.actorname || "N/A"}</td>
                    <td>{actorReview.date || "N/A"}</td>
                    <td>{actorReview.content || "N/A"}</td>
                    <td>{actorReview.votescore || "N/A"}</td>
                    <td>{actorReview.username || "N/A"}</td>
                  </ActorReviewCard>
                ))}
              </tbody>
            </table>
          ) : (
            <p></p>
          )}


          {TopRatedActors && TopRatedActors.length > 0 ? (
            <div>
              <div className="top-rated-actors-container">
                {TopRatedActors.map((topRatedActor, index) => (
                  <TopRatedActorCard
                    key={`${topRatedActor.actorname}-${index}`}
                    actorReview={topRatedActor}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;







