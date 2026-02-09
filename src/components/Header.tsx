import {useState} from "react";
import {Box, Drawer, Flex, Heading, IconButton, Link, Text, VStack,} from "@chakra-ui/react";
import {FaBurger} from "react-icons/fa6";

interface Props {
    headerType: string;
}

function Header({headerType}: Props) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    if (headerType === "landing") {
        return (
            <Box as="header" className="header">
                <Flex align="center" justify="space-between">
                    <Link href="/app">
                        <Heading size="3xl" className="title">
                            WWSS
                        </Heading>
                    </Link>

                    <Flex as="nav" gap={4}>
                        <Link href="/app/product">Product</Link>
                        <Link href="/app/about">About Us</Link>
                    </Flex>
                </Flex>
            </Box>
        );
    }

    if (headerType === "logged-in") {
        // @ts-ignore
        return (
            <>
                <Box as="header" className="header logged-in" id="header">
                    <Flex align="center" gap={3}>
                        <IconButton
                            aria-label="Open menu"
                            onClick={toggleSidebar}
                            variant="ghost"
                        >
                            <FaBurger/>
                        </IconButton>

                        <Heading size="lg" className="title">
                            <Link href="/feed">
                                WWSS
                            </Link>
                        </Heading>
                    </Flex>
                </Box>

                <Drawer.Root
                    open={isSidebarVisible}
                    placement="start"
                    onOpenChange={({open}) => setIsSidebarVisible(open)}
                    size="sm"
                >
                    <Drawer.Backdrop/>
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.CloseTrigger/>

                            <Drawer.Body>
                                <VStack align="start" gap={4} mt={8}>
                                    <Link href="/app//feed" onClick={toggleSidebar}>
                                        <Heading size="md" className="title">
                                            WWSS
                                        </Heading>
                                    </Link>

                                    <Text fontWeight="bold">Menu</Text>

                                    <VStack align="start" gap={2}>
                                        <Link href="/app/feed" onClick={toggleSidebar}>
                                            Feed
                                        </Link>
                                        <Link href="/dms" onClick={toggleSidebar}>
                                            Your DMs
                                        </Link>
                                        <Link
                                            href="/profile/harrypotter"
                                            onClick={toggleSidebar}
                                        >
                                            Your Profile
                                        </Link>
                                    </VStack>
                                </VStack>
                            </Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Drawer.Root>
            </>
        );
    }

    return null;
}

export default Header;
