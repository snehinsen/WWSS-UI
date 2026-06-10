import {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    IconButton,
    Menu,
    Portal,
    Spinner,
    Text,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
import {
    acceptFriendRequests,
    declineFriendRequests,
    getFriendRequest,
    getProfile,
    removeFriend,
    sendFriendRequests,
} from "../../backend/api.ts";

import {BsPerson} from "react-icons/bs";

import {FaCheck, FaEdit} from "react-icons/fa";
import {CiSettings} from "react-icons/ci";
import {IoPersonRemoveOutline} from "react-icons/io5";
import {FiMoreVertical} from "react-icons/fi";
import {FriendRequest, User} from "../../backend/types.ts";
import {useUserContext} from "../../context/userContext.tsx";
import {useThemeColors} from "../ui/theme.ts";
import {FaX} from "react-icons/fa6";

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

    const [friendRequestState, setFriendRequestState] =
        useState<FriendRequest | null>(null);

    const requestFriend = () => {
        if (!selectedUser) return;

        console.log("Requesting");

        sendFriendRequests(selectedUser.handle).then(() => {
            getFriendRequest(selectedUser.handle).then((state) => {
                console.log("Loading friend request state");
                console.log(state);
                console.log(typeof state)
                setFriendRequestState(state);
            });
        });
    };

    const loadFriendRequestState = async () => {
        try {
            const state = await getFriendRequest(name);
            console.log("Loading friend request state");
            console.log(state);
            console.log(typeof state)
            setFriendRequestState(state);
        } catch (err) {
            console.error(err);
            setFriendRequestState(null);
        }
    };

    useBreakpointValue<"horizontal" | "vertical" | undefined>({
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

            } catch (err) {
                console.error(err);
                setSelectedUser(null);
            } finally {
                setLoading(false);
            }
        };
        console.log(selectedUser?.friends!!)
        fetchProfile();
        loadFriendRequestState()
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
                                <Avatar.Root size="2xl">
                                    <Avatar.Image src={selectedUser.pfp} alt={selectedUser.firstName}/>
                                    <Avatar.Fallback>{selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}</Avatar.Fallback>
                                </Avatar.Root>
                                <VStack align="start" gap={1}>
                                    <Heading className="title"
                                             size="4xl">{selectedUser.firstName} {selectedUser.lastName}</Heading>
                                    <Text color={theme.textSecondary}>@{selectedUser.handle}</Text>
                                    <Text color={theme.textPrimary}>{selectedUser.bio ?? "No bio set"}</Text>
                                </VStack>
                            </HStack>

                            {!isMe ? (
                                isFriend ? (
                                    <Button
                                        colorPalette="red"
                                        onClick={() => {
                                            removeFriend(selectedUser.handle);
                                        }}
                                    >
                                        <IoPersonRemoveOutline/>
                                        Remove Friend
                                    </Button>
                                ) : friendRequestState ? (
                                    friendRequestState.sender?.handle ===
                                    user.handle ? (
                                        <Button
                                            colorPalette="red"
                                            onClick={() => {
                                                // cancel request
                                            }}
                                        >
                                            Cancel Friend Request
                                        </Button>
                                    ) : friendRequestState.receiver?.handle ===
                                    user.handle ? (
                                        <HStack>
                                            <IconButton
                                                colorPalette="blue"
                                                onClick={() => {
                                                    acceptFriendRequests(friendRequestState!!.id)
                                                }}
                                            >
                                                <FaCheck/>
                                            </IconButton>

                                            <IconButton
                                                colorPalette="red"
                                                onClick={() => {
                                                    declineFriendRequests(friendRequestState!!.id)
                                                }}
                                            >
                                                <FaX/>
                                            </IconButton>
                                        </HStack>
                                    ) : (
                                        <Button
                                            colorPalette="blue"
                                            onClick={requestFriend}
                                        >
                                            <BsPerson/>
                                            Send Friend Request
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        colorPalette="blue"
                                        onClick={requestFriend}
                                    >
                                        <BsPerson/>
                                        Send Friend Request
                                    </Button>
                                )
                            ) : (
                                <Button
                                    variant="ghost"
                                    color={theme.textPrimary}
                                    _hover={{bg: theme.hoverBg}}
                                >
                                    <Menu.Root>
                                        <Menu.Trigger asChild>
                                            <IconButton
                                                bg="transparent"
                                                color={theme.textPrimary}
                                            >
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
                                                    <Menu.Item
                                                        value="Edit"
                                                        _hover={{
                                                            bg: theme.hoverBg,
                                                        }}
                                                    >
                                                        <FaEdit/>
                                                        Edit Profile
                                                    </Menu.Item>

                                                    <Menu.Item
                                                        value="settings"
                                                        _hover={{
                                                            bg: theme.hoverBg,
                                                        }}
                                                    >
                                                        <CiSettings/>
                                                        Settings
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
                        </Grid>

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
                                    {selectedUser.friends?.map((f: User) => {
                                        return (
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
                                                onClick={() => (window.location.href = `/app/profile/${f.handle}`)}
                                            >
                                                <Avatar.Root size="xl">
                                                    <Avatar.Image src={f.pfp} alt={f.firstName}/>
                                                    <Avatar.Fallback>
                                                        {(f.firstName?.charAt(0) ?? "") + (f.lastName?.charAt(0) ?? "")}
                                                    </Avatar.Fallback>
                                                </Avatar.Root>

                                                <Text fontWeight="600" color={theme.textPrimary}>
                                                    {f.firstName} {f.lastName}
                                                </Text>

                                                <Text fontSize="sm" color={theme.textSecondary}>
                                                    @{f.handle}
                                                </Text>
                                            </VStack>
                                        );
                                    })}
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

                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default UserProfile;