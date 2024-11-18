import { Button } from "primereact/button";
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function HomePage() {
  return (
    <>
      <Header headerType="landing" />
      <div>
        <h1>Welcome to WWSS! (Wizarding World Social Service)</h1>
        <p>A magical social media experience with your favorite characters!</p>
        <a href="/feed">
          <Button>Get Started</Button>
        </a>
      </div>
    </>
  );
}

export default HomePage;
