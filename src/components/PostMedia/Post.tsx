import {Avatar, Box, Button, Heading, HStack, IconButton, Link, Menu, Spacer, Text, VStack} from "@chakra-ui/react";
import MakeComment from "./makeComment.tsx";
import Comments from "./Comments.tsx";
import "../../syles/feed.css";
import {Post} from "../../backend/types.ts";
import {useThemeColors} from "../ui/theme.ts";
import {BsHandThumbsUp} from "react-icons/bs";
import {BiComment, BiTrash} from "react-icons/bi";
import {useState} from "react";
import {renderPostBody} from "./HTML2Chakra.tsx";
import {MoreVertical} from "lucide-react";
import {AiFillCopy} from "react-icons/ai";
import {useUserContext} from "../../context/userContext.tsx";
import {FaFlag} from "react-icons/fa";
import {deletePost} from "../../backend/api.ts";

interface Props {
    post: Post;
    isComment?: boolean;
    onDeleteEvent: () => void;
}

function PostCard({post, isComment = false, onDeleteEvent}: Props) {
    const theme = useThemeColors();
    const [replyOpen, setReplyOpen] = useState(false);

    const {user} = useUserContext();

    const [isSynced, setIsSynced] = useState<boolean>(true)

    const onDelete = async (id: number) => {
        await deletePost(id)
        onDeleteEvent();
    }

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
                <Avatar.Root size={isComment ? "md" : "2xl"} alignSelf="start">
                    <Avatar.Image src={post.user.pfp} alt={`${post.user.firstName}'s avatar`}/>
                    <Avatar.Fallback>{`${post.user!!.firstName.charAt(0) + post.user!!.lastName.charAt(0)}`}</Avatar.Fallback>
                </Avatar.Root>

                {/* Post content */}
                <VStack
                    align="start"
                    flex="1"
                    w="100%"
                    gap={0}
                    minW={0}
                >
                    <Link
                        href={`/app/profile/${post.user.handle}`}
                    >
                        <Heading
                            size={{base: "4xl", md: "3xl"}}
                            className="title"
                            py={0}
                        >
                            {`${post.user!!.firstName} ${post.user!!.lastName}` || "Loading..."}
                        </Heading>
                    </Link>
                    <Text
                        color={theme.mutedText}
                        fontSize={{base: "sm", md: "md"}}
                    >
                        @{post.user.handle || "Loading handle..."}
                    </Text>
                </VStack>
                <Spacer w="full"/>
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <IconButton variant="subtle">
                            <MoreVertical/>
                        </IconButton>
                    </Menu.Trigger>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="cplnk">
                                <AiFillCopy/> Copy Link
                            </Menu.Item>
                            {/* Delete option for own posts only, flag for rest */}
                            <Menu.Item
                                value={post.user.handle === user?.handle ? "del" : "flag"}
                                color="red"
                                onClick={() => {
                                    if (post.user.handle === user?.handle) {
                                        onDelete(post.id)
                                    } else {
                                        console.error("Flagging logic not implemented yet")
                                    }
                                }}
                            >
                                {
                                    post.user.handle === user?.handle ? (
                                        <><BiTrash/> Delete</>
                                    ) : (
                                        <>
                                            <FaFlag/> Flag Post
                                        </>
                                    )
                                }
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Menu.Root>
            </HStack>

            <Box
                w="100%"
                mt={2}
            >
                {renderPostBody(post.body)}
            </Box>

            <Box
                bg={theme.cardBg}
                p={{base: 3, md: 4}}
                borderRadius={{base: "0.5rem", md: "0.75rem"}}
                mt={{base: 3, md: 4}}
                w="100%"
                minW={0}
                px={0.5}
            >
                <HStack gap={2} flexWrap="wrap" minW={0}>
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
                    onCLoseEvent={() => {
                        setReplyOpen(false)
                        setIsSynced(false)
                    }}
                    onPostEvent={() => {
                        setReplyOpen(false);
                        setIsSynced(false);
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
                    isLatest={isSynced}
                    onSync={
                        () => {
                            setIsSynced(true)
                        }
                    }
                /> {/* In context of parent comment being the root post or a comment, check */}
            </Box>
        </Box>
    );
}

export default PostCard;