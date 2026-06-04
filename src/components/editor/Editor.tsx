import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {Markdown} from "@tiptap/markdown";
import {Control, RichTextEditor, useRichTextEditorContext} from "../ui/rich-text-editor";
import Image from "@tiptap/extension-image";

import {getUsers} from "../../backend/api";
import MentionSuggestion from "./SugestionRenderer";
import {Box, Button, Dialog, FileUpload, Input, Portal, Tabs} from "@chakra-ui/react";
import {Icon} from "lucide-react";
import {LuImage, LuLink, LuUpload} from "react-icons/lu";
import {useState} from "react";
import {CustomMention} from "../PostMedia/MentionExtension.tsx";

interface Props {
    onChange: (content: string) => void;
}

export default function TipTapEditor({onChange}: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            Image,
            Markdown,
            CustomMention.configure({
                suggestion: {
                    items: async ({query}) => {
                        return await getUsers(query); // returns User[]
                    },
                    render: MentionSuggestion(),
                    // @ts-ignore
                    command: ({editor, range, props}: SelectionProps) => {
                        editor
                            .chain()
                            .focus()
                            .insertContentAt(range, [
                                    {
                                        type: "mention", attrs: {id: props.id, label: props.handle},
                                    },
                                    {type: "text", text: " "},
                                ]
                            )
                            .run();
                    },
                },
            })
        ],

        immediatelyRender: false,
        onUpdate: ({editor}) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <RichTextEditor.Root editor={editor} borderWidth="1px" rounded="l2" autoFocus>
            <RichTextEditor.Toolbar>
                <RichTextEditor.ControlGroup>
                    <Control.Bold/>
                </RichTextEditor.ControlGroup>

                <RichTextEditor.ControlGroup>
                    <InsertImageControl/>
                    <Control.Mension/>
                </RichTextEditor.ControlGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content/>
        </RichTextEditor.Root>
    );
}

function InsertImageControl() {
    const {editor} = useRichTextEditorContext()
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    if (!editor) return null

    return (
        <>
            <Control.ButtonControl
                icon={<LuImage/>}
                label="Insert Image"
                onClick={() => setOpen(true)}
                variant="ghost"
            />

            <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Portal>
                    <Dialog.Backdrop/>
                    <Dialog.Positioner>
                        <Dialog.Content maxW="lg">
                            <Dialog.Header>
                                <Dialog.Title>Insert Image</Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <Tabs.Root defaultValue="url">
                                    <Tabs.List>
                                        <Tabs.Trigger value="url">
                                            <LuLink/> Embed URL
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value="upload">
                                            <LuUpload/> Upload File
                                        </Tabs.Trigger>
                                    </Tabs.List>

                                    <Tabs.Content value="url">
                                        <Box display="flex" gap="2" mt="4">
                                            <Input
                                                placeholder="Enter image URL"
                                                id="image-url-input"
                                            />
                                            <Button
                                                onClick={() => {
                                                    const url = (
                                                        document.getElementById(
                                                            "image-url-input",
                                                        ) as HTMLInputElement
                                                    ).value
                                                    if (url)
                                                        editor.chain().focus().setImage({src: url}).run()
                                                    setOpen(false)
                                                }}
                                            >
                                                Insert
                                            </Button>
                                        </Box>
                                    </Tabs.Content>

                                    <Tabs.Content value="upload">
                                        <FileUpload.Root
                                            maxW="xl"
                                            alignItems="stretch"
                                            maxFiles={1}
                                            accept="image/*"
                                            onFileAccept={(accepted) => {
                                                const uploaded = accepted.files ?? []
                                                setFiles(uploaded)

                                                if (uploaded[0]) {
                                                    const url = URL.createObjectURL(uploaded[0])
                                                    editor.chain().focus().setImage({src: url}).run()
                                                    setOpen(false)
                                                }
                                            }}
                                        >
                                            <FileUpload.HiddenInput/>
                                            <FileUpload.Dropzone>
                                                <Icon size="md" color="fg.muted" iconNode={[]}>
                                                    <LuUpload/>
                                                </Icon>
                                                <FileUpload.DropzoneContent>
                                                    <Box>Drag and drop a file here</Box>
                                                    <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                                                </FileUpload.DropzoneContent>
                                            </FileUpload.Dropzone>

                                            <FileUpload.List files={files}/>
                                        </FileUpload.Root>
                                    </Tabs.Content>
                                </Tabs.Root>
                            </Dialog.Body>

                            <Dialog.Footer mt="4">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}