import {useEffect, useState} from "react";
import {Avatar, Box, Heading, Text, VStack} from "@chakra-ui/react";
import {getProfile, getProfileById} from "../backend/api.ts";
import {useColorMode} from "./ui/color-mode.tsx";
import {User} from "../backend/types.ts";

interface Props {
    name: string;
}

function UserProfile({name}: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [friends, setFriends] = useState<User[]>([]);
    // @ts-ignore
    const {theme} = useColorMode();

    useEffect(() => {
        if (!name) {
            console.error("name undefined");
            return;
        }
        const fetchProfile = async () => {
            setUser(await getProfile(name));
        };
        fetchProfile();

        const fetchFriends = async () => {
            const friendsList: User[] = await Promise.all(
                user?.friends?.map(friend =>
                    getProfileById(friend)
                ) ?? []
            );

            setFriends(friendsList);
        };


        fetchFriends()

    }, [name]);

    if (!user) return <Text color={theme == "light" ? "black" : "white"}>This profile doesn't appear to exist
        :(</Text>;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="60vh"
            p={6}
        >
            <VStack
                gap={6}
                p={6}
                bg={theme == "light" ? "white" : "gray.900"}
                borderRadius="lg"
                shadow="lg"
                maxWidth="600px"
                align="stretch"
            >
                <Box display="flex" alignItems="center" gap={6}>
                    <Avatar.Root size="2xl">
                        <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                        <Avatar.Image src={user.pfp}/>
                    </Avatar.Root>
                    <Box>
                        <Heading className="title">{user.name}</Heading>
                        <Text color={theme == "light" ? "black" : "white"} fontSize="md">{user.bio}</Text>
                    </Box>
                </Box>

                {/* Friends Section */}
                <Box width="full">
                    <Heading size="xl">Friends</Heading>
                    {user.friends.length > 0 ? (
                        <VStack gap={4} align="start">
                            {friends.map((friend: User, index) => (
                                <Box key={index} display="flex" alignItems="center" gap={4}>
                                    <Avatar.Root size="md">
                                        <Avatar.Image src={friend.pfp}/>
                                        <Avatar.Fallback>{friend.name}</Avatar.Fallback>
                                    </Avatar.Root>
                                    <Text color={theme == "light" ? "black" : "white"}
                                          fontSize="sm">{friend.name}</Text>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Text color={theme == "light" ? "black" : "white"}
                              fontSize="sm">{user.name.split(" ")[0]} is lonely :(</Text>
                    )}
                </Box>
            </VStack>
        </Box>
    );
}

export default UserProfile;
