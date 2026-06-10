import {getPostComments} from "../../backend/api.ts";
import {useEffect, useState} from "react";
import {Text, VStack} from "@chakra-ui/react";
import {Post} from "../../backend/types.ts";

import {useThemeColors} from "../ui/theme.ts";
import PostCard from "./PostCard.tsx";

interface Props {
    postId: number;
    isComment?: boolean;
    isLatest: boolean;
    onSync: () => void;
}

function Comments({postId, isComment = false, isLatest, onSync}: Props) {
    const theme = useThemeColors();
    const [replies, setReplies] = useState<Post[]>([]);

    const fetchComments = async () => {
        const comments: Post[] = await getPostComments(postId);
        setReplies(comments);
    };

    // Fetch comments on mount
    useEffect(() => {
        fetchComments();
    }, [postId]);

    useEffect(() => {
        if (!isLatest) {
            fetchComments();
            onSync();
        }
    }, [isLatest]);

    if (replies.length === 0) {
        if (isComment === false) {
            return (
                <Text
                    alignSelf="center"
                    color={theme.mutedText}
                    fontSize={{base: "sm", md: "md"}}
                    pt={2}
                >
                    No one commented here. Is it that bad or are we just ignoring it?
                </Text>
            );
        }
    }

    return (
        <VStack gap={{base: 3, md: 4}} align="stretch" w="100%" justify="start">
            {replies.map((comment: Post) => (
                <PostCard
                    key={comment.id}
                    post={comment}
                    isComment
                    onDeleteEvent={() => {
                        setTimeout(fetchComments, 200);
                    }}
                    onLikeEvent={fetchComments}
                />
            ))}
        </VStack>
    );
}

export default Comments;