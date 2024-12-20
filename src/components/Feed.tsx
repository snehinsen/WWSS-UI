import { useEffect, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { Card } from "primereact/card";
import "../syles/feed.css";
import { Button } from "primereact/button";
import { getFeed, getHandleFromPost } from "./api";
import MakePost from "./makePost";
import { Panel } from "primereact/panel";
import Markdown from "react-markdown";
import Reply from "./Reply";
import Comments from "./Comments";

interface Post {
  id: number;
  body: string;
  username: string;
  handle?: string;
}

function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getFeed();
        const postsWithHandles = await Promise.all(
          fetchedPosts.map(async (post: Post) => ({
            ...post,
            handle: await getHandleFromPost(post.id), // Add handle to each post
          }))
        );
        setPosts(postsWithHandles);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <>
      <Panel header={null}>
        <MakePost />
      </Panel>
      <ScrollPanel>
        {posts.length !== 0 ? (
          posts.map((post) => (
            <Panel className="postItem" key={post.id}>
              <a href={"/profile/" + post.username}>
                <h1 className="title">{post.username}</h1>
              </a>
              <p>{post.handle || "Loading handle..."}</p>
              <Markdown>{post.body}</Markdown>
              <Panel header="Replies">
                <Reply id={post.id} />
                <Comments postId={post.id} />
              </Panel>
            </Panel>
          ))
        ) : (
          <div>
            <p>Nothing to see here folks</p>
          </div>
        )}
      </ScrollPanel>
    </>
  );
}

export default Feed;
