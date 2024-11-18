// This is the place all API functions will be ported over too over time

import axios from "axios";

// Just for mappings

interface Character {
  name: string;
  pfp: string;
  bio: string;
  friends: string[];
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
  console.log(getPostResponse.data);
  const getUserResponse = await axios.get(
    "http://localhost:8544/api/profile/" + getPostResponse.data.username
  );
  const user = getUserResponse.data;
  // console.log(user);
  // console.log(getPostResponse.data);
  let handle = user.handle;
  handle = "@" + handle;
  console.log("Handle: " + handle);

  return handle;
}

export async function createPost(username: string, body: string) {
  console.log("Posting...");
  await axios.post(
    "http://localhost:8540/api/addPost?username=" + username + "&body=" + body
  );
}
