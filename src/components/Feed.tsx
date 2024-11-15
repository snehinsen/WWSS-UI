// src/components/Feed.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  id: number;
  content: string;
  characterId: string;
}

function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8544/api/feed"); // Update with your backend URL
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        return (
          <>
            <h1>Unable to load feed</h1>
          </>
        );
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <Link to={`/profile/${post.characterId}`}>View Character</Link>
        </div>
      ))}
    </div>
  );
}

export default Feed;
