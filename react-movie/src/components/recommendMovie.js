import React, { useState } from "react";
import RecommendationCard from "./recommendationCard";

const genres = ["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Document"];
const releaseYears = ["1980-1989", "1990-1999", "2000-2009", "2010-2019", "2020-present"];

const RecommendMovie = () => {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedReleaseYear, setSelectedReleaseYear] = useState("");
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    console.log("Genre change", event.target.value);
  };

  const handleReleaseYearChange = (event) => {
    setSelectedReleaseYear(event.target.value);
    console.log("Release year", event.target.value);
  };

  const handleRecommendation = async () => {
    if (!selectedGenre || !selectedReleaseYear) {
      alert("Please select both genre and release year.");
      return;
    }
    
    const startYear = selectedReleaseYear.split('-')[0];

    const API_KEY = "d4f64de4"; // Replace with your actual API key
    //const API_URL = `https://www.omdbapi.com?apikey=${API_KEY}&s=${selectedGenre}&y=${selectedReleaseYear}&type=movie`;
    const API_URL = `https://www.omdbapi.com?apikey=${API_KEY}&s=${selectedGenre}&y=${startYear}&type=movie`;

    try {
      const response = await fetch(API_URL);
      console.log(API_URL);
      const data = await response.json();
      console.log(data);

      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        
        setRecommendedMovies(data.Search);
        console.log("Recommended Movie:", data.Search[0]);
      } else {
        console.log("No movies found based on the criteria.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="component-recommend">
      <h2>Recommend a Movie</h2>
      <div className="manage-buttons">
      
      
      <div>
        <label>Genre:</label>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="" disabled>Select a genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      </div>

      <div>
        <label>Release Year:</label>
        <input
          type="text"
          value={selectedReleaseYear}
          onChange={handleReleaseYearChange}
          placeholder="Enter release year"
        />
      </div>
      

      <button onClick={handleRecommendation}>Get Recommendation</button>
      

      <div className="container">
        {recommendedMovies.map((movie, index) => (
          <RecommendationCard key={index} movie={movie} />
        ))}
      </div>
      </div>
    
    </div>
  );
};

export default RecommendMovie;