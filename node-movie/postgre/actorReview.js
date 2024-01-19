const pgPool = require("./connection");

const sql = {
    INSERT_ACTORREVIEW:
      'INSERT INTO "actor" (date, actorname, movie, content, votescore, username) VALUES ($1, $2, $3, $4, $5, $6)',
    GET_ACTORREVIEWS: 'SELECT * FROM "actor" WHERE actorname = $1', // Update this line
    GET_ALLACTORS: 'SELECT * FROM "actor"',
    GET_USER_ACTOR: 'SELECT * FROM "actor" WHERE username = $1',
    GET_SPECIFIC_ACTORREVIEW: 'SELECT * FROM "actor" WHERE actorreviewid=$1',
    GET_TOPRATEDACTORS: 'SELECT actorname, AVG(votescore) AS avg_votescore FROM actor GROUP BY actorname ORDER BY avg_votescore DESC LIMIT 5',
  };
  
  async function addActorReview(date, actorname, movie, content, votescore, username) {
    try {
      const result = await pgPool.query(sql.INSERT_ACTORREVIEW, [
        date,
        actorname,
        movie,
        content,
        votescore,
        username,
      ]);
  
      console.log("Review inserted successfully in actorReview.js backend:", result.rows[0]);
    } catch (error) {
      console.error("Error inserting review into the database:", error);
    }
  }

  async function getUserActor(username) {
    try {
      const result = await pgPool.query(sql.GET_USER_ACTOR, [username]);
      return result.rows;
    } catch (error) {
      console.error("Error getting actor reviews:", error);
      return null;
    }
  }

  async function getActorReviews(actorname) {
    try {
      const result = await pgPool.query(sql.GET_ACTORREVIEWS, [actorname]);
      const actorReviews = result.rows;
      console.log(actorname);
      //console.log("Actor Reviews:", actorReviews); // Log the actorReviews
      return result.rows;
    } catch (error) {
      console.error("Error fetching actor reviews from the database:", error);
      return [];
    }
  }

  async function getAllActors(){
    try{
      const result = await pgPool.query(sql.GET_ALLACTORS);
      return result.rows;
    }
    catch (error) {
      console.log("Error fetching everything from actor:", error);
      return[];
    }
  }

  async function getTopRatedActors() {
    try {
      const result = await pgPool.query(sql.GET_TOPRATEDACTORS);
      const topRatedActors = result.rows;
      return topRatedActors;
    } catch (error) {
      console.error("Error fetching top-rated actors from the database:", error);
      return [];
    }
  }

  async function getSpecificActorReview(actorreviewid) {
  try {
    const result = await pgPool.query(sql.GET_SPECIFIC_ACTORREVIEW, [actorreviewid]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching review from the database:", error);
    return null;
  }
}


  module.exports = {
    addActorReview,
    getUserActor,
    getActorReviews,
    getAllActors,
    getTopRatedActors,
    getSpecificActorReview,
  };