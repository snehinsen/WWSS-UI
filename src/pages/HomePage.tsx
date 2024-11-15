import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to Wizarding World Social!</h1>
      <p>A magical social media experience with your favorite characters!</p>
      <Link to="/feed">Go to Feed</Link>
    </div>
  );
}

export default HomePage;
