import {
    Avatar,
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Image,
    Link,
    Menu,
    Spacer,
    Text,
    VStack
} from "@chakra-ui/react";
import MakeComment from "./makeComment.tsx";
import Comments from "./Comments.tsx";
import "../../syles/feed.css";
import {Post} from "../../backend/types.ts";
import {useThemeColors} from "../ui/theme.ts";
import {BsHandThumbsUp, BsHandThumbsUpFill} from "react-icons/bs";
import {BiComment, BiTrash} from "react-icons/bi";
import {useEffect, useRef, useState} from "react";
import {renderPostBody} from "./HTML2Chakra.tsx";
import {MoreVertical} from "lucide-react";
import {AiFillCopy} from "react-icons/ai";
import {useUserContext} from "../../context/userContext.tsx";
import {FaFlag} from "react-icons/fa";
import {deletePost, toggleLike} from "../../backend/api.ts";
import UserProfileBadge from "../ui/UserProfileBadge.tsx";
import {YouTubeEmbeds} from "./YouTubeEmbedNew.tsx";
import {extractAllYouTubeVideoIds} from "./YouTubeExtractor.ts";


interface Props {
    post: Post;
    isComment?: boolean;
    onDeleteEvent: () => void;
    onLikeEvent: () => void;
}

function PostCard({post, isComment = false, onDeleteEvent, onLikeEvent}: Props) {
    const theme = useThemeColors();
    const [replyOpen, setReplyOpen] = useState(false);
    const actionRef = useRef<HTMLDivElement | null>(null);
    const postRef = useRef<HTMLDivElement | null>(null);
    const [anchorRect, setAnchorRect] = useState<{
        left: number;
        top: number;
        width: number;
    } | null>(null);

    // Extract YouTube video IDs from post body
    const youtubeVideoIds = extractAllYouTubeVideoIds(post.body);

    const onLike = async () => {
        const result = await toggleLike(post.id)

        if (!result) {
            alert("Failed to like post");
        }

        onLikeEvent()
    }

    useEffect(() => {
        if (!replyOpen) return;
        const compute = () => {
            const actionEl = actionRef.current;
            const postEl = postRef.current;
            if (!actionEl || !postEl) return setAnchorRect(null);
            const actionRect = actionEl.getBoundingClientRect();
            // Find the top-level root post container (data-root-post="true") so replies
            // always size to the root post card width rather than the narrow comment card.
            const rootEl = (postEl.closest('[data-root-post="true"]') as HTMLElement) || postEl;
            const rootRect = rootEl.getBoundingClientRect();
            const result = {
                left: rootRect.left,
                top: actionRect.bottom,
                width: rootRect.width,
            };
            // debug output to aid diagnosing width issues in nested replies
            try {
                // eslint-disable-next-line no-console
                console.debug(`[MakeComment anchor] postId=${post.id}`, {
                    actionRect: {
                        top: actionRect.top,
                        bottom: actionRect.bottom,
                        left: actionRect.left,
                        right: actionRect.right
                    },
                    rootRect: {left: rootRect.left, top: rootRect.top, width: rootRect.width},
                    result,
                });
            } catch (e) {
            }
            setAnchorRect(result);
        };

        compute();
        const onResize = () => compute();
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onResize, true);
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onResize, true);
        };
    }, [replyOpen]);

    const {user, loading} = useUserContext();

    const [isSynced, setIsSynced] = useState<boolean>(true)

    const onDelete = async (id: number) => {
        await deletePost(id)
        onDeleteEvent();
    }
    const onCopyLink = (id: number) => {
        console.log("CopyLink", id);
        const url = `${window.location.origin}/app/post/${id}`;
        console.log(`url: ${url}`);
        navigator.clipboard.writeText(url).then(() => {
            console.debug(`Copied post URL to clipboard: ${url}`);
        }).catch((err) => {
            console.error("Failed to copy post URL: ", err);
        });
    }

    return !loading ? (
        <Box
            bg={theme.cardBg}
            w="100%"
            minW={0}
            p={{base: 3, md: 4}}
            borderRadius={{base: "0.5rem", md: "0.75rem"}}
            boxShadow={isComment ? `inset 3px 0 0 0 ${theme.border}` : undefined}
            ref={postRef}
            data-root-post={isComment ? undefined : "true"}
        >
            <HStack
                gap={{base: 2, md: 3}}
                align="start"
                w="100%">
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
                    <HStack>
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
                        <UserProfileBadge isBot={post.user.isBot}/>
                    </HStack>
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
                            <Menu.Item
                                value="cplnk"
                                onClick={
                                    () => {
                                        onCopyLink(post.id)
                                    }
                                }
                            >
                                <AiFillCopy/> Copy Link to post
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

            <HStack
                w="100%"
                mt={2}
            >
                {
                    post.attachedMedia.map((media: string) => (
                        <Image src={media} maxW={350}/>
                    ))}
            </HStack>

            {/* YouTube video embeds */}
            {youtubeVideoIds.length > 0 && (
                <Box w="100%" mt={3} mb={1}>
                    <YouTubeEmbeds videoIds={youtubeVideoIds}/>
                </Box>
            )}

            <Box
                mt={{base: 3, md: 4}}
                w="100%"
                pl={0}
            >
                <HStack gap={2} flexWrap="wrap" minW={0} ref={actionRef as any}>
                    <IconButton
                        w={{base: "100%", md: "48%"}}
                        variant="outline"
                        onClick={onLike}
                    >
                        {post.likedBy.includes(user!!.id) ? <BsHandThumbsUpFill /> : <BsHandThumbsUp/>} Like {post.likedBy.length}
                    </IconButton>
                    <Button
                        w={{base: "100%", md: "48%"}}
                        variant="outline"
                        onClick={() => setReplyOpen(!replyOpen)}
                    >
                        <BiComment/> Comment
                    </Button>
                </HStack>

                <Box w="100%" pl={{base: 1, md: 2}} position="relative" px={{base: 3, md: 4}} mx={{base: -3, md: -4}}>

                    <MakeComment
                        {...({
                            id: post.id,
                            isOpen: replyOpen,
                            anchorRect: anchorRect ?? undefined,
                            onCLoseEvent: () => {
                                setReplyOpen(false)
                                setIsSynced(false)
                            },
                            onPostEvent: () => {
                                setReplyOpen(false);
                                setIsSynced(false);
                            }
                        } as any)}
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
                        onSync={() => {
                            setIsSynced(true)
                        }}
                    /> {/* In context of parent comment being the root post or a comment, check */}
                </Box>
            </Box>
        </Box>
    ) : <Spacer />;
}

export default PostCard;