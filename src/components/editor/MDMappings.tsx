import {Code, Heading, Link, List, Text,} from "@chakra-ui/react";
import type {Components} from "react-markdown";


const MDMappings: Components = {
    p: ({children}) => (
        <Text mb={2} lineHeight="tall">
            {children}
        </Text>
    ),

    h1: ({children}) => (
        <Heading size="xl" mb={3}>
            {children}
        </Heading>
    ),

    h2: ({children}) => (
        <Heading size="lg" mb={3}>
            {children}
        </Heading>
    ),

    h3: ({children}) => (
        <Heading size="md" mb={2}>
            {children}
        </Heading>
    ),

    a: ({href, children}) => {
        // Detect @mention links from your remark plugin
        if (href!!.startsWith("/app/profile/")) {
            return (
                <Link
                    px={1}
                    py={0.1}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{textDecoration: "none"}}
                    href={href}
                    bg="blue.800"
                    border="1px solid"
                    borderColor="nlue.200"

                >
                    {children}
                </Link>
            );
        }

        return (
            <Link href={href} color="blue.400">
                {children}
            </Link>
        );
    },

    ol: ({children}) => (
        <List.Root mb={2} pl={4} as="ol">
            {children}
        </List.Root>
    ),
    ul: ({children}) => (
        <List.Root mb={2} pl={4} as="ul">
            {children}
        </List.Root>
    ),

    li: ({children}) => <List.Item>{children}</List.Item>,

    code: ({children}) =>
        (
            <Code px={1} py={0.5} borderRadius="sm">
                {children}
            </Code>
        ),
    pre: ({children}) => <>{children}</>,
};

export default MDMappings;