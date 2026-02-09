import {ChangeEvent, useState} from "react";
import {Box, Button, Collapsible, Field, FieldLabel, HStack, Input,} from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import {comment} from "../backend/api.ts";
import {BsHandThumbsUp} from "react-icons/bs";
import {BiComment} from "react-icons/bi";

interface Props {
    id: number;
}

function Reply({id}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [body, setBody] = useState("");

    const handleBodyChange = (value?: string | undefined, e?: ChangeEvent<HTMLTextAreaElement>) => {
        setBody(e!!.target.value)
        setBody(value!!);
    }

    const handleToggle = () => setIsOpen(!isOpen);

    const handleCancel = () => {
        setBody("");
        setUsername("");
        setIsOpen(false);
    };

    const handleReply = () => {
        comment(username, body, id);
        setBody("");
        setUsername("");
        setIsOpen(false);
    };

    return (
        <Box>
            <Collapsible.Root open={isOpen}>
                <HStack gap={2}>
                    <Button variant="outline" w="50%">
                        <BsHandThumbsUp/> Like
                    </Button>
                    <Collapsible.Trigger w="50%" p={5} className="border" onClick={handleToggle}>
                        <HStack>
                            <BiComment/>
                            Reply
                        </HStack>
                    </Collapsible.Trigger>

                </HStack>
                <Collapsible.Content>
                    <Box
                        p="4"
                        mt="4"
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="sm"
                        bg="gray.700"
                        maxWidth="100%"  // Ensures the box uses available space within its container
                        overflow="hidden"  // Prevents overflow when the content expands
                    >
                        <Field.Root>
                            <FieldLabel>Testing Username</FieldLabel>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                        </Field.Root>

                        <Field.Root mt={4}>
                            <FieldLabel>Reply Content</FieldLabel>
                            <MDEditor
                                value={body}
                                onChange={handleBodyChange}
                                textareaProps={{placeholder: "Markdown supported"}}
                            />
                            <MDEditor.Markdown
                                source={body}
                                style={{whiteSpace: "pre-wrap"}}
                            />
                        </Field.Root>

                        <Box mt={4} display="flex" justifyContent="flex-end">
                            <Button colorScheme="red" mr={3} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleReply}>
                                Reply
                            </Button>
                        </Box>
                    </Box>
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}

export default Reply;
