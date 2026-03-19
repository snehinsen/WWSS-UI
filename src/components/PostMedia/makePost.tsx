import {
    Box,
    Button,
    Collapsible,
    HStack,
    VStack,
} from "@chakra-ui/react";

import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { createPost } from "../../backend/api";
import TipTapEditor from "../editor/Editor";
import { useThemeColors } from "../ui/theme";

interface Props {
    onPost: () => void;
}

function MakePost({ onPost }: Props) {
    const theme = useThemeColors();
    const [isOpen, setIsOpen] = useState(false);
    const [body, setBody] = useState("");

    const handleToggle = () => setIsOpen(!isOpen);

    const handleCancel = () => {
        setBody("");
        setIsOpen(false);
    };

    const handlePost = () => {
        createPost(body);
        setBody("");
        setIsOpen(false);
        onPost();
    };

    return (
        <Box bg={theme.cardBg} w="100%" borderRadius="xl">
            <Collapsible.Root open={isOpen}>
                <Collapsible.Trigger
                    onClick={handleToggle}
                    w="100%"
                    maxW={{
                        base: "100%",    // mobile fluid
                        sm: "32rem",     // small tablets
                        md: "40rem",     // tablets
                        lg: "45rem",     // laptops
                        xl: "50rem",     // desktops
                    }}
                    p={{ base: 3, md: 4 }}
                    alignItems="center"
                    minW={0}
                >
                    <HStack gap={2}>
                        <BiPlus /> <Box>Post</Box>
                    </HStack>
                </Collapsible.Trigger>

                <Collapsible.Content>
                    <VStack
                        gap={4}
                        align="stretch"
                        p={{ base: 3, md: 4 }}
                        borderWidth="1px"
                        borderRadius={{ base: "0.5rem", md: "0.75rem" }}
                        mt={4}
                        w="100%"
                        minW={0}
                    >
                        <TipTapEditor onChange={setBody} />

                        <HStack gap={2} justify="flex-end">
                            <Button colorScheme="green" onClick={handlePost}>
                                Post
                            </Button>
                            <Button colorScheme="gray" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </HStack>
                    </VStack>
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}

export default MakePost;