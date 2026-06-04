import {Avatar, Box, Heading, HStack, IconButton, Link, Spacer, Text, VStack} from "@chakra-ui/react";
import "../../syles/feed.css";
import {User} from "../../backend/types.ts";
import {useThemeColors} from "../ui/theme.ts";
import {Check} from "lucide-react";
import UserProfileBadge from "../ui/UserProfileBadge.tsx";
import {CgClose} from "react-icons/cg";
import {useEffect} from "react";

interface Props {
    isRequest?: boolean;
    friend: User;
    onAccept?: () => void;
    onDecline?: () => void;
}

function FriendCard({friend, isRequest = false, onDecline, onAccept}: Props) {
    const theme = useThemeColors();

    useEffect(() => {
        console.log(`Rendering FriendCard for ${friend}`);
    }, []);

    return (
        <Box
            bg={theme.cardBg}
            w="100%"
            minW={0}
            p={{base: 3, md: 4}}
            borderRadius={{base: "0.5rem", md: "0.75rem"}}
            boxShadow={isRequest ? `inset 3px 0 0 0 ${theme.border}` : undefined}
            data-root-post={isRequest ? undefined : "true"}
        >
            <HStack
                gap={{base: 2, md: 3}}
                align="start"
                w="100%">
                <Avatar.Root size={isRequest ? "md" : "2xl"} alignSelf="start">
                    <Avatar.Image src={friend.pfp} alt={`${friend.firstName}'s avatar`}/>
                    <Avatar.Fallback>{`${friend?.firstName.charAt(0) ?? null + friend!!.lastName.charAt(0)}`}</Avatar.Fallback>
                </Avatar.Root>

                <VStack
                    align="start"
                    flex="1"
                    w="100%"
                    gap={0}
                    minW={0}
                >
                    <HStack>
                        <Link
                            href={`/app/profile/${friend.handle}`}
                        >
                            <Heading
                                size={{base: "4xl", md: "3xl"}}
                                className="title"
                                py={0}
                            >
                                {`${friend?.firstName} ${friend?.lastName}` || "Loading..."}
                            </Heading>
                        </Link>
                        <UserProfileBadge isBot={friend.isBot}/>
                    </HStack>
                    <Text
                        color={theme.mutedText}
                        fontSize={{base: "sm", md: "md"}}
                    >
                        @{friend.handle || "Loading handle..."}
                    </Text>
                </VStack>
                <Spacer w="full"/>
                {isRequest && (
                    <>
                        <IconButton
                            variant="subtle"
                            onClick={() => {
                                onAccept!!()
                            }}
                        >
                            <Check/>
                        </IconButton>
                        <IconButton
                            variant="subtle"
                            onClick={() => {
                                onDecline!!()
                            }}>
                            <CgClose/>
                        </IconButton>
                    </>
                )}
            </HStack>


        </Box>
    );
}

export default FriendCard;