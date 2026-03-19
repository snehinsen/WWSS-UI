import {ReactElement, useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    Grid,
    Heading,
    HStack,
    IconButton,
    Link,
    Menu,
    Portal,
    ScrollArea,
    Spinner,
    Stack,
    Tabs,
    Text,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";

import {getProfile, getUserPosts} from "../backend/api.ts";
import {Post, User} from "../backend/types.ts";
import {BsFilePost, BsPeople, BsPerson} from "react-icons/bs";

import {useThemeColors} from "./ui/theme.ts";
import {FaEdit} from "react-icons/fa";
import {CiSettings} from "react-icons/ci";
import {useUserContext} from "../context/userContext";
import {IoPersonRemoveOutline} from "react-icons/io5";
import {FiMoreVertical} from "react-icons/fi";
import {renderPostBody} from "./PostMedia/HTML2Chakra.tsx";

interface Props {
    name: string;
}

function UserProfile({name}: Props) {
    const theme = useThemeColors();
    const {user} = useUserContext();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMe, setIsMe] = useState(false);
    const [isFriend, setIsFriend] = useState(false);

    const [posts, setPosts] = useState<Post[]>([]); // only not blank if it is me.

    const scrollBarOrientation = useBreakpointValue<"horizontal" | "vertical" | undefined>({
        base: "vertical",
        md: "horizontal"
    });

    useEffect(() => {
        if (!name) {
            window.location.href = "/app/not-found";
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);

                const profile = await getProfile(name);

                let resolvedUser: User = profile;
                let me: boolean = false;

                if (user && profile.handle === user.handle) {
                    resolvedUser = user;
                    me = true;
                }

                const postsData: Post[] = await getUserPosts(resolvedUser.handle);

                const friend = !!resolvedUser.friends?.some(
                    (f) => f.handle === user?.handle
                );

                // ensure arrays are never undefined
                resolvedUser = {
                    ...resolvedUser,
                    friends: resolvedUser.friends ?? [],
                };

                setSelectedUser(resolvedUser);
                setIsMe(me);
                setIsFriend(friend);
                setPosts(postsData ?? []);

            } catch (err) {
                console.error(err);
                setSelectedUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [name, user]);

    if (!selectedUser || !user)
        return loading ? (
            <Spinner size="xl" color={theme.textPrimary} justifySelf="center" alignSelf="center"/>
        ) : (
            <Text color={theme.textPrimary}>This profile doesn't appear to exist :(</Text>
        );

    return (
        <Box w="100%" minH="100vh" bg={theme.bgPage} py={{base: 4, md: 6}} px={{base: 3, md: 6}}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                    <Spinner size="xl"/>
                </Box>
            ) : (
                <Box maxW="1200px" mx="auto">
                    {/* Cover */}
                    <Box
                        h={{base: "150px", md: "250px"}}
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        borderRadius={{base: "none", md: "lg"}}
                        mb={{base: -8, md: -16}}
                        position="relative"
                        zIndex={1}
                    />

                    <Box
                        bg={theme.cardBg}
                        borderRadius={{base: "none", md: "lg"}}
                        shadow={{base: "none", md: "lg"}}
                        p={{base: 4, md: 6}}
                        border={`1px solid ${theme.border}`}
                        position="relative"
                        zIndex={2}
                    >
                        {/* Header */}
                        <HStack
                            gap={{base: 4, md: 6}}
                            pb={6}
                            borderBottom={`1px solid ${theme.border}`}
                            justifyContent="space-between"
                            align="start"
                            flexWrap="wrap"
                        >
                            <HStack
                                gap={{base: 4, md: 6}}
                                flex={1}
                                align="center"
                                flexWrap="wrap"
                            >
                                <Avatar.Root size={{base: "xl", md: "2xl"}}>
                                    <Avatar.Image src={selectedUser.pfp} alt={selectedUser.firstName}/>
                                    <Avatar.Fallback>{selectedUser.firstName.charAt(0)}</Avatar.Fallback>
                                </Avatar.Root>
                                <VStack align="start" gap={1}>
                                    <Heading className="title" size="4xl">{selectedUser.firstName}</Heading>
                                    <Text color={theme.textSecondary}>@{selectedUser.handle}</Text>
                                    <Text color={theme.textPrimary}>{selectedUser.bio ?? "No bio set"}</Text>
                                </VStack>
                            </HStack>

                            {!isMe ? (
                                !isFriend ? (
                                    <Button
                                        bg={theme.buttonPrimary}
                                        color={theme.textPrimary}
                                        _hover={{bg: theme.buttonPrimaryHover}}
                                    >
                                        <BsPerson/> Add Friend
                                    </Button>
                                ) : (
                                    <Button
                                        colorScheme="red"
                                    >
                                        <IoPersonRemoveOutline/> Remove Friend
                                    </Button>
                                )) : (
                                <Button
                                    variant="ghost"
                                    color={theme.textPrimary}
                                    _hover={{bg: theme.hoverBg}}
                                >
                                    <Menu.Root>
                                        <Menu.Trigger asChild>
                                            <IconButton bg="transparent" color={theme.textPrimary}>
                                                <FiMoreVertical/>
                                            </IconButton>
                                        </Menu.Trigger>
                                        <Portal>
                                            <Menu.Positioner>
                                                <Menu.Content
                                                    bg={theme.cardBg}
                                                    border={`1px solid ${theme.border}`}
                                                    shadow="lg"
                                                >
                                                    <Menu.Item value="Edit" _hover={{bg: theme.hoverBg}}>
                                                        <FaEdit/>Edit Profile
                                                    </Menu.Item>
                                                    <Menu.Item value="settings" _hover={{bg: theme.hoverBg}}>
                                                        <CiSettings/>Settings
                                                    </Menu.Item>
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Portal>
                                    </Menu.Root>
                                </Button>
                            )}
                        </HStack>

                        {/* Stats */}
                        <Grid templateColumns="1fr 1fr" gap={4} py={6}>
                            <Box>
                                <Heading color={theme.textPrimary}>{selectedUser.friends.length}</Heading>
                                <Text color={theme.textSecondary}>Friends</Text>
                            </Box>
                            <Box>
                                <Heading color={theme.textPrimary}>{posts.length}</Heading>
                                <Text color={theme.textSecondary}>Posts</Text>
                            </Box>
                        </Grid>

                        {/* Tabs */}
                        <Tabs.Root mt={6} defaultValue="friends">
                            <Tabs.List>
                                <Tabs.Trigger value="friends">
                                    <BsPeople/> Friends
                                </Tabs.Trigger>
                                <Tabs.Trigger value="posts">
                                    <BsFilePost/> Posts
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="friends">
                                <Box w="100%">
                                    <Heading size="lg" mb={4} color={theme.textPrimary}>
                                        Friends
                                    </Heading>

                                    {selectedUser.friends.length > 0 ? (
                                        <Grid
                                            templateColumns={{
                                                base: "repeat(2, 1fr)",
                                                md: "repeat(3, 1fr)",
                                                lg: "repeat(4, 1fr)",
                                            }}
                                            gap={4}
                                        >
                                            {selectedUser!!.friends.map((f: User) => (
                                                <VStack
                                                    key={f.id}
                                                    bg={theme.cardBg}
                                                    border={`1px solid ${theme.border}`}
                                                    borderRadius="lg"
                                                    p={4}
                                                    gap={3}
                                                    _hover={{shadow: "md", transform: "translateY(-2px)"}}
                                                    transition="all .2s"
                                                    cursor="pointer"
                                                >
                                                    <Avatar.Root size="xl">
                                                        <Avatar.Image src={f.pfp} alt={f.firstName}/>
                                                        <Avatar.Fallback>{f.firstName}</Avatar.Fallback>
                                                    </Avatar.Root>
                                                    <Text fontWeight="600" color={theme.textPrimary}>
                                                        {f.firstName}
                                                    </Text>
                                                    <Text fontSize="sm" color={theme.textSecondary}>
                                                        @{f.handle}
                                                    </Text>
                                                </VStack>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box py={12} textAlign="center" bg={theme.hoverBg} borderRadius="lg">
                                            <Text color={theme.textSecondary}>
                                                {selectedUser.firstName.split(" ")[0]} has no friends yet, and is OH so
                                                lonely 😭.
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            </Tabs.Content>

                            <Tabs.Content value="posts">
                                {(posts.length > 0) ? (
                                    <ScrollArea.Root>
                                        <ScrollArea.Viewport>
                                            <ScrollArea.Content>
                                                <Stack direction={{base: "column", md: "row"}}>
                                                    {
                                                        posts.map((post: Post): ReactElement => (
                                                                <Link href={`/app/feed#${post.id}`} style={{
                                                                    textDecoration: "none"
                                                                }}>
                                                                    <Card.Root bg={theme.cardBg} maxH="lg" minW="sm">
                                                                        <Card.Body gap={2}>
                                                                            <Box
                                                                                justifyContent="start"
                                                                                shadow="xs"
                                                                                p={2}>
                                                                                {renderPostBody(post.body)}
                                                                            </Box>
                                                                        </Card.Body>
                                                                    </Card.Root>
                                                                </Link>
                                                            )
                                                        )
                                                    }
                                                </Stack>
                                            </ScrollArea.Content>
                                        </ScrollArea.Viewport>
                                        <ScrollArea.Scrollbar orientation={scrollBarOrientation}>
                                            <ScrollArea.Thumb/>
                                        </ScrollArea.Scrollbar>
                                        <ScrollArea.Corner/>
                                    </ScrollArea.Root>
                                ) : (
                                    <Text color={theme.textSecondary}>
                                        It's empty in here, maybe wait to cast some light in the darkness.
                                    </Text>
                                )}
                            </Tabs.Content>
                        </Tabs.Root>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default UserProfile;