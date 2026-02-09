import {useEffect, useState} from "react";
import {Box, Heading, Spinner, Text, VStack} from "@chakra-ui/react";
import Markdown from "react-markdown";
import {getFeed} from "../backend/api.ts";
import MakePost from "./makePost";
import Reply from "./Reply";
import Comments from "./Comments";
import "../syles/feed.css"
import {useColorModeValue} from "./ui/color-mode.tsx";
import {Post} from "../backend/types.ts";

function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts: Post[] = await getFeed();
                setPosts(posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([])
            } finally {
                setLoading(false);
            }
        };
        fetchPosts().then();
    }, []);

    return (
        <VStack
            gap={4}
            py={3}
            alignSelf="center"
            bg={useColorModeValue("white", "gray.900")}
            maxWidth="400px">
            <Box shadow="md" w="full" alignItems="center">
                <MakePost/>
            </Box>
            <Box px={5}>
                {loading ? (
                    <Spinner size="xl" color="blue.400"/>
                ) : posts.length > 0 ? (
                    posts.map((post: Post) => (
                        <Box key={post.id}>
                            <a href={`/app/profile/${post.user.handle}`} className="text-blue-400 hover:underline">
                                <Heading size="2xl"
                                         className="title">{post.user.name || "Loading..."}</Heading>
                            </a>
                            <Text className="text-gray-400">{post.user.handle || "Loading handle..."}</Text>
                            <Markdown className="text-gray-300">{post.body}</Markdown>
                            <Box className="bg-gray-800 p-3 rounded-lg">
                                <Reply id={post.id}/>
                                <Heading size="sm" className="text-gray-300">Replies</Heading>
                                <Comments postId={post.id}/>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Text className="text-gray-400">Nothing to see here folks</Text>
                )}
            </Box>
        </VStack>
    );
}


export default Feed;
