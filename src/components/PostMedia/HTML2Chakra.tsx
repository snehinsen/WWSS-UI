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
            // Stander link
            if (name === "a" && attribs?.href) {
                return (
                    <Link
                        href={attribs.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="blue.500"
                        _hover={{
                            textDecoration: "none",
                            borderBottom: "3px solid",
                            borderColor: "blue.500",
                        }}
                    >
                        {domToReact(children as DOMNode[], options)}
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