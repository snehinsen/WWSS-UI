import {Avatar, Box, Button, Heading, HStack, Link, Spacer, Text, VStack} from "@chakra-ui/react";
import MakeComment from "./makeComment.tsx";
import Comments from "./Comments.tsx";
import "../../syles/feed.css";
import {Post} from "../../backend/types.ts";
import {useThemeColors} from "../ui/theme.ts";
import {BsHandThumbsUp} from "react-icons/bs";
import {BiComment} from "react-icons/bi";
import {useState} from "react";
import {renderPostBody} from "./HTML2Chakra.tsx";

interface Props {
    post: Post;
    isComment?: boolean;
}

function PostCard({post, isComment = false}: Props) {
    const theme = useThemeColors();
    const [replyOpen, setReplyOpen] = useState(false);

    return (
        <Box
            bg={theme.cardBg}
            w="100%"
            minW={0}
            p={{base: 3, md: 4}}
            borderRadius={{base: "0.5rem", md: "0.75rem"}}
            borderLeft={isComment ? `3px solid ${theme.border}` : ""}
        >
            <HStack
                gap={{base: 2, md: 3}}
                align="start"
                w="100%">
                {/* Avatar */}
                <Avatar.Root size="2xl" alignSelf="start">
                    <Avatar.Image src={post.user.pfp} alt={`${post.user.name}'s avatar`}/>
                    <Avatar.Fallback>{post.user.name.charAt(0)}</Avatar.Fallback>
                </Avatar.Root>

                {/* Post content */}
                <VStack
                    align="start"
                    w={{base: "100%", md: "calc(100% - 3rem)"}}
                    gap={0}
                >
                    <Link
                        href={`/app/profile/${post.user.handle}`}
                    >
                        <Heading
                            size={{base: "4xl", md: "3xl"}}
                            className="title"
                            py={0}
                        >
                            {post.user.name || "Loading..."}
                        </Heading>
                    </Link>
                    <Text
                        color={theme.mutedText}
                        fontSize={{base: "sm", md: "md"}}
                    >
                        @{post.user.handle || "Loading handle..."}
                    </Text>
                </VStack>
            </HStack>

            <Box
                w="100%"
                mt={2}
            >
                {renderPostBody(post.body)}
            </Box>

            {/* Action buttons + replies */}
            <Box
                bg={theme.cardBg}
                p={{base: 3, md: 4}}
                borderRadius={{base: "0.5rem", md: "0.75rem"}}
                mt={{base: 3, md: 4}}
                w="100%"
                minW={0}
                px={0.5}
            >
                <HStack gap={2} flexWrap="wrap">
                    <Button flex="1 1 48%" variant="outline">
                        <BsHandThumbsUp/> Like
                    </Button>
                    <Button
                        flex="1 1 48%"
                        variant="outline"
                        onClick={() => setReplyOpen(!replyOpen)}
                    >
                        <BiComment/> Comment
                    </Button>
                </HStack>

                <MakeComment
                    id={post.id}
                    isOpen={replyOpen}
                    onCLoseEvent={() => setReplyOpen(false)}
                    onPostEvent={() => {
                        window.location.reload(); // Reload the page as a placeholder oporation till partal rerendering is implemented.
                    }}
                />

                <Spacer h={2}/>

                {
                    !isComment && (
                        <Heading size="sm">
                            Comments
                        </Heading>
                    )
                }

                <Comments
                    postId={post.id}
                    isComment={isComment}
                /> {/* In context of parent comment being the root post or a comment, check */}
            </Box>
        </Box>
    );
}

export default PostCard;