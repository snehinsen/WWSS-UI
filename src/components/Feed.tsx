import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollPanel } from "primereact/scrollpanel";
import { Card } from "primereact/card";
import "../syles/feed.css";
import { Button } from "primereact/button";

interface Post {
  id: number;
  body: string;
  username: string;
}

function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8544/api/feed");
        let data = response.data;
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <ScrollPanel>
      {posts.length !== 0 ? (
        posts.map((post) => (
          <Card className="postItem" key={post.id} title={post.username}>
            <p>{post.body}</p>
            <a href={"/profile/" + post.username}>
              <Button>View Profile</Button>
            </a>
          </Card>
        ))
      ) : (
        <>
          <div>
            <p>Failed to load posts</p>
          </div>
        </>
      )}
    </ScrollPanel>
  );
}

export default Feed;
