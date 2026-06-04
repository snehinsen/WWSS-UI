import {useEffect, useState} from "react";
import {Box, Heading, Spinner, Text, useBreakpointValue, VStack} from "@chakra-ui/react";
import "../../syles/feed.css";
import {FriendRequest, User} from "../../backend/types.ts";
import {acceptFriendRequests, declineFriendRequests, getFriendRequests, getUser} from "../../backend/api.ts";
import FriendCard from "./FriendCard.tsx";
import {useUserContext} from "../../context/userContext.tsx";

function Friends() {

    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    const {user, loading} = useUserContext()

    const positionBreakpoint = useBreakpointValue(
        {
            base: "center",
            md: "start"
        }
    );

    const fetchRequests = async () => {
        console.log("User: " + user);
        console.log("Friends: " + user?.friends!!);

        try {
            const requests: FriendRequest[] = await getFriendRequests();
            const currentUser = await getUser();
            
            setFriendRequests(requests || []);
            setFriends(currentUser?.friends || []);

            console.log(`Friend requests: ${requests}`);
        } catch (error) {
            console.error(error);
            setFriendRequests([]);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        if (pageLoading || !user || loading) return;

        fetchRequests().then(() => {
            console.log("Requests: " + friendRequests.toString())
        });
        const timer = setInterval(fetchRequests, 2000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchRequests();

    }, [loading, user, pageLoading]);

    return (
        <VStack
            gap={{base: 3, sm: 4, md: 5, lg: 6}}
            py={{base: 3, sm: 4, md: 6}}

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
            {(pageLoading && loading) ? (
                <Spinner justifySelf="center" alignSelf="center"/>
            ) : (
                <>
                    <Box
                        justifyContent={positionBreakpoint}
                        px={4}
                    >
                        <Heading
                            size="3xl"
                            mb={4}
                        >
                            Friend Requests ({friendRequests.length})
                        </Heading>

                        {friendRequests.length > 0 ? (
                            <VStack gap={3} align="stretch">
                                {friendRequests.map((request: FriendRequest) => (
                                    <FriendCard
                                        friend={request.sender}
                                        isRequest
                                        key={request.id}
                                        onAccept={() => {
                                            acceptFriendRequests(request.id).then(fetchRequests)
                                        }}
                                        onDecline={() => {
                                            declineFriendRequests(request.id).then(fetchRequests)
                                        }}
                                    />
                                ))}
                            </VStack>
                        ) : (
                            <Text>No requests</Text>
                        )}

                    </Box>

                    <Box
                        px={4}
                    >
                        <Heading
                            size="3xl"
                            mb={4}
                            justifySelf={positionBreakpoint}
                        >
                            Your Friends
                        </Heading>
                        {friends?.length!! > 0 ? (
                            <VStack gap={3} align="stretch">
                                {friends?.map((friend: User) => (
                                    <FriendCard
                                        friend={friend}
                                        key={friend.id}
                                    />
                                ))}
                            </VStack>
                        ) : (
                            <Text>
                                You're lonely :(. Go make some friends so you're not lonely anymore.
                            </Text>
                        )}
                    </Box>
                </>
            )}

        </VStack>
    );
}

export default Friends;