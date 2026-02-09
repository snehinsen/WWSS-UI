import {
    Avatar,
    Box,
    Button,
    Center,
    Container,
    createListCollection,
    Dialog,
    Field,
    FileUpload,
    Heading,
    HStack,
    IconButton,
    Input,
    Portal,
    Select,
    Stack,
    Text,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {FaEdit} from "react-icons/fa";
import {BiUpload, BiWebcam} from "react-icons/bi";
import {checkHandle} from "../backend/api";
import {useColorModeValue} from "../components/ui/color-mode";
import {CgClose} from "react-icons/cg";

function Setup() {
    const [pfp, setPfp] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [handle, setHandle] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
    const [uploadOpen, setUploadOpen] = useState<boolean>(false);
    // 🎨 SAME TOKENS AS SIGNUP PAGE
    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const mutedText = useColorModeValue("gray.500", "gray.400");

    const types = createListCollection({
        items: [
            {label: "Muggle", value: "m"},
            {label: "Pureblood", value: "pb"},
            {label: "Halfblood", value: "hb"},
            {label: "Muggle Born", value: "mb"},
        ],
    });

    useEffect(() => {
        if (!pfp) return setPreview(null);
        const url = URL.createObjectURL(pfp);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [pfp]);

    useEffect(() => {
        if (!handle) return setHandleAvailable(null);
        const t = setTimeout(async () => {
            setHandleAvailable(await checkHandle(handle));
        }, 500);
        return () => clearTimeout(t);
    }, [handle]);

    return (
        <Center minH="100vh" bg={bg}>
            <Container maxW="sm">
                <Box
                    bg={cardBg}
                    p={8}
                    rounded="xl"
                    shadow="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <Stack gap={6} textAlign="center">
                        <Heading size="lg">Set up your profile</Heading>

                        {/* Avatar */}
                        <Box position="relative" display="inline-block" mx="auto">
                            <Avatar.Root size="2xl">
                                <Avatar.Fallback>
                                    <BiWebcam/>
                                </Avatar.Fallback>
                                <Avatar.Image src={preview ?? undefined}/>
                            </Avatar.Root>

                            <Dialog.Root placement="center" open={uploadOpen}>
                                <Dialog.Trigger asChild onClick={() => setUploadOpen(true)}>
                                    <Button
                                        aria-label="Upload profile picture"
                                        size="5xs"
                                        variant="ghost"
                                        position="absolute"
                                        bottom={0}
                                        right={0}
                                    >
                                        <FaEdit/>
                                    </Button>
                                </Dialog.Trigger>

                                <Portal>
                                    <Dialog.Backdrop/>
                                    <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                                <HStack justify="space-between">
                                                    Upload Profile Picture
                                                    <Dialog.CloseTrigger asChild onClick={() => setUploadOpen(false)}>
                                                        <IconButton variant="ghost">
                                                            <CgClose/>
                                                        </IconButton>
                                                    </Dialog.CloseTrigger>
                                                </HStack>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <FileUpload.Root
                                                    maxFiles={1}
                                                    accept={["image/png", "image/jpeg"]}
                                                    onFileChange={
                                                        (details) => {
                                                            setPfp(details.acceptedFiles[0] ?? null)
                                                            setUploadOpen(false)
                                                        }
                                                    }
                                                >
                                                    <FileUpload.HiddenInput/>
                                                    <FileUpload.Dropzone
                                                        display="flex"
                                                        flex="1"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        minW="100%"
                                                        borderRadius="md"
                                                    >
                                                        <HStack gap={3}>
                                                            <BiUpload size={28}/>
                                                            <Text
                                                                color={mutedText}
                                                                fontSize="sm"
                                                                textAlign="center"
                                                                whiteSpace="nowrap"
                                                            >
                                                                Drag & drop or click to upload
                                                            </Text>
                                                        </HStack>
                                                    </FileUpload.Dropzone>

                                                </FileUpload.Root>
                                            </Dialog.Body>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>
                        </Box>

                        {/* Form */}
                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Handle</Field.Label>
                                <Input
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    placeholder="Your unique handle"
                                    required
                                    autoFocus
                                    variant="subtle"
                                />
                                {handle && (
                                    <Text
                                        fontSize="sm"
                                        color={
                                            handleAvailable === null
                                                ? mutedText
                                                : handleAvailable
                                                    ? "green.500"
                                                    : "red.500"
                                        }
                                    >
                                        {handleAvailable === null
                                            ? "Checking…"
                                            : handleAvailable
                                                ? "Available"
                                                : "Taken"}
                                    </Text>
                                )}
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Blood Type</Field.Label>
                                <Select.Root
                                    collection={types}
                                    value={[bloodType]}
                                    onValueChange={(e) => setBloodType(e.value[0])}
                                    variant="subtle"
                                >
                                    <Select.HiddenSelect/>
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Select blood type"/>
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator/>
                                        </Select.IndicatorGroup>
                                    </Select.Control>

                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {types.items.map((type) => (
                                                    <Select.Item item={type} key={type.value}>
                                                        {type.label}
                                                        <Select.ItemIndicator/>
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Field.Root>

                            <Button colorScheme="blue" size="lg" onClick={() => setUploadOpen(true)}>
                                Finish Onboarding
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Center>
    )
        ;
}

export default Setup;
