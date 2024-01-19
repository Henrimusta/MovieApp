import React from 'react';
import PosterImg from '../styles/review.png'



const MovieCard = ({ movie, onMovieClick }) => {

  const onClickHandler = (event) => {
    console.log("on click handlerissa" + movie.imdbID);
    onMovieClick({
      imdbID: movie.imdbID,
      movieName: movie.Title,
    });
  };

  return (
    <div className='movielist'>
      <div className="moviecard" onClick={onClickHandler}>
        <div>
          <p>{movie.Year}</p>
        </div>
        <div>
          <img src={movie.Poster !== 'N/A' ? movie.Poster : PosterImg} alt={movie.Title} />
        </div>
        <div>
          <span>{movie.Type}</span>
          <h3>{movie.Title}</h3>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;