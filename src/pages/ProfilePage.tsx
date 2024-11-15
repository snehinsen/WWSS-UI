import React from "react";
import { useParams } from "react-router-dom";
import CharacterProfile from "../components/CharacterProfile";
import Header from "../components/Header";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  console.log("username from useParams:", username);
  console.log(useParams());
  return (
    <>
      <Header />
      <div>
        <CharacterProfile name={username || "none"} />
      </div>
    </>
  );
}

export default ProfilePage;