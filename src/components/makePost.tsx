import {Button, Collapsible, FieldLabel, HStack, VStack,} from "@chakra-ui/react";
import {useState} from "react";
import MDEditor, {commands} from "@uiw/react-md-editor";
import {createPost} from "../backend/api.ts";
import {Field} from "./ui/field.tsx";
import {BiPlus} from "react-icons/bi";

function MakePost() {
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
    };

    return (
        <div>
            <Collapsible.Root open={isOpen}>
                <Collapsible.Trigger
                    onClick={handleToggle}
                    w="xl"
                    p={3}
                >
                    {/*<Button w="100%" variant="outline" onClick={handleToggle}>*/}
                    {/*    */}
                    {/*</Button>*/}
                    <HStack gap={2} w="full" alignItems="center">
                        <BiPlus/> Post
                    </HStack>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <VStack
                        gap={4}
                        align="stretch"
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        mt={4}
                    >
                        <Field>
                            <FieldLabel>Post Content</FieldLabel>
                            <MDEditor
                                value={body}
                                onChange={(value, _) => {
                                    setBody(value!!);
                                }}
                                textareaProps={{placeholder: "Markdown supported"}}
                                commands={[
                                    commands.codeEdit,
                                    commands.codePreview,
                                    commands.bold,
                                    commands.italic,
                                    commands.title,
                                    commands.title1,
                                    commands.title3,
                                    commands.title4,
                                    commands.image,
                                ]}
                            />
                            <MDEditor.Markdown source={body} style={{whiteSpace: "pre-wrap"}}/>
                        </Field>
                        <Button colorScheme="green" onClick={handlePost}>
                            Post
                        </Button>
                        <Button colorScheme="dark" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </VStack>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
}

export default MakePost;
