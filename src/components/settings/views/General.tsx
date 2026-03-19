import {Avatar, Box, Field, Heading, IconButton, Input, Spinner, Text, VStack} from "@chakra-ui/react";
import {useThemeColors} from "../../ui/theme.ts";
import {useUserContext} from "../../../context/userContext.tsx";
import {BiUpload} from "react-icons/bi";

function General() {

    const theme = useThemeColors();

    const {user, loading} = useUserContext();


    return (
        <VStack
            bg={theme.cardBg}
            h="full"
            gap={2}
            py={3}
            borderRadius="md"
        >
            <Heading>
                Overview
            </Heading>

            {!loading ? (
                <>
                    <Box position="relative">
                        <Avatar.Root size="2xl">
                            <Avatar.Image src={user?.pfp}/>
                            <Avatar.Fallback>{`${user?.firstName.charAt(0).toUpperCase()} ${user?.lastName.charAt(0).toUpperCase()}`}</Avatar.Fallback>
                        </Avatar.Root>
                        <IconButton
                            variant="surface"
                            position="absolute"
                            bottom="-4.5"
                            right="-2" size="xs">
                            <BiUpload />
                        </IconButton>
                    </Box>

                    <Heading className="title" size="5xl">{user?.firstName}</Heading>
                    <Text color={theme.mutedText}>@{user?.handle}</Text>
                    <Box w="full" px={5}>
                        <Heading>Change My Profile</Heading>
                        <form>
                            <Field.Root orientation="horizontal">
                                <Field.Label>Handle</Field.Label>
                                <Input placeholder="Your new handle" value={user?.handle}/>
                            </Field.Root>
                        </form>
                    </Box>
                </>
            ) : (
                <Spinner/>
            )}

        </VStack>
    )
}

export default General;