import {useEffect, useState} from "react";
import {Alert, Box, Button, Collapsible, HStack, Spinner} from "@chakra-ui/react";
import {comment} from "../../backend/api.ts";
import TipTapEditor from "../editor/Editor.tsx";
import {useThemeColors} from "../ui/theme.ts";

interface Props {
    id: number;
    isOpen: boolean;
    onCloseEvent: () => void;
    onPostEvent: () => void;
    anchorRect?: {
        left: number;
        top: number;
        width: number;
    };
}

function MakeComment({id, isOpen, onCloseEvent, onPostEvent, anchorRect}: Props) {
    const theme = useThemeColors();
    const [body, setBody] = useState("");
    const [success, setSuccess] = useState<boolean | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);

    const handleBodyChange = (value?: string) => setBody(value || "");

    const handleCancel = () => {
        setBody("");
        onCloseEvent();
    };

    const handleComment = async () => {
        setProcessing(true)
        const state: boolean = await comment(body, id);
        console.log(`State: ${state}`);
        setSuccess(state);
        if (state) {
            setBody("");
            onPostEvent();
            setProcessing(false)
        } else {
            setProcessing(false)
            console.log("Used fail path")
        }
    };

    const renderInner = () => (
        <Box
            p={{base: 3, md: 4}}
            borderWidth="1px"
            borderRadius={{base: "0.5rem", md: "0.75rem"}}
            boxShadow="sm"
            overflow="hidden"
            bg={theme.cardBg}
        >
            {success === false && (
                <Alert.Root status="error" mb={4}>
                    <Alert.Content>
                        <Alert.Indicator/>
                        <Alert.Title>Error making post</Alert.Title>
                        <Alert.Description>
                            We couldn't save your comment. Please try again later.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            )}

            <Box w="100%" minW={0}>
                <TipTapEditor onChange={handleBodyChange}/>

                <HStack mt={4} justify="flex-end" flexWrap="wrap" gap={2}>
                    {/* Prevent buttons from shrinking the editor width in tight layouts */}
                    <Button variant="outline" onClick={handleCancel} flex="0 0 auto">
                        Cancel
                    </Button>
                    <Button
                        colorPalette="green"
                        onClick={handleComment}
                        flex="0 0 auto"
                        disabled={processing}
                    >
                        {processing ? <Spinner/> : "Comment"}
                    </Button>
                </HStack>
            </Box>
        </Box>
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseEvent();
        };
        if (anchorRect) {
            window.addEventListener("keydown", onKey);
        }
        return () => window.removeEventListener("keydown", onKey);
    }, [anchorRect]);

    return (
        <Box w="100%" minW={0} mt={{base: 3, md: 4}}>
            <Collapsible.Root open={isOpen}>
                <Collapsible.Content>
                    {renderInner()}
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}

export default MakeComment;