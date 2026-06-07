import {
    Avatar,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Link,
    Menu,
    Spacer,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";

import {useEffect, useState} from "react";
import {BsHandThumbsUp} from "react-icons/bs";
import {BiComment} from "react-icons/bi";
import {AiFillCopy} from "react-icons/ai";
import {MoreVertical} from "lucide-react";

import {Post} from "../../backend/types";
import {getPost} from "../../backend/api.ts";
import {useThemeColors} from "../ui/theme";

import UserProfileBadge from "../ui/UserProfileBadge";
import Comments from "./Comments.tsx";
import MakeComment from "./makeComment.tsx";
import {YouTubeEmbeds} from "./YouTubeEmbedNew.tsx";

interface Props {
    postId: number | null;
}

function PostScreen({postId}: Props) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyOpen, setReplyOpen] = useState(false);

    const colors = useThemeColors();

    useEffect(() => {
        const load = async () => {
            if (postId == null) {
                setLoading(false);
                setPost(null);
                return;
            }

            setLoading(true);

            try {
                const p = await getPost(postId);
                setPost(p);
            } catch (err) {
                console.error(err);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [postId]);

    const youtubeVideoIds =
        post?.body?.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/g)?.map(
            (v) => v.split(/v=|youtu\.be\//)[1]
        ) ?? [];

    if (loading) {
        return (
            <Flex justify="center" py={8}>
                <Spinner size="xl"/>
            </Flex>
        );
    }

    if (!post) {
        return (
            <Flex justify="center" py={8}>
                <Text>Post not found.</Text>
            </Flex>
        );
    }

    return (
        <Flex
            gap={6}
            align="start"
            w="100%"
            maxW="1800px"
            mx="auto"
            p={4}
            direction={{base: "column", lg: "row"}}
        >
            {/* LEFT SIDE */}
            <Box flex={1} minW={0} bg={colors.cardBg} borderRadius="lg" p={4}>
                <HStack gap={{base: 2, md: 3}} align="start" w="100%">
                    <Avatar.Root size="2xl">
                        <Avatar.Image
                            src={post.user.pfp}
                            alt={`${post.user.firstName}'s avatar`}
                        />
                        <Avatar.Fallback>
                            {post.user.firstName?.charAt(0)}
                            {post.user.lastName?.charAt(0)}
                        </Avatar.Fallback>
                    </Avatar.Root>

                    <VStack align="start" flex="1" w="100%" gap={0} minW={0}>
                        <HStack>
                            <Link href={`/app/profile/${post.user.handle}`}>
                                <Heading
                                    size={{base: "md", md: "lg"}}
                                    className="title"
                                >
                                    {post.user.firstName} {post.user.lastName}
                                </Heading>
                            </Link>

                            <UserProfileBadge isBot={post.user.isBot}/>
                        </HStack>

                        <Text color={colors.mutedText} fontSize={{base: "sm", md: "md"}}>
                            @{post.user.handle}
                        </Text>
                    </VStack>

                    <Spacer/>

                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <IconButton variant="subtle">
                                <MoreVertical/>
                            </IconButton>
                        </Menu.Trigger>

                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item
                                    value="copy"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `${window.location.origin}/app/post/${post.id}`
                                        );
                                    }}
                                >
                                    <AiFillCopy/> Copy Link
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Menu.Root>
                </HStack>

                <Box w="100%" mt={2}>
                    {post.body}
                </Box>

                <HStack w="100%" mt={2} wrap="wrap">
                    {post.attachedMedia?.map((media: string) => (
                        <Image key={media} src={media} maxW={350}/>
                    ))}
                </HStack>

                {youtubeVideoIds.length > 0 && (
                    <Box w="100%" mt={3} mb={1}>
                        <YouTubeEmbeds videoIds={youtubeVideoIds}/>
                    </Box>
                )}

                <Box mt={{base: 3, md: 4}} w="100%">
                    <HStack gap={2} flexWrap="wrap">
                        <Button w={{base: "100%", md: "48%"}} variant="outline">
                            <BsHandThumbsUp/> Like
                        </Button>

                        <Button
                            w={{base: "100%", md: "48%"}}
                            variant="outline"
                            onClick={() => setReplyOpen(!replyOpen)}
                        >
                            <BiComment/> Comment
                        </Button>
                    </HStack>

                    <MakeComment
                        id={post.id}
                        isOpen={replyOpen}
                        onCloseEvent={() => setReplyOpen(false)}
                        onPostEvent={() => setReplyOpen(false)}
                    />
                </Box>
            </Box>

            {/* RIGHT SIDE */}
            <Box
                flex={1}
                minW={0}
                bg={colors.cardBg}
                borderRadius="lg"
                p={4}
                maxH={{base: "unset", lg: "calc(100vh - 120px)"}}
                overflowY={{base: "visible", lg: "auto"}}
            >
                <Heading size="md" mb={4}>
                    Comments
                </Heading>

                <VStack align="stretch" gap={4}>
                    <Comments
                        postId={post.id}
                        isComment={false}
                        isLatest={true}
                        onSync={() => {
                        }}
                    />
                </VStack>
            </Box>
        </Flex>
    );
}

export default PostScreen;