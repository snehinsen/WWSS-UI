import { useEffect, useState } from "react";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { getFeed } from "../backend/api.ts";
import MakePost from "./PostMedia/makePost.tsx";
import "../syles/feed.css";
import { Post } from "../backend/types.ts";
import PostCard from "./PostMedia/Post.tsx";
import {useThemeColors} from "./ui/theme.ts";

function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const colors = useThemeColors();

    const fetchPosts = async () => {
        try {
            const posts: Post[] = await getFeed();
            setPosts(posts || []);
            console.log(`Posts: ${posts}`);
        } catch (error) {
            console.error(error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <VStack
            gap={{ base: 3, sm: 4, md: 5, lg: 6 }}
            py={{ base: 3, sm: 4, md: 6 }}

            /* critical for overflow fix */
            minW={{
                base: "100%",
                sm: "10.rem",
                md: "30rem",
                lg: "35.5rem",
                xl: "40.25rem",
                "2xl": "45.25rem",
            }}
            w="100%"
            mx="auto"
            align="stretch"

            /* proper breakpoints instead of fluid percentages */
            maxW={{
                base: "100%",   // mobile fluid
                sm: "33.75rem", // 540px → tablet small
                md: "42.5rem",  // 680px → tablet large
                lg: "47.5rem",  // 760px → laptop
                xl: "51.25rem", // 820px → desktop
                "2xl": "56.25rem", // 900px → large monitors
            }}
        >
            {/* Make Post Box */}
            <Box
                shadow="md"
                w="100%"
                minW="0"
                borderRadius={{ base: "0.75rem", md: "1rem" }}
            >
                <MakePost
                    onPost={() => {
                        setTimeout(fetchPosts, 200);
                    }}
                />
            </Box>

            {/* Posts */}
            {loading ? (
                <Spinner alignSelf="center" size="xl" color="blue.400" />
            ) : posts.length > 0 ? (
                posts.map((post: Post) => (
                    <Box
                        key={post.id}
                        w="100%"
                        id={`${post.id}`}
                    >
                        <PostCard
                            key={post.id}
                            post={post}
                            isComment={false}
                            onDeleteEvent={() => {
                                setTimeout(fetchPosts, 200);
                            }}
                        />
                    </Box>
                ))
            ) : (
                <Text textAlign="center" color={colors.mutedText}>
                    Nothing to see here folks
                </Text>
            )}
        </VStack>
    );
}

export default Feed;