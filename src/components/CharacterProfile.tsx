import React, { useEffect, useState } from "react";
import "../syles/CharacterProfile.css";
import { ScrollPanel } from "primereact/scrollpanel";
import { getProfile } from "./api";

interface Character {
  name: string;
  pfp: string;
  bio: string;
  friends: string[];
}

interface Props {
  name: string;
}

function CharacterProfile({ name }: Props) {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (name === undefined) {
      console.error("name undefined");
      return <></>;
    }
    const fetchCharacter = async () => {
      setCharacter(await getProfile(name));
    };
    fetchCharacter();
  }, []);

  if (character == null)
    return <div>{"This profile doesn't appear to exist :("}</div>;

  return (
    <ScrollPanel>
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={character.pfp}
            alt={`${character.name}'s profile`}
            className="profile-pic"
          />
          <div className="profile-info">
            <h1 className="profile-name title">
              <em>{character.name}</em>
            </h1>
            <p className="profile-bio">{character.bio}</p>
          </div>
        </div>
        <div className="profile-content">
          <div className="profile-friends">
            <h2>Friends</h2>
            {character.friends.length !== 0 ? (
              <ul>
                {character.friends.map((friend, index) => (
                  <li key={index}>{friend}</li>
                ))}
              </ul>
            ) : (
              <p className="placeholder">
                {character.name.split(" ")[0] + " is loanly :("}
              </p>
            )}
          </div>
          <div className="profile-posts">
            <h2>Recent Posts</h2>
            <p className="placeholder">
              {character.name.split(" ")[0]} has not made any posts yet.
            </p>
          </div>
        </div>
      </div>
    </ScrollPanel>
  );
}

export default CharacterProfile;
