import {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    ClientOnly,
    Drawer,
    Flex,
    Heading,
    HStack,
    IconButton,
    Link,
    Menu,
    Portal,
    Skeleton,
    Spinner,
    Text,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
import {FaHamburger} from "react-icons/fa";
import {useThemeColors} from "./ui/theme.ts";
import {LuMoon, LuSun} from "react-icons/lu";
import {useColorMode} from "./ui/color-mode.tsx";
import {useUserContext} from "../context/userContext";
import {MoreHorizontal} from "lucide-react";
import {FiSettings} from "react-icons/fi";
import Notifications from "./Notifications.tsx";
import {BsPerson} from "react-icons/bs";
import {BiHome} from "react-icons/bi";
import {IconType} from "react-icons";
import {FaMessage} from "react-icons/fa6";

interface Props {
    headerType: string;
}

interface NavItem {
    name: string;
    path: string;
    icon: IconType;
}

function Header({headerType}: Props) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const colors = useThemeColors();
    const {user, loading} = useUserContext();
    const {toggleColorMode, colorMode} = useColorMode();
    const pages: NavItem[] = [
        {
            name: "Home",
            path: "/app/feed",
            icon: BiHome
        },
        {
            name: "Friends",
            path: "/app/friends",
            icon: BsPerson
        },
        {
            name: "Your DMs",
            path: "/app/dms",
            icon: FaMessage
        }
    ]

    const isDesktop = useBreakpointValue({base: false, lg: true});

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    // Auto-close drawer if resizing to desktop
    useEffect(() => {
        if (isDesktop && isSidebarVisible) {
            setIsSidebarVisible(false);
        }
    }, [isDesktop, isSidebarVisible]);

    return (
        <Box
            as="header"
            className={`header ${headerType === "logged-in" ? "logged-in" : ""}`}
            position="sticky"
            top={0}
            left={0}
            bg={colors.cardBg}
            w="100%"
            zIndex={10}
            px={4}
            py={2}
        >
            {headerType === "landing" ? (
                <Flex align="center" justify="space-between">
                    <Link href="/">
                        <Heading size="5xl" className="title">
                            WWSS
                        </Heading>
                    </Link>
                    <Flex as="nav" gap={4}>
                        <Link href="/app/product"><Text textStyle="5xl">Product</Text></Link>
                        <Link href="/app/about"><Text textStyle="5xl">About Us</Text></Link>
                    </Flex>
                </Flex>
            ) : headerType === "logged-in" ? (
                <>
                    <Flex align="center" justify="space-between" w="100%">
                        {/* LEFT SIDE */}
                        <Flex align="center" gap={3}>
                            <IconButton
                                aria-label="Open menu"
                                onClick={toggleSidebar}
                                variant="ghost"
                                display={{base: "flex", lg: "none"}}
                            >
                                <FaHamburger/>
                            </IconButton>

                            <Link href="/app/feed">
                                <Heading size="5xl" className="title">
                                    WWSS
                                </Heading>
                            </Link>
                        </Flex>

                        {/* CENTER */}

                        <HStack display={{base: "none", lg: "flex"}} gap={6}>
                            {
                                pages.map((page) => (
                                        <Link
                                            key={page.name}
                                            href={page.path}
                                            display="flex">
                                            <page.icon size={31}/>
                                            <Text fontSize="2xl">{page.name}</Text>

                                        </Link>
                                    )
                                )

                            }


                        </HStack>

                        {/* RIGHT SIDE */}
                        <HStack gap={3}>
                            <ClientOnly fallback={<Skeleton boxSize="8"/>}>
                                <IconButton
                                    onClick={toggleColorMode}
                                    variant="outline"
                                    size="sm"
                                >
                                    {colorMode === "light" ? <LuSun/> : <LuMoon/>}
                                </IconButton>
                            </ClientOnly>
                            <Notifications/>
                            <Box>
                                {!loading ? (
                                    <>
                                        {/* DESKTOP AVATAR MENU */}
                                        <Menu.Root>
                                            <Menu.Trigger asChild>
                                                <Box
                                                    cursor="pointer"
                                                    display={{base: "none", lg: "block"}}
                                                >
                                                    <Avatar.Root size="sm">
                                                        <Avatar.Image src={user?.pfp}/>
                                                        <Avatar.Fallback>
                                                            {`${user!!.firstName.charAt(0) + user!!.lastName.charAt(0)}`}
                                                        </Avatar.Fallback>
                                                    </Avatar.Root>
                                                </Box>
                                            </Menu.Trigger>
                                            <Portal>
                                                <Menu.Positioner>
                                                    <Menu.Content p={4} minW="xs">
                                                        <VStack align="start" gap={1}>
                                                            <Link
                                                                href={`/app/profile/${user?.handle}`}
                                                                w="100%"
                                                                textDecoration="none"
                                                                outline="none"
                                                                _hover={{textDecoration: "none"}}
                                                                _focus={{boxShadow: "none"}}
                                                                _focusVisible={{boxShadow: "none"}}
                                                            >
                                                                <HStack>
                                                                    <Avatar.Root size="xl">
                                                                        <Avatar.Image src={user?.pfp}/>
                                                                        <Avatar.Fallback>
                                                                            {`${user!!.firstName.charAt(0) + user!!.lastName.charAt(0)}`}
                                                                        </Avatar.Fallback>
                                                                    </Avatar.Root>

                                                                    <VStack align="start" gap={0}>
                                                                        <Text fontWeight="bold">
                                                                            {user?.firstName} {user?.lastName}
                                                                        </Text>
                                                                        <Text color={colors.mutedText}>
                                                                            @{user?.handle}
                                                                        </Text>
                                                                    </VStack>
                                                                </HStack>
                                                            </Link>

                                                            <Menu.Item value="settings" asChild>
                                                                <Link
                                                                    href="/app/settings"
                                                                    _hover={{
                                                                        textDecoration: "none"
                                                                    }}
                                                                >
                                                                    <FiSettings/> Settings
                                                                </Link>
                                                            </Menu.Item>
                                                            <Menu.Item value="logout" asChild color="red">
                                                                <Link
                                                                    href="/logout"
                                                                    _hover={{
                                                                        textDecoration: "none"
                                                                    }}
                                                                >
                                                                    Logout
                                                                </Link>
                                                            </Menu.Item>
                                                        </VStack>
                                                    </Menu.Content>
                                                </Menu.Positioner>
                                            </Portal>
                                        </Menu.Root>
                                    </>
                                ) : (
                                    <Spinner size="sm"/>
                                )}
                            </Box>
                        </HStack>
                    </Flex>

                    {/* MOBILE / TABLET DRAWER */}
                    <Drawer.Root
                        open={isSidebarVisible}
                        placement="start"
                        onOpenChange={({open}) => setIsSidebarVisible(open)}
                    >
                        <Drawer.Backdrop/>
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.CloseTrigger/>
                                <Drawer.Body
                                    maxW="max-content"
                                    pr={0}
                                >
                                    <VStack align="flex-start" mt={8} gap={6}>
                                        <Link href="/app/feed" onClick={toggleSidebar}>
                                            <Heading size="5xl" className="title">
                                                WWSS
                                            </Heading>
                                        </Link>

                                        <Text fontWeight="bold">Menu</Text>

                                        <VStack align="start" gap={3}>


                                            {pages.map((page) => (
                                                <Link href={page.path} onClick={toggleSidebar}>
                                                    <page.icon size={20}/>
                                                    <Text fontSize="xl">
                                                        {page.name}
                                                    </Text>
                                                </Link>
                                            ))}

                                            <HStack align="center" gap={3}>
                                                <Link href={`/app/profile/${user?.handle}`} onClick={toggleSidebar}>
                                                    <Avatar.Root>
                                                        <Avatar.Image src={user?.pfp}/>
                                                        <Avatar.Fallback>
                                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                                        </Avatar.Fallback>
                                                    </Avatar.Root>

                                                    <VStack align="start" gap={0}>
                                                        <Text fontWeight="bold">
                                                            {user?.firstName} {user?.lastName}
                                                        </Text>
                                                        <Text color={colors.mutedText}>
                                                            @{user?.handle}
                                                        </Text>
                                                    </VStack>
                                                </Link>

                                                <Menu.Root>
                                                    <Menu.Trigger>
                                                        <IconButton variant="ghost">
                                                            <MoreHorizontal/>
                                                        </IconButton>
                                                    </Menu.Trigger>

                                                    <Portal>
                                                        <Menu.Positioner>
                                                            <Menu.Content>
                                                                <Menu.Item value="settings" asChild>
                                                                    <Link
                                                                        href="/app/settings"
                                                                        _hover={{
                                                                            textDecoration: "none"
                                                                        }}
                                                                    >
                                                                        <FiSettings/> Settings
                                                                    </Link>
                                                                </Menu.Item>
                                                                <Menu.Item value="logout" color="red">
                                                                    Logout
                                                                </Menu.Item>
                                                            </Menu.Content>
                                                        </Menu.Positioner>
                                                    </Portal>
                                                </Menu.Root>
                                            </HStack>
                                        </VStack>
                                    </VStack>
                                </Drawer.Body>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Drawer.Root>
                </>
            ) : (
                <Flex align="center" justify="space-between">
                    <Link href="/app/feed">
                        <Heading size="5xl" className="title">
                            WWSS
                        </Heading>
                    </Link>
                </Flex>
            )}
        </Box>
    );
}

export default Header;