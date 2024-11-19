// This is the place all API functions will be ported over too over time

import axios from "axios";

// Just for mappings

interface Character {
  name: string;
  pfp: string;
  bio: string;
  friends: string[];
}

interface Comment {
  id: number,
  body: string,
  username: string,
}

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

export async function getHandleFromPost(postId: number) {
  const getPostResponse = await axios.get(
    "http://localhost:8544/api/getPost?id=" + postId
  );
  const getUserResponse = await axios.get(
    "http://localhost:8544/api/profile/" + getPostResponse.data.username
  );
  const user = getUserResponse.data;
  let handle = user.handle;
  handle = "@" + handle;
  return handle;
}

export async function createPost(username: string, body: string) {
  console.log("Posting...");
  await axios.post(
    "http://localhost:8544/api/addPost?username=" + 
    username + 
    "&body=" + encodeURIComponent(body)
  );
}

export async function getPostComments(id:number) {
  const comments = await axios.get(
    "http://localhost:8544/api/getPostComments/" + id
  );
  return comments.data;
}