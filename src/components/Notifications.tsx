import {useEffect, useState} from "react";
import {FaBell} from "react-icons/fa6";
import {Badge, Box, Button, Drawer, Heading, IconButton, Portal, Text, VStack} from "@chakra-ui/react";
import {useThemeColors} from "./ui/theme.ts";
import {CgClose} from "react-icons/cg";
import {Notification} from "../backend/types.ts";
import {clearAll, clearNotification, getNotifications} from "../backend/api.ts";


export default function Notifications() {

    const [notificationList, setNotificationList] = useState<Notification[]>([]);

    const loadNotifications = async () => {
        const list: Notification[] = await getNotifications();
        setNotificationList(list)
    }

    const onClear = async (id: number) => {
        console.log(`Clearing notification with ID: ${id}`)
        const item = notificationList
            .find(item => item.id === id)!!
        await clearNotification(id)
        await loadNotifications()
        console.log(`Notification cleared: ${item.tittle}`)
        if (item.tittle.includes("wants to be friends with you")) {
            window.location.href = "/app/friends";
        }
        if (item.tittle.includes("mentioned you")) {
            window.location.href = "/app/feed";
        }
    }

    const onClearAll = async () => {
        await clearAll()
    }

    useEffect(() => {
        loadNotifications()
        const interval: number = setInterval(() => {
            loadNotifications().then()
        }, 2000)

        return () => {
            clearInterval(interval)
        };
    }, []);

    return (
        <Drawer.Root size="xs">
            <Drawer.Trigger asChild>
                <IconButton variant="ghost" position="relative">
                    <FaBell/>
                    {notificationList.length > 0 && (
                        <Badge
                            variant="solid"
                            px={1.5}
                            py={0}
                            borderRadius="full"
                            colorPalette="red"
                            position="absolute"
                            top={-1}
                            right={0}
                        >
                            {notificationList.length}
                        </Badge>
                    )}
                </IconButton>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Positioner>
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Header>
                                <VStack>
                                    <Heading size="lg">
                                        Notifications
                                    </Heading>
                                    <Drawer.CloseTrigger>
                                        <CgClose size={20}/>
                                    </Drawer.CloseTrigger>
                                </VStack>
                            </Drawer.Header>
                            <Drawer.Body>
                                {notificationList.length > 0 ? (
                                    <VStack gap={1}>
                                        {
                                            notificationList.map((item: Notification) => (
                                                <NotificationItem
                                                    notification={item}
                                                    key={item.id}
                                                    onClear={onClear}
                                                />
                                            ))
                                        }
                                    </VStack>
                                ) : (<>
                                    <Text>
                                        No Notifications
                                    </Text>
                                </>)}
                            </Drawer.Body>
                            <Drawer.Footer>
                                <Button
                                    w="full"
                                    variant="surface"
                                    disabled={notificationList.length === 0}
                                    onClick={onClearAll}
                                >
                                    Clear all
                                </Button>
                            </Drawer.Footer>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

interface NotificationProps {
    notification: Notification;
    onClear: (id: number) => void;
}

function NotificationItem({notification, onClear}: NotificationProps) {
    const theme = useThemeColors();

    console.log(`Notifications: ${notification}`);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', // full year, e.g., 2026
        month: 'long',   // full month name, e.g., March
        day: 'numeric'   // day of the month, e.g., 10
    };

    const date = new Date(notification.timeSent)
    const format: string = date.toLocaleString("en-US", options)

    return (
        <Box
            _hover={{textDecoration: "none"}}
            onClick={() => {
                onClear(notification.id)
            }}
        >
            <VStack
                gap={2}
                p={2}
                borderRadius="xl"
                align="start"
                minW="2xs"
                borderWidth="2px"
                borderColor={theme.border}
            >
                <Heading size="2xl">{notification.tittle}</Heading>
                <Text color={theme.mutedText}>{format}</Text>
                <Text>{notification.body}</Text>
            </VStack>
        </Box>
    )

}