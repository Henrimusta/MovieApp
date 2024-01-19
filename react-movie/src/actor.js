import React, { useState, useEffect } from "react";
import ActorCard from "./components/ActorCard";
import ReviewFormForActor from "./components/ReviewFormForActor";


const Actor = () => {
  const [movies, setMovies] = useState([]);
  const [fetchMovie, setFetchMovie] = useState([]);
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorReviews, setActorReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("ActorList");

  const API_URL = "https://www.omdbapi.com?apikey=d4f64de4";

  useEffect(() => {
    if (selectedActor) {
      fetchActorReviews();          // Execute fetchactors when selectedactors is provided
    }
  }, [selectedActor]);

  const searchMovies = async (title) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();

      console.log("API Response:", data);

      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        setMovies(data.Search);
        setActors([]);                // Clear previous actors when searching for new movies
        setSelectedMovie(null);       // Clear selected movie when searching
      } else {
        setMovies([]);
        setActors([]);
        setSelectedMovie(null);
        console.log("No movies found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const searchActors = async (imdbID) => {
    try {
      const movieResponse = await fetch(`${API_URL}&i=${imdbID}`);
      const movieData = await movieResponse.json();
      console.log("Movie Details:", movieData);

      const movieActors = movieData.Actors ? movieData.Actors.split(", ") : [];
      const movie = movieData.Title ? movieData.Title.replace(/[\{\}"]/g, '') : [];

      setActors(movieActors);
      setFetchMovie(movie);
      setSelectedMovie(movie);
      console.log("Actors:", movieActors);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMovieClick = (imdbID) => {
    setSelectedMovie(imdbID);
    searchActors(imdbID);
    setActiveTab("ReviewFormForActor");
  };

  const handleActorClick = (actor) => {
    setSelectedActor(actor);
    setActiveTab("ReviewFormForActor");
  };

  const handleSearchMovies = async () => {
    if (searchTerm.trim() === "") {           // If the search term is empty, do nothin
      return;
    }
    searchMovies(searchTerm);
    setSelectedMovie(null);
    setSelectedActor(null);
  };


  const fetchActorReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/getActorReviews/${selectedActor}`);

      if (!response.ok) {
        console.error(`HTTP Error! Status: ${response.status}`);
        return;
      }
      const actorReviewData = await response.json();

      if (actorReviewData && actorReviewData.actorReviews.length > 0) {
        setActorReviews(actorReviewData.reviewsAll);
        setActorReviews(actorReviewData.actorReviews);
      }
    } catch (error) {
      console.error("Error fetching actor reviews:", error);
    }
  };




  return (
    <div>
      <div className="actor">
        <input
          type="text"
          placeholder="Search movies"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearchMovies}>Search</button>
      </div>

      {selectedMovie ? (
        <div className="actor">
          {actors.map((actor, index) => (
            <div key={index} className="actor-card">
              <a href="#" onClick={() => handleActorClick(actor, fetchMovie)}> {/* Make actor names clickable */}
                {actor}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Search for movies to see actors</h2>
          {/* Display movie search results */}
          <div className="container">
            {movies.map((movie, index) => (
              <ActorCard
                key={index}
                movie={movie}
                onMovieClick={() => handleMovieClick(movie.imdbID)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "ReviewFormForActor" && selectedMovie && selectedActor && (
        <div>
          <ReviewFormForActor
            selectedActor={selectedActor}
            selectedMovie={selectedMovie}
            actorReviews={actorReviews}
            setActorReviews={setActorReviews}
            setSelectedMovie={setSelectedMovie}
            setSelectedActor={setSelectedActor}
            onClose={() => {
              setActiveTab("ActorList");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Actor;