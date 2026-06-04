import {visit} from "unist-util-visit";
import type {Link, Root, Text} from "mdast";

const HANDLE_REGEX = /@([a-zA-Z0-9_]+)/g;

export default function AtHandles() {
    console.log("PLUGIN RUNNING");

    return (tree: Root) => {
        visit(tree, "text", (node: Text, index, parent) => {
            if (!parent || index === undefined) return;

            // skip code blocks & links
            if (
                parent.type === "link"
            ) {
                return;
            }

            const value = node.value;
            let match: RegExpExecArray | null;
            let lastIndex = 0;

            const newNodes: (Text | Link)[] = [];

            while ((match = HANDLE_REGEX.exec(value))) {
                const [fullMatch, handle] = match;

                if (match.index > lastIndex) {
                    newNodes.push({
                        type: "text",
                        value: value.slice(lastIndex, match.index),
                    });
                }

                newNodes.push({
                    type: "link",
                    url: `/app/profile/${handle}`,
                    children: [{type: "text", value: fullMatch}],
                });

                lastIndex = match.index + fullMatch.length;
            }

            if (lastIndex < value.length) {
                newNodes.push({
                    type: "text",
                    value: value.slice(lastIndex),
                });
            }

            if (newNodes.length > 0) {
                parent.children.splice(index, 1, ...newNodes);
            }
        });
    };
}