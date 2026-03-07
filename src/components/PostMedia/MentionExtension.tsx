import Mention from "@tiptap/extension-mention";
import { NodeViewWrapper, ReactNodeViewProps, ReactNodeViewRenderer } from "@tiptap/react";
import { Link } from "@chakra-ui/react";
import { Tag } from "../ui/tag.tsx";

const MentionComponent = (props: ReactNodeViewProps) => {
    const label = props.node.attrs.label ?? props.node.attrs.id;

    return (
        <NodeViewWrapper as="span" className="mention" contentEditable={false}>
            <Link href={`/app/profile/${label}`} style={{ textDecoration: "none" }}>
                <Tag size="lg" colorPalette="blue" mr="1">
                    @{label}
                </Tag>
            </Link>
        </NodeViewWrapper>
    );
};

export const CustomMention = Mention.extend({
    addAttributes() {
        return {
            id: { default: null },
            label: { default: null },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(MentionComponent);
    },

parseHTML() {
        return [
            {
                tag: "span[data-type='mention']",
            },
        ];
    },

    renderHTML({ node }) {
        const label = node.attrs.label ?? node.attrs.id;

        return [
            "span",
            {
                "data-type": "mention",
                "data-id": node.attrs.id,
                "data-label": node.attrs.label,
                "class": "node-mention"
            },
            `@ ${label}`,
        ];
    },
});