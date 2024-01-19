import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "./profileCard";

const UserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [userLinks, setUserLinks] = useState([]);
  const [userActor, setUserActor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const formatDateTime = (dateTimeString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  const formatDateTime2 = (dateTimeString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  // ... (existing code)

  useEffect(() => {
    if (!fetching) fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      setFetching(true);

      const response = await fetch(
        `http://localhost:3001/user/getUser/${username}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User data:", data);

      if (data.user) {
        console.log("Setting user data:", data.user);
        setUserData(data.user);
        console.log("userData565:", data.user);

        try {
          console.log("Fetching user reviews...");

          const reviewsResponse = await fetch(
            `http://localhost:3001/user/getUserReview/${username}`
          );

          if (!reviewsResponse.ok) {
            throw new Error(`HTTP Error! status: ${reviewsResponse.status}`);
          }

          const reviewsData = await reviewsResponse.json();
          console.log("Reviews data:", reviewsData);
          if (reviewsData && reviewsData.userReviews.length > 0)
            console.log("userReviews if:", reviewsData.userReviews);
          console.log("reviesData if:", reviewsData);
          console.log(
            "reviewsData.userReviews if:",
            reviewsData.userReviews.length
          );
          setUserReviews(reviewsData.userReviews);
          console.log("userReviews else112:", reviewsData.userReviews);
          //else setUserReviews([]);
          console.log("userReviews else:", userReviews);
        } catch (reviewsError) {
          console.error("Error fetching user reviews:", reviewsError);
          setUserReviews([]); // Set an empty array in case of an error
          setFetching(false);
        }

        try {
          console.log("Fetching user links...");

          const linkResponse = await fetch(
            `http://localhost:3001/user/getUserLinks/${username}`
          );

          if (!linkResponse.ok) {
            throw new Error(`HTTP Error! status: ${linkResponse.status}`);
          }

          const linkData = await linkResponse.json();
          console.log("Links data:", linkData);
          if (linkData && linkData.userLinks.length > 0)
            console.log("userLinks if:", linkData.userLinks);
          console.log("linkData if:", linkData);
          console.log("linkData.userLinks if:", linkData.userLinks.length);
          setUserLinks(linkData.userLinks);
        } catch (linkError) {
          console.error("Error fetching user links:", linkError);
          setUserLinks([]); // Set an empty array in case of an error
          setFetching(false);
        }

        try {
          console.log("Fetching user actor...");

          const actorResponse = await fetch(
            `http://localhost:3001/user/getUserActor/${username}`
          );

          if (!actorResponse.ok) {
            throw new Error(`HTTP Error! status: ${actorResponse.status}`);
          }

          const actorData = await actorResponse.json();
          console.log("Actor data:", actorData);
          if (actorData && actorData.userActor.length > 0)
            console.log("userActor if:", actorData.userActor);
          console.log("actorData if:", actorData);
          console.log("actorData.userActor if:", actorData.userActor.length);
          setUserActor(actorData.userActor);
        } finally {
          setLoading(false); // Set loading to false after both fetches
          setFetching(false);
        }
      } else {
        console.warn("User not found");
        setLoading(false); // Set loading to false if user not found
        setFetching(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false); // Set loading to false in case of an error
      setFetching(false);
    }
  };

  // ... (existing code)

  return (
    <>
      {userData && userData.username ? (
        (console.log("userData1234:", userData),
          (
            <>
              {
                <div>
                  <h2>{userData.username}'s Profile</h2>
                  <div>
                    <h2>Reviews:</h2>
                    {userReviews && userReviews.length > 0 ? (
                      <div className="movie-list">
                        {userReviews.map((review, index) => (
                          <ProfileCard key={review.reviewid} review={review}>
                            <h3>{review.moviename}</h3>
                            <p>{review.uservotescore}</p>
                            <p>{review.content}</p>
                            <p>
                              {new Date(review.dateposted).toLocaleDateString()}
                            </p>
                            <span>{review.genre}</span>
                          </ProfileCard>
                        ))}
                      </div>
                    ) : (
                      <p>No reviews available.</p>
                    )}
                  </div>
                  <div>
                    <h2>Links:</h2>
                    {userLinks && userLinks.length > 0 ? (
                      userLinks.map((link) => (
                        <div key={link.linkname} className="link-card">
                          <h3>{link.linkname}</h3>
                          <p>Date Added: {formatDateTime(link.dateadded)}</p>
                          <a
                            href={link.personallink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.personallink}
                          </a>
                        </div>
                      ))
                    ) : (
                      <p>No links available.</p>
                    )}
                  </div>

                  <h2>Actor Reviews:</h2>
                  <div className="movie-list">
                    {userActor && userActor.length > 0 ? (
                      userActor.map((actor) => (
                        <div key={actor.actorreviewid} className="actor-card">
                          <h3>{actor.actorname}</h3>
                          <p>Date Added: {formatDateTime2(actor.date)}</p>
                          <a
                            href={actor.movie}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {actor.movie}
                          </a>
                          <p>{actor.content}</p>
                          <p>{actor.votescore}</p>
                        </div>
                      ))
                    ) : (
                      <p>No actor reviews available.</p>
                    )}
                  </div>

                </div>
              }
            </>
          ))
      ) : (
        <>
          <p> Loading ... </p>
        </>
      )}
    </>
  );
};

export default UserProfile;
