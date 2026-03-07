import parse, {DOMNode, domToReact, Element as DomElement, HTMLReactParserOptions,} from "html-react-parser";

import {Link, Text} from "@chakra-ui/react";
import {Tag} from "../ui/tag";

export function renderPostBody(html: string) {
    const options: HTMLReactParserOptions = {
        replace(node: DOMNode | DomElement) {
            // @ts-ignore
            if (!(node instanceof DomElement)) return;

            const {name, attribs, children} = node;

            // Mention
            if (name === "span" && attribs?.["data-type"] === "mention") {
                const label = attribs["data-label"];

                return (
                    <Link href={`/app/profile/${label}`} textDecoration="none">
                        <Tag size="lg" colorPalette="blue" mr="1">
                            @{label}
                        </Tag>
                    </Link>
                );
            }

            // Paragraph
            if (name === "p") {
                return (
                    <Text mb={3} lineHeight="1.6">
                        {domToReact(children as DOMNode[], options)}
                    </Text>
                );
            }
        },
    };

    return parse(html, options);
}