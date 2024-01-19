const pgPool = require("./connection");

const sql = {
  INSERT_REVIEW:
    'INSERT INTO "Review" (moviename,genre,dateposted,content, uservotescore, username) VALUES ($1, $2, $3, $4, $5, $6)',
  GET_REVIEW: 'SELECT moviename FROM "Review" WHERE moviename = $1',
  GET_ALL_BY_MOVIE: 'SELECT * FROM "Review" WHERE moviename=$1',
  GET_ALL: 'SELECT * FROM "Review"',
  GET_SPECIFIC_REVIEW: 'SELECT * FROM "Review" WHERE reviewid=$1',
  GET_USER_REVIEW: 'SELECT * FROM "Review" WHERE username=$1',
};

async function getSpecificReview(reviewid) {
  try {
    const result = await pgPool.query(sql.GET_SPECIFIC_REVIEW, [reviewid]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching review from the database:", error);
    return null;
  }
}

async function addReview(
  moviename,
  genre,
  dateposted,
  content,
  uservotescore,
  username
) {
  try {
    await pgPool.query(sql.INSERT_REVIEW, [
      moviename,
      genre,
      dateposted,
      content,
      uservotescore,
      username,
    ]);
    console.log("Review inserted successfully in review.js backend.");
  } catch (error) {
    console.error("Error inserting review into the database:", error);
  }
}

// Get all reviews
async function getReview(moviename) {
  try {
    const result = await pgPool.query(sql.GET_REVIEW);
    const reviews = result.rows.map((row) => row.moviename);
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews from the database:", error);
    return [];
  }
}

// Get content for a specific movie
async function getAllByMovie(moviename) {
  console.log("Getting data for movie:", moviename); // Add this line for debugging

  try {
    const result = await pgPool.query(sql.GET_ALL_BY_MOVIE, [moviename]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return null;
  }
}

async function getAll() {
  try {
    const result = await pgPool.query(sql.GET_ALL);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return null;
  }
}

async function getUserReview(username) {
  try {
    const result = await pgPool.query(sql.GET_USER_REVIEW, [username]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return null;
  }
}

module.exports = {
  addReview,
  getReview,
  getAllByMovie,
  getAll,
  getSpecificReview,
  getUserReview,
};
