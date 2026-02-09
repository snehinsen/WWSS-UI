import Markdown from "react-markdown";
import {getPostComments} from "../backend/api.ts";
import {useEffect, useState} from "react";
import {Box} from "@chakra-ui/react";

interface Props {
    postId: number;
}

interface Comment {
    id: number;
    body: string;
    postId: number;
    username: string;
}

function Comments({postId}: Props) {
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
                    <Box className="postItem" key={reply.id}>
                        <a href={`/profile/${reply.username}`}>
                            <h1 className="title">{reply.username}</h1>
                        </a>
                        <p>{reply.username || "Loading handle..."}</p>
                        <Markdown>{reply.body}</Markdown>
                    </Box>
                ))
            ) : (
                <></>
            )}
        </>
    );
}

export default Comments;
