import {
    Alert,
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
    InputGroup,
    Portal,
    Select,
    Stack,
    Text,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {FaEdit} from "react-icons/fa";
import {BiAt, BiError, BiUpload, BiWebcam} from "react-icons/bi";
import {CgClose} from "react-icons/cg";
import {checkHandle, configure, uploadProfilePicture} from "../backend/api";
import {useThemeColors} from "./ui/theme.ts";

export default function Setup() {
    const [pfp, setPfp] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [handle, setHandle] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
    const [handleValid, setValid] = useState<boolean>(true); // blank is technically valid as it's NO handle
    const [uploadOpen, setUploadOpen] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
    const [canSubmit, setCanSubmit] = useState<boolean | null>(null);
    const colors = useThemeColors();

    const onHandleUpdate = (value: string) => {
        setHandle(value);
        setValid(/^[a-zA-Z0-9_-]*$/.test(value));
    }

    let submittionErrorMessage = "";

    const handleSubmit = () => {
        if (!handleAvailable || !handle || bloodType === "") {
            submittionErrorMessage = "Please ensure all required fields are valid. The following fields have an error:\n\n";

            if (!handle) {
                submittionErrorMessage += "The handle is required\n";
            }

            if (!handleAvailable) {
                submittionErrorMessage += "The handle you selected is already in use by another user\n";
            }

            if (bloodType == "") {
                submittionErrorMessage += "Please choose your blood type\n";
            }

            setCanSubmit(false);
        } else {
            setCanSubmit(true);
            configure(handle, bloodType);
            window.location.href = "/app/feed";
        }
    }

    const types = createListCollection({
        items: [
            {label: "Muggle", value: "m"},
            {label: "Pureblood", value: "pb"},
            {label: "Halfblood", value: "hb"},
            {label: "Muggle Born", value: "mb"},
        ],
    });

    useEffect(() => {
        const upload = async () => {
            if (!pfp) return setPreview(null);
            const url = URL.createObjectURL(pfp);
            setPreview(url);
            const uploadState: boolean = await uploadProfilePicture(pfp);
            if (uploadState) {
                setUploadSuccess(true);
            } else {
                setUploadSuccess(false);
            }
            return () => URL.revokeObjectURL(url);
        }
        upload().then();
    }, [pfp]);

    useEffect(() => {
        if (!handle) return setHandleAvailable(null);
        const t = setTimeout(async () => {
            setHandleAvailable(await checkHandle(handle));
        }, 500);
        return () => clearTimeout(t);
    }, [handle]);

    return (
        <Center minH="100vh" bg={colors.bgPage}>
            <Container maxW="sm">
                <Box
                    bg={colors.cardBg}
                    p={8}
                    rounded="xl"
                    shadow="lg"
                    borderWidth="1px"
                    borderColor={colors.border}
                >
                    <Stack gap={6} textAlign="center">
                        <Heading size="lg">Set up your profile</Heading>
                        {canSubmit === null || canSubmit ? (<></>) : (
                            <Alert.Root status="error">
                                <Alert.Indicator/>
                                <Alert.Content>
                                    <Alert.Title>Error saving your settings</Alert.Title>
                                    <Alert.Description>{submittionErrorMessage}</Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        {uploadSuccess === null ? (
                            <></>
                        ) : (
                            <Alert.Root status={uploadSuccess ? "success" : "error"}>
                                <Alert.Indicator/>
                                <Alert.Content>
                                    <Alert.Title>{uploadSuccess ? "File saved Successfully" : "Upload failed"}</Alert.Title>
                                    <Alert.Description>
                                        {uploadSuccess ? "The file was saved successfully" : "Upload failed, please try again later"}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}
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
                                        size="2xs"
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
                                                                color={colors.mutedText}
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

                        <Stack gap={4}>
                            <Field.Root invalid={!handleValid}>
                                <Field.Label>Handle</Field.Label>
                                <Field.RequiredIndicator/>
                                <InputGroup
                                    startElement={<BiAt/>}>
                                    <Input
                                        value={handle}
                                        onChange={(e) => onHandleUpdate(e.target.value)}
                                        placeholder="Your unique handle"
                                        required
                                        autoFocus
                                        variant="subtle"
                                    />
                                </InputGroup>
                                <Field.ErrorText>
                                    <BiError size={2}/>
                                    Your handle may only contain letters, numbers, and "-" or "_"
                                </Field.ErrorText>
                                {handle && (
                                    <Text
                                        fontSize="sm"
                                        color={
                                            handleAvailable === null
                                                ? colors.mutedText
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
                                <Field.RequiredIndicator/>
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

                            <Button
                                colorPalette="blue"
                                size="lg"
                                onClick={handleSubmit}>
                                Finish setup
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Center>
    );
}