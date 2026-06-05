import {useEffect, useMemo, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    CloseButton,
    createListCollection,
    Dialog,
    Field,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Menu,
    Portal,
    Select,
    Spinner,
    Tag,
    Text,
    Textarea,
    useBreakpointValue,
    VStack,
    Wrap,
} from "@chakra-ui/react";

import "../../syles/feed.css";

import {Thread, ThreadType, User, WebSocketMessageResponse,} from "../../backend/types.ts";

import {
    addMembers,
    connectToChat,
    createThread,
    deleteThread,
    disconnectFromChat,
    getLiveThreadContent,
    leaveThread,
    listThreads,
    onMessage,
    removeMember,
    sendMessage,
} from "../../backend/api.ts";

import {useUserContext} from "../../context/userContext.tsx";

import {BiChevronRight, BiGroup, BiPlus, BiSend, BiUserPlus, BiX,} from "react-icons/bi";

import {useThemeColors} from "../ui/theme.ts";
import {MoreVertical} from "lucide-react";

const smooth = "cubic-bezier(0.22, 1, 0.36, 1)";

function DMs() {

    const [threads, setThreads] = useState<Thread[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    const {user, loading} = useUserContext();

    const [friendsAdded, setFriendsAdded] = useState<string[]>([]);
    const [chatName, setChatName] = useState<string>("");

    const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false);
    const [isCreationProcessing, setIsCreationProcessing] = useState(false);

    const [selectedChat, setSelectedChat] = useState<number>(0);
    const [messageInput, setMessageInput] = useState("");

    const [messages, setMessages] = useState<WebSocketMessageResponse[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [selectedMembersToAdd, setSelectedMembersToAdd] = useState<string[]>([]);

    const isMobile = useBreakpointValue({base: true, sm: true, md: true, lg: false, xl: false});

    const friends = user?.friends ?? [];
    const theme = useThemeColors();

    const selectedThread = useMemo(() => {
        return threads.find(t => t.id === selectedChat);
    }, [threads, selectedChat]);

    const chatHeading = useMemo(() => {

        if (!selectedThread) return "Messages";

        if (
            selectedThread.threadType === ThreadType.DM &&
            selectedThread.otherMembers?.length
        ) {
            const m = selectedThread.otherMembers[0];
            return `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim();
        }

        return selectedThread.title || "Group Chat";

    }, [selectedThread]);

    const friendsCollection = createListCollection({
        items: friends.map((f: User) => ({
            label: `${f.firstName ?? ""} ${f.lastName ?? ""}`.trim(),
            value: f.handle,
        })),
        itemToString: i => i.label,
        itemToValue: i => i.value,
    });

    const selectedFriends = useMemo(() => {
        return friends.filter(f => friendsAdded.includes(f.handle));
    }, [friends, friendsAdded]);

    const fetchThreads = async () => {

        try {

            const res = await listThreads();
            setThreads(res);

        } catch (e) {
            console.error(e);
        }
    };

    const resetCreateState = () => {
        setChatName("");
        setFriendsAdded([]);
        setIsCreationProcessing(false);
    };

    const createChat = async () => {

        try {

            setIsCreationProcessing(true);

            console.log("Creating chat...");
            console.log(friendsAdded)

            // Store current thread IDs to identify the new one
            const previousThreadIds = new Set(threads.map(t => t.id));

            const success = await createThread({
                tittle: chatName,
                handles: friendsAdded,
            });

            // Only proceed if creation was successful
            if (!success) {
                setIsCreationProcessing(false);
                return;
            }

            console.log("Created chat...");
            await fetchThreads();

            // Find and auto-select the newly created thread
            const newThreads = await listThreads();
            const newThread = newThreads.find(t => !previousThreadIds.has(t.id));

            if (newThread) {
                setSelectedChat(newThread.id);
            }

            setIsCreationDialogOpen(false);
            resetCreateState();
        } catch (e) {
            console.error(e);
            setIsCreationProcessing(false);
        } finally {
            setIsCreationProcessing(false);
        }
    };

    const onRemoveMember = async (mid: number) => {
        const result = await removeMember(selectedThread!.id, mid);
        if (result) {
            await fetchThreads();
        } else {
            alert("Failed to remove member");
        }
    }

    const onLeaveChat = async (chatId: number) => {
        const result = await leaveThread(chatId);
        if (result) {
            await fetchThreads();
        } else {
            alert("Failed to leave chat.");
        }
    }

    const handleSendMessage = () => {

        if (!selectedThread) return;

        const trimmed = messageInput.trim();

        if (!trimmed.length) return;

        sendMessage(
            selectedThread.id,
            trimmed,
            []
        );

        setMessageInput("");
    };

    useEffect(() => {

        if (loading) return;

        const loadThreads = async () => {
            await fetchThreads();
            setPageLoading(false);
        };

        loadThreads();

    }, [loading, user]);

    // Auto-select first chat when threads are loaded (especially important for desktop)
    useEffect(() => {
        if (!pageLoading && threads.length > 0 && selectedChat === 0) {
            setSelectedChat(threads[0].id);
        }
    }, [threads, pageLoading]);

    useEffect(() => {

        if (!selectedThread) {
            setMessages([]);
            return;
        }

        let mounted = true;

        const loadThread = async () => {

            try {

                await connectToChat(selectedThread.id);

                const history = await getLiveThreadContent(selectedThread.id);

                if (!mounted) return;

                setMessages(history);

            } catch (e) {
                console.error(e);
            }
        };

        loadThread();

        const listener = (message: WebSocketMessageResponse) => {

            if (message.threadId !== selectedThread.id) return;

            setMessages(prev => {

                if (prev.some(m => m.id === message.id)) {
                    return prev;
                }

                return [...prev, message];
            });
        };

        onMessage(listener);

        return () => {

            mounted = false;

            disconnectFromChat(selectedThread.id);

        };

    }, [selectedThread]);

    // @ts-ignore
    return (
        <>
            <VStack w="100%" maxW="6xl" mx="auto" p={4} align="stretch">

                {pageLoading || loading ? (
                    <Spinner size="lg"/>
                ) : (
                    <>
                        {/* HEADER */}
                        <HStack justify="space-between" mb={6}>
                            <Heading size="3xl">Chats</Heading>

                            <Button
                                colorPalette="blue"
                                onClick={() => setIsCreationDialogOpen(true)}
                            >
                                <BiPlus/>
                                Create Chat
                            </Button>
                        </HStack>

                        {/* MAIN LAYOUT */}
                        <HStack align="strart" justify={threads.length > 0 ? "" : "center"} gap={4} w="100%" h="75vh">
                            {threads.length > 0 ? (
                                <>
                                    {/* THREAD LIST - Hidden on mobile when chat is selected */}
                                    {
                                        (!isMobile || !selectedChat) && (
                                            <VStack
                                                w={isMobile ? "100%" : "20%"}
                                                transition={`all 320ms ${smooth}`}
                                                align="stretch"
                                            >
                                                <VStack
                                                    align="stretch"
                                                    gap={2}
                                                    overflowY="auto"
                                                >

                                                    {threads.map((thread: Thread) => {

                                                        const isSelected = selectedChat === thread.id;

                                                        const isDM = thread.threadType === ThreadType.DM;

                                                        const ownerIsCurrentUser =
                                                            thread.owner.handle === user?.handle;

                                                        const other =
                                                            thread.otherMembers?.find(
                                                                (m: User) => m.handle !== user?.handle
                                                            ) ?? null;

                                                        /*
                                                            DM Logic:

                                                            If current user OWNS the DM:
                                                                show OTHER user

                                                            Otherwise:
                                                                show OWNER
                                                        */
                                                        const displayUser =
                                                            isDM && ownerIsCurrentUser
                                                                ? other
                                                                : thread.owner;

                                                        return (
                                                            <Box
                                                                key={thread.id}
                                                                p={3}
                                                                borderWidth="1px"
                                                                borderRadius="lg"
                                                                cursor="pointer"
                                                                bg={isSelected ? theme.cardBg : theme.bgPage}
                                                                borderColor={isSelected ? "blue.400" : undefined}
                                                                transition={`all 200ms ${smooth}`}
                                                                position="relative"
                                                                _hover={{transform: "translateY(-2px)"}}
                                                                onClick={() =>
                                                                    setSelectedChat(prev =>
                                                                        prev === thread.id ? prev : thread.id
                                                                    )
                                                                }
                                                            >

                                                                {/* ACTIVE BAR */}
                                                                <Box
                                                                    position="absolute"
                                                                    left="0"
                                                                    top="0"
                                                                    w="3px"
                                                                    h="100%"
                                                                    bg="blue.400"
                                                                    opacity={isSelected ? 1 : 0}
                                                                    transition={`all 200ms ${smooth}`}
                                                                />

                                                                <HStack gap={3}>

                                                                    {/* AVATAR */}
                                                                    <Flex
                                                                        boxSize="38px"
                                                                        align="center"
                                                                        justify="center"
                                                                    >
                                                                        {thread.threadType === ThreadType.GC ? (
                                                                            <BiGroup/>
                                                                        ) : (
                                                                            <Avatar.Root size="sm">
                                                                                <Avatar.Fallback>
                                                                                    {`${displayUser?.firstName?.[0] ?? ""}${displayUser?.lastName?.[0] ?? ""}`}
                                                                                </Avatar.Fallback>

                                                                                <Avatar.Image src={displayUser?.pfp}/>
                                                                            </Avatar.Root>
                                                                        )}
                                                                    </Flex>

                                                                    {/* TEXT */}
                                                                    <VStack align="start" gap={0} flex={1}>

                                                                        <Text fontWeight="semibold" fontSize="sm">
                                                                            {thread.threadType === ThreadType.GC
                                                                                ? thread.title
                                                                                : `${displayUser?.firstName ?? ""} ${displayUser?.lastName ?? ""}`.trim()}
                                                                        </Text>

                                                                        <Text fontSize="xs" opacity={0.6}>
                                                                            {thread.threadType === ThreadType.GC
                                                                                ? `Group Chat · ${(thread.otherMembers?.length ?? 0) + 1}`
                                                                                : `@${displayUser?.handle ?? "unknown"}`}
                                                                        </Text>

                                                                    </VStack>

                                                                    <Menu.Root>
                                                                        <Menu.Trigger asChild>
                                                                            <IconButton variant="ghost">
                                                                                <MoreVertical size={18}/>
                                                                            </IconButton>
                                                                        </Menu.Trigger>
                                                                        <Portal>
                                                                            <Menu.Positioner>
                                                                                <Menu.Content>
                                                                                    <Menu.Item
                                                                                        value="delete"
                                                                                        color="red"
                                                                                        onClick={() => {
                                                                                            if (ownerIsCurrentUser && !isDM) {
                                                                                                deleteThread(thread.id)
                                                                                                    .then(fetchThreads)
                                                                                            } else if (isDM) {
                                                                                                deleteThread(thread.id).then(fetchThreads)
                                                                                            } else {
                                                                                                onLeaveChat(thread.id).then(fetchThreads)
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        {ownerIsCurrentUser && !isDM ?
                                                                                            "Delete chat"
                                                                                            : isDM ?
                                                                                                "Close DM" : "Leave chat"
                                                                                        }
                                                                                    </Menu.Item>
                                                                                </Menu.Content>
                                                                            </Menu.Positioner>
                                                                        </Portal>
                                                                    </Menu.Root>

                                                                </HStack>
                                                            </Box>
                                                        )
                                                            ;
                                                    })}

                                                </VStack>
                                            </VStack>
                                        )}

                                    {/* CHAT PANEL - Show on desktop always when thread exists, on mobile when selected */}
                                    {selectedThread && (isMobile ? selectedChat !== 0 : true) && (
                                        <VStack
                                            w={isMobile ? "100%" : selectedThread?.threadType === ThreadType.GC && isSidebarOpen ? "65%" : "80%"}
                                            h="100%"
                                            align="stretch"
                                            borderWidth="1px"
                                            borderRadius="2xl"
                                            overflow="hidden"
                                            bg={theme.bgPage}
                                            transition={`all 320ms ${smooth}`}
                                        >

                                            {/* HEADER */}
                                            <HStack
                                                px={4}
                                                py={3}
                                                borderBottomWidth="1px"
                                                bg={theme.cardBg}
                                                justify="space-between"
                                            >
                                                <HStack gap={3} flex={1}>
                                                    {isMobile && (
                                                        <IconButton
                                                            variant="ghost"
                                                            onClick={() => setSelectedChat(0)}
                                                            size="sm"
                                                        >
                                                            <BiChevronRight
                                                                transform="rotate(180deg)"/>
                                                        </IconButton>
                                                    )}
                                                    <Heading size="md">
                                                        {chatHeading}
                                                    </Heading>
                                                </HStack>

                                                {selectedThread?.threadType === ThreadType.GC && (
                                                    <HStack gap={2}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setIsAddMemberDialogOpen(true)}
                                                        >
                                                            <BiUserPlus/>
                                                        </Button>
                                                        {!isMobile && (
                                                            <IconButton
                                                                variant="ghost"
                                                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                                                size="sm"
                                                            >
                                                                <BiGroup/>
                                                            </IconButton>
                                                        )}
                                                    </HStack>
                                                )}
                                            </HStack>

                                            {/* MESSAGES */}
                                            <VStack
                                                flex={1}
                                                overflowY="auto"
                                                align="stretch"
                                                p={4}
                                                gap={3}
                                                w="full"
                                            >

                                                {messages.length === 0 ? (
                                                    <VStack flex={1} justify="center">
                                                        <Text opacity={0.6}>
                                                            No messages yet
                                                        </Text>
                                                    </VStack>
                                                ) : (
                                                    messages.map((message) => {
                                                        const isSelf = message.senderHandle === user?.handle;

                                                        // Get sender's avatar from thread members
                                                        let senderAvatar = null;
                                                        if (selectedThread?.owner?.handle === message.senderHandle) {
                                                            senderAvatar = selectedThread.owner.pfp;
                                                        } else if (selectedThread?.otherMembers) {
                                                            const sender = selectedThread.otherMembers.find((m: User) => m.handle === message.senderHandle);
                                                            senderAvatar = sender?.pfp;
                                                        }

                                                        return (
                                                            <Flex
                                                                key={message.id}
                                                                justify={isSelf ? "flex-end" : "flex-start"}
                                                            >

                                                                {/* AVATAR - Always on left */}
                                                                <Avatar.Root size="sm">
                                                                    <Avatar.Fallback>
                                                                        {message.senderHandle?.[0]?.toUpperCase()}
                                                                    </Avatar.Fallback>
                                                                    {senderAvatar &&
                                                                        <Avatar.Image
                                                                            src={senderAvatar}/>}
                                                                </Avatar.Root>

                                                                {/* MESSAGE BUBBLE */}
                                                                <Box
                                                                    px={4}
                                                                    py={3}
                                                                    borderRadius="2xl"
                                                                    bg={isSelf ? "blue.500" : theme.cardBg}
                                                                    color={isSelf ? "white" : undefined}
                                                                >

                                                                    {/* SENDER INFO - Only show for other users */}
                                                                    {!isSelf && (
                                                                        <VStack
                                                                            align="start"
                                                                            gap={0} mb={2}>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                fontWeight="bold"
                                                                            >
                                                                                {/* Get sender's display name */}
                                                                                {selectedThread?.owner?.handle === message.senderHandle
                                                                                    ? `${selectedThread.owner.firstName ?? ""} ${selectedThread.owner.lastName ?? ""}`.trim()
                                                                                    : selectedThread?.otherMembers?.find((m: User) => m.handle === message.senderHandle)
                                                                                        ? `${selectedThread.otherMembers.find((m: User) => m.handle === message.senderHandle)?.firstName ?? ""} ${selectedThread.otherMembers.find((m: User) => m.handle === message.senderHandle)?.lastName ?? ""}`.trim()
                                                                                        : message.senderHandle
                                                                                }
                                                                            </Text>
                                                                            <Text
                                                                                fontSize="xs"
                                                                                opacity={0.7}
                                                                            >
                                                                                @{message.senderHandle}
                                                                            </Text>
                                                                        </VStack>
                                                                    )}

                                                                    {/* MESSAGE CONTENT */}
                                                                    <Text
                                                                        whiteSpace="pre-wrap"
                                                                        mb={1}>
                                                                        {message.content}
                                                                    </Text>

                                                                    {/* TIMESTAMP */}
                                                                    <Text
                                                                        fontSize="10px"
                                                                        opacity={0.6}
                                                                        textAlign={isSelf ? "right" : "left"}
                                                                    >
                                                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit"
                                                                        })}
                                                                    </Text>

                                                                </Box>


                                                            </Flex>
                                                        );
                                                    })
                                                )}

                                            </VStack>

                                            {/* INPUT */}
                                            <HStack p={4} borderTopWidth="1px">

                                                <Textarea
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    placeholder="Message..."
                                                    resize="none"
                                                    onKeyDown={(e) => {

                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMessage();
                                                        }
                                                    }}
                                                />

                                                <Button
                                                    colorPalette="blue"
                                                    onClick={handleSendMessage}
                                                >
                                                    <BiSend/>
                                                </Button>

                                            </HStack>

                                        </VStack>
                                    )}

                                    {/* MEMBERS SIDEBAR - Desktop only, Group Chats only */}
                                    {!isMobile && selectedThread?.threadType === ThreadType.GC && isSidebarOpen && (
                                        <VStack
                                            w="35%"
                                            h="100%"
                                            align="stretch"
                                            borderWidth="1px"
                                            borderRadius="2xl"
                                            overflow="hidden"
                                            bg={theme.bgPage}
                                            transition={`all 320ms ${smooth}`}
                                        >
                                            {/* SIDEBAR HEADER */}
                                            <HStack
                                                px={4}
                                                py={3}
                                                borderBottomWidth="1px"
                                                bg={theme.cardBg}
                                                justify="space-between"
                                            >
                                                <Heading size="md">Members</Heading>
                                                <IconButton
                                                    variant="ghost"
                                                    onClick={() => setIsSidebarOpen(false)}
                                                    size="sm"
                                                >
                                                    <BiX/>
                                                </IconButton>
                                            </HStack>

                                            {/* MEMBERS LIST */}
                                            <VStack
                                                flex={1}
                                                overflowY="auto"
                                                align="stretch"
                                                p={4}
                                                gap={3}
                                            >
                                                {/* OWNER */}
                                                <Box
                                                    p={3}
                                                    borderWidth="1px"
                                                    borderRadius="lg"
                                                    bg={theme.cardBg}
                                                >
                                                    <HStack gap={3} mb={1}>
                                                        <Avatar.Root size="sm">
                                                            <Avatar.Fallback>
                                                                {`${selectedThread.owner?.firstName?.[0] ?? ""}${selectedThread.owner?.lastName?.[0] ?? ""}`}
                                                            </Avatar.Fallback>
                                                            <Avatar.Image
                                                                src={selectedThread.owner?.pfp}/>
                                                        </Avatar.Root>
                                                        <VStack align="start" gap={0}
                                                                flex={1}>
                                                            <Text fontWeight="semibold"
                                                                  fontSize="sm">
                                                                {`${selectedThread.owner?.firstName ?? ""} ${selectedThread.owner?.lastName ?? ""}`.trim()}
                                                            </Text>
                                                            <Text fontSize="xs"
                                                                  opacity={0.6}>
                                                                @{selectedThread.owner?.handle}
                                                            </Text>
                                                        </VStack>
                                                        <Tag.Root colorPalette="blue"
                                                                  size="sm">
                                                            <Tag.Label>Owner</Tag.Label>
                                                        </Tag.Root>
                                                    </HStack>
                                                </Box>

                                                {/* OTHER MEMBERS */}
                                                {selectedThread.otherMembers?.map((member: User) => (
                                                    <Box
                                                        key={member.handle}
                                                        p={3}
                                                        borderWidth="1px"
                                                        borderRadius="lg"
                                                        bg={theme.cardBg}
                                                    >
                                                        <HStack gap={3}>
                                                            <Avatar.Root size="sm">
                                                                <Avatar.Fallback>
                                                                    {`${member?.firstName?.[0] ?? ""}${member?.lastName?.[0] ?? ""}`}
                                                                </Avatar.Fallback>
                                                                <Avatar.Image
                                                                    src={member?.pfp}/>
                                                            </Avatar.Root>
                                                            <VStack align="start" gap={0}
                                                                    flex={1}>
                                                                <Text fontWeight="semibold"
                                                                      fontSize="sm">
                                                                    {`${member?.firstName ?? ""} ${member?.lastName ?? ""}`.trim()}
                                                                </Text>
                                                                <Text fontSize="xs"
                                                                      opacity={0.6}>
                                                                    @{member?.handle}
                                                                </Text>
                                                            </VStack>
                                                            <Menu.Root>
                                                                <Menu.Trigger asChild>
                                                                    <IconButton
                                                                        variant="ghost">
                                                                        <MoreVertical
                                                                            size={18}/>
                                                                    </IconButton>
                                                                </Menu.Trigger>
                                                                <Portal>
                                                                    <Menu.Positioner>
                                                                        <Menu.Content>
                                                                            <Menu.Item
                                                                                value="remove"
                                                                                asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    colorPalette="red"
                                                                                    onClick={() => {
                                                                                        onRemoveMember(member.id)
                                                                                    }}>
                                                                                    Remove
                                                                                    from
                                                                                    chat
                                                                                </Button>
                                                                            </Menu.Item>
                                                                        </Menu.Content>
                                                                    </Menu.Positioner>
                                                                </Portal>
                                                            </Menu.Root>
                                                        </HStack>
                                                    </Box>
                                                ))}
                                            </VStack>

                                            {/* ADD MEMBER BUTTON */}
                                            <HStack p={4} borderTopWidth="1px">
                                                <Button
                                                    w="100%"
                                                    variant="outline"
                                                    onClick={() => setIsAddMemberDialogOpen(true)}
                                                >
                                                    <BiUserPlus/>
                                                    Add Member
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    )}
                                </>
                            ) : (
                                <VStack>
                                    <Text color={theme.mutedText}>No chats here yet. Create one</Text>
                                    <Button
                                        colorPalette="blue"
                                        size="md"
                                        onClick={() => setIsCreationDialogOpen(true)}
                                    >
                                        <BiPlus/>
                                        Create Chat
                                    </Button>
                                </VStack>

                            )}

                        </HStack>
                    </>
                )}

            </VStack>

            {/* CREATE CHAT DIALOG */
            }
            <Dialog.Root
                open={isCreationDialogOpen}
                onOpenChange={(s) => {
                    if (!s.open) resetCreateState();
                    setIsCreationDialogOpen(s.open);
                }}
            >
                <Portal>
                    <Dialog.Backdrop/>
                    <Dialog.Positioner>
                        <Dialog.Content>

                            <Dialog.Header>
                                <Dialog.Title>Create Chat</Dialog.Title>

                                <Dialog.CloseTrigger asChild>
                                    <IconButton variant="ghost">
                                        <BiX/>
                                    </IconButton>
                                </Dialog.CloseTrigger>
                            </Dialog.Header>

                            <Dialog.Body>
                                <VStack gap={5} align="stretch">

                                    {/* CHAT NAME */}
                                    <Field.Root>
                                        <Field.Label>Chat Name</Field.Label>
                                        <Field.HelperText>Only for group
                                            chats
                                        </Field.HelperText>

                                        <Input
                                            placeholder="Chat name"
                                            value={chatName}
                                            onChange={(e) => setChatName(e.target.value)}
                                            disabled={friendsAdded.length <= 1}
                                        />
                                    </Field.Root>

                                    {/* FRIEND MULTI SELECT */}
                                    <Field.Root>
                                        <Field.Label>Select Your Friends</Field.Label>

                                        <Select.Root
                                            multiple
                                            collection={friendsCollection}
                                            value={friendsAdded}
                                            onValueChange={(details) => {
                                                setFriendsAdded(details.value);
                                            }}
                                        >
                                            <Select.HiddenSelect/>

                                            <Select.Control>
                                                <Select.Trigger minH="3rem" px={3}
                                                                py={2}>
                                                    {selectedFriends.length > 0 ? (
                                                        <Wrap gap={2}>
                                                            {selectedFriends.map((friend: User) => (
                                                                <Tag.Root
                                                                    key={friend.handle}
                                                                    size="sm"
                                                                    colorPalette="blue"
                                                                    borderRadius="full"
                                                                >
                                                                    <HStack gap={2}>
                                                                        <Avatar.Root
                                                                            size="2xs">
                                                                            <Avatar.Fallback>
                                                                                {friend.firstName?.[0] ?? "?"}
                                                                            </Avatar.Fallback>

                                                                            <Avatar.Image
                                                                                src={friend.pfp}/>
                                                                        </Avatar.Root>

                                                                        <Tag.Label>
                                                                            {friend.firstName}
                                                                        </Tag.Label>

                                                                        <CloseButton
                                                                            size="2xs"
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();

                                                                                setFriendsAdded(prev =>
                                                                                    prev.filter(h => h !== friend.handle)
                                                                                );
                                                                            }}
                                                                        />
                                                                    </HStack>
                                                                </Tag.Root>
                                                            ))}
                                                        </Wrap>
                                                    ) : (
                                                        <Text opacity={0.6}>Select
                                                            friends</Text>
                                                    )}
                                                </Select.Trigger>

                                                <Select.IndicatorGroup>
                                                    <Select.Indicator/>
                                                </Select.IndicatorGroup>
                                            </Select.Control>

                                            {/* DROPDOWN */}
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>

                                                        {friendsCollection.items.map((item) => {

                                                            const full = friends.find(
                                                                (f: User) => f.handle === item.value
                                                            );

                                                            return (
                                                                <Select.Item
                                                                    key={item.value}
                                                                    item={item}
                                                                >
                                                                    <HStack gap={3}
                                                                            w="100%">
                                                                        <Avatar.Root
                                                                            size="sm">
                                                                            <Avatar.Fallback>
                                                                                {full?.firstName?.[0] ?? "?"}
                                                                            </Avatar.Fallback>

                                                                            <Avatar.Image
                                                                                src={full?.pfp}/>
                                                                        </Avatar.Root>

                                                                        <Text>
                                                                            {item.label}
                                                                        </Text>
                                                                    </HStack>

                                                                    <Select.ItemIndicator/>
                                                                </Select.Item>
                                                            );
                                                        })}

                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>

                                        </Select.Root>
                                    </Field.Root>

                                </VStack>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsCreationDialogOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    colorPalette="blue"
                                    disabled={!friendsAdded.length || isCreationProcessing}
                                    onClick={createChat}
                                >
                                    {isCreationProcessing
                                        ? <Spinner size="sm"/>
                                        : "Create"}
                                </Button>
                            </Dialog.Footer>

                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* ADD MEMBER DIALOG */
            }
            <Dialog.Root
                open={isAddMemberDialogOpen}
                onOpenChange={(s) => {
                    if (!s.open) setSelectedMembersToAdd([]);
                    setIsAddMemberDialogOpen(s.open);
                }}
            >
                <Portal>
                    <Dialog.Backdrop/>
                    <Dialog.Positioner>
                        <Dialog.Content>

                            <Dialog.Header>
                                <Dialog.Title>Add Members</Dialog.Title>

                                <Dialog.CloseTrigger asChild>
                                    <IconButton variant="ghost">
                                        <BiX/>
                                    </IconButton>
                                </Dialog.CloseTrigger>
                            </Dialog.Header>

                            <Dialog.Body>
                                <VStack gap={5} align="stretch">

                                    {/* FRIEND MULTI SELECT FOR ADDING TO GROUP */}
                                    <Field.Root>
                                        <Field.Label>Select Friends to Add</Field.Label>
                                        <Select.Root
                                            multiple
                                            collection={friendsCollection}
                                            value={selectedMembersToAdd}
                                            onValueChange={(details) => {
                                                setSelectedMembersToAdd(details.value);
                                            }}
                                        >
                                            <Select.HiddenSelect/>

                                            <Select.Control>
                                                <Select.Trigger minH="3rem" px={3}
                                                                py={2}>
                                                    {selectedMembersToAdd.length > 0 ? (
                                                        <Wrap gap={2}>
                                                            {selectedMembersToAdd.map((handle: string) => {
                                                                const friend = friends.find((f: User) => f.handle === handle);
                                                                return (
                                                                    <Tag.Root
                                                                        key={handle}
                                                                        size="sm"
                                                                        colorPalette="blue"
                                                                        borderRadius="full"
                                                                    >
                                                                        <HStack gap={2}>
                                                                            <Avatar.Root
                                                                                size="2xs">
                                                                                <Avatar.Fallback>
                                                                                    {friend?.firstName?.[0] ?? "?"}
                                                                                </Avatar.Fallback>

                                                                                <Avatar.Image
                                                                                    src={friend?.pfp}/>
                                                                            </Avatar.Root>

                                                                            <Tag.Label>
                                                                                {friend?.firstName}
                                                                            </Tag.Label>

                                                                            <CloseButton
                                                                                size="2xs"
                                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();

                                                                                    setSelectedMembersToAdd(prev =>
                                                                                        prev.filter(h => h !== handle)
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </HStack>
                                                                    </Tag.Root>
                                                                );
                                                            })}
                                                        </Wrap>
                                                    ) : (
                                                        <Text opacity={0.6}>Select
                                                            friends to add</Text>
                                                    )}
                                                </Select.Trigger>

                                                <Select.IndicatorGroup>
                                                    <Select.Indicator/>
                                                </Select.IndicatorGroup>
                                            </Select.Control>

                                            {/* DROPDOWN */}
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {friendsCollection.items.map((item) => {

                                                            const full = friends.find(
                                                                (f: User) => f.handle === item.value
                                                            );

                                                            // Don't show members already in the chat
                                                            const isAlreadyMember = selectedThread?.owner?.handle === item.value ||
                                                                selectedThread?.otherMembers?.some((m: User) => m.handle === item.value);

                                                            if (isAlreadyMember) return null;

                                                            return (
                                                                <Select.Item
                                                                    key={item.value}
                                                                    item={item}
                                                                >
                                                                    <HStack gap={3}
                                                                            w="100%">
                                                                        <Avatar.Root
                                                                            size="sm">
                                                                            <Avatar.Fallback>
                                                                                {full?.firstName?.[0] ?? "?"}
                                                                            </Avatar.Fallback>

                                                                            <Avatar.Image
                                                                                src={full?.pfp}/>
                                                                        </Avatar.Root>

                                                                        <Text>
                                                                            {item.label}
                                                                        </Text>
                                                                    </HStack>

                                                                    <Select.ItemIndicator/>
                                                                </Select.Item>
                                                            );
                                                        })}

                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>

                                        </Select.Root>
                                    </Field.Root>

                                </VStack>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAddMemberDialogOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    colorPalette="blue"
                                    disabled={!selectedMembersToAdd.length}
                                    onClick={() => {
                                        addMembers(
                                            selectedThread!!.id,
                                            selectedMembersToAdd)
                                            .then(() => {
                                                    setIsAddMemberDialogOpen(false);
                                                    setSelectedMembersToAdd([]);
                                                    fetchThreads();
                                                }
                                            );
                                    }}
                                >
                                    Add Members
                                </Button>
                            </Dialog.Footer>

                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

        </>
    )
        ;
}

export default DMs;