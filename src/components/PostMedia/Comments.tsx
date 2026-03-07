import {getPostComments} from "../../backend/api.ts";
import {useEffect, useState} from "react";
import {Text, VStack} from "@chakra-ui/react";
import {Post} from "../../backend/types.ts";

import {useThemeColors} from "../ui/theme.ts";
import PostCard from "./Post.tsx";

interface Props {
    postId: number;
    isComment?: boolean;
}

function Comments({postId, isComment = false}: Props) {
    const theme = useThemeColors();
    const [replies, setReplies] = useState<Post[]>([]);

    // Fetch comments on mount
    useEffect(() => {
        const fetchComments = async () => {
            const comments: Post[] = await getPostComments(postId);
            setReplies(comments);
        };
        fetchComments();
    }, [postId]);

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
        <VStack gap={{base: 3, md: 4}} align="stretch" w="100%">
            {replies.map((comment: Post) => (
                <PostCard post={comment} isComment />
            ))}
        </VStack>
    );
}

export default Comments;