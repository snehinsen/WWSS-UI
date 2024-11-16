// This is the place all API functions will be ported over too over time

import axios from "axios";

export async function getFeed() {
  const response = await axios.get("http://localhost:8544/api/feed");
  return response.data;
}

export async function getProfile(username: string) {
  const response = await axios.get(
    "http://localhost:8544/api/profile/" + username
  );
  return response.data;
}
