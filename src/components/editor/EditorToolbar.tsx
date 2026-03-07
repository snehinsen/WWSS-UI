import {Editor} from "@tiptap/react";
import {Box, IconButton, ScrollArea} from "@chakra-ui/react";
import {Heading1Icon} from "lucide-react";
import {FaBold, FaItalic, FaListOl} from "react-icons/fa6";
import {BsQuote} from "react-icons/bs";
import {FaListUl} from "react-icons/fa";
import {FiExternalLink} from "react-icons/fi";

import {useThemeColors} from "../ui/theme";

interface Props {
    editor: Editor;
}

function EditorToolbar({editor}: Props) {
    const c = useThemeColors();

    if (!editor) return null;

    // 🔥 ONE PLACE to define toolbar buttons
    const buttons = [
        {
            label: "Bold",
            icon: FaBold,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive("bold"),
        },
        {
            label: "Italic",
            icon: FaItalic,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive("italic"),
        },
        {
            label: "Heading",
            icon: Heading1Icon,
            action: () =>
                editor.chain().focus().toggleHeading({level: 1}).run(),
            isActive: () => editor.isActive("heading", {level: 1}),
        },
        {
            label: "Numbered List",
            icon: FaListOl,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive("orderedList"),
        },
        {
            label: "Bullet List",
            icon: FaListUl,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive("bulletList"),
        },
        {
            label: "Quote",
            icon: BsQuote,
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive("blockquote"),
        },
        {
            label: "Link",
            icon: FiExternalLink,
            action: () => editor.chain().focus().toggleLink().run(),
            isActive: () => editor.isActive("link"),
        },
    ];

    return (
        <Box
            my={2}
        >
            <ScrollArea.Root width="24rem" size="xs">
                <ScrollArea.Viewport>
                    <ScrollArea.Content py="4">
                        {buttons.map((btn) => {
                            const Icon = btn.icon;
                            const active = btn.isActive();

                            return (
                                <IconButton
                                    key={btn.label}
                                    aria-label={btn.label}
                                    onClick={btn.action}
                                    size="sm"
                                    flex="0 0 auto"
                                    bg={active ? c.buttonPrimary : c.cardBg}
                                    color={active ? "white" : c.textPrimary}
                                    border={`1px solid ${c.border}`}
                                    _hover={{
                                        bg: active ? c.buttonPrimaryHover : c.hoverBg,
                                    }}
                                >
                                    <Icon size={16}/>
                                </IconButton>
                            );
                        })}
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="horizontal"/>
                <ScrollArea.Corner/>
            </ScrollArea.Root>
        </Box>
    );
}

export default EditorToolbar;