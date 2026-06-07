import {
    Box,
    Field,
    Heading,
    Input,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";
import {useThemeColors} from "../../ui/theme.ts";
import {useUserContext} from "../../../context/userContext.tsx";
import ProfilePictureUploader from "../../PFPUploader.tsx";

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
                    <ProfilePictureUploader
                        image={user?.pfp}
                        fallback={
                            `${user?.firstName?.charAt(0).toUpperCase() ?? ""} ${user?.lastName?.charAt(0).toUpperCase() ?? ""}`
                        }
                    />

                    <Heading className="title" size="5xl">
                        {user?.firstName} {user?.lastName}
                    </Heading>

                    <Text color={theme.mutedText}>
                        @{user?.handle}
                    </Text>

                    <Box w="full" px={5}>
                        <Heading>
                            Change My Profile
                        </Heading>

                        <form>
                            <Field.Root orientation="horizontal">
                                <Field.Label>
                                    Handle
                                </Field.Label>

                                <Input
                                    placeholder="Your new handle"
                                    value={user?.handle ?? ""}
                                />
                            </Field.Root>
                        </form>
                    </Box>
                </>
            ) : (
                <Spinner/>
            )}
        </VStack>
    );
}

export default General;