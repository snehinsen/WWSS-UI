import { Panel } from "primereact/panel";
import Markdown from "react-markdown";
import { getPostComments } from "./api";
import { useEffect, useState } from "react";

interface Props {
  postId: number;
}

interface Comment {
  id: number;
  body: string;
  postId: number;
  handle?: string;
  username?: string;
}

function Comments({ postId }: Props) {
  // Use state to track comments
  const [replies, setReplies] = useState<Comment[]>([]);

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getPostComments(postId); // Ensure this returns a promise
      setReplies(comments);
      console.log(comments);
    };

    fetchComments();
  }, [postId]); // Include postId as a dependency

  return (
    <>
      {replies.length > 0 ? (
        replies.map((reply: Comment) => (
          <Panel className="postItem" key={reply.id}>
            <a href={`/profile/${reply.username}`}>
              <h1 className="title">{reply.username}</h1>
            </a>
            <p>{reply.handle || "Loading handle..."}</p>
            <Markdown>{reply.body}</Markdown>
          </Panel>
        ))
      ) : (
        <></>
      )}
    </>
  );
}

export default Comments;
