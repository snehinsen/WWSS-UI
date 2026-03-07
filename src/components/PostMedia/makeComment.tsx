import { useState } from "react";
import { Alert, Box, Button, Collapsible, HStack } from "@chakra-ui/react";
import { comment } from "../../backend/api.ts";
import TipTapEditor from "../editor/Editor.tsx";
import { useThemeColors } from "../ui/theme.ts";

interface Props {
    id: number;
    isOpen: boolean;
    onCLoseEvent: () => void;
    onPostEvent: () => void;
}

function MakeComment({ id, isOpen, onCLoseEvent, onPostEvent }: Props) {
    const theme = useThemeColors();
    const [body, setBody] = useState("");
    const [success, setSuccess] = useState<boolean | null>(null);

    const handleBodyChange = (value?: string) => setBody(value || "");

    const handleCancel = () => {
        setBody("");
        onCLoseEvent();
    };

    const handleComment = async () => {
        const state:boolean = await comment(body, id);
        setSuccess(state);
        setBody("");
        if (success) {
            onPostEvent();
            onCLoseEvent();
        }
    };

    return (
        <Box w="100%" minW={0}>
            <Collapsible.Root open={isOpen}>
                <Collapsible.Content>
                    <Box
                        p={{ base: 3, md: 4 }}
                        mt={{ base: 3, md: 4 }}
                        borderWidth="1px"
                        borderRadius={{ base: "0.5rem", md: "0.75rem" }}
                        boxShadow="sm"
                        w="100%"
                        maxW="100%"
                        overflow="hidden"
                        bg={theme.cardBg}
                    >
                        {success === false && (
                            <Alert.Root status="error" mb={4}>
                                <Alert.Content>
                                    <Alert.Indicator />
                                    <Alert.Title>Error making post</Alert.Title>
                                    <Alert.Description>
                                        We couldn't save your comment. Please try again later.
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        <TipTapEditor onChange={handleBodyChange} />

                        <HStack mt={4} justify="flex-end" flexWrap="wrap" gap={2}>
                            <Button colorScheme="red" variant="outline" onClick={handleCancel} flex="1 1 auto">
                                Cancel
                            </Button>
                            <Button colorScheme="blue" onClick={handleComment} flex="1 1 auto">
                                Comment
                            </Button>
                        </HStack>
                    </Box>
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}

export default MakeComment;