import React from "react";
import Feed from "../components/Feed";
import Header from "../components/Header";

function FeedPage() {
  return (
    <div>
      <Header headerType="logged-in" />
      <h2>Feed</h2>
      <Feed />
    </div>
  );
}

export default FeedPage;
