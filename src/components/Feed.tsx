import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollPanel } from "primereact/scrollpanel";
import { Card } from "primereact/card";
import "../syles/feed.css";
import { Button } from "primereact/button";
import { getFeed } from "./api";

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
        setPosts(await getFeed());
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
