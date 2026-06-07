import {
    Alert,
    Box,
    Button,
    Center,
    Container,
    createListCollection,
    Field,
    Heading,
    Input,
    InputGroup,
    Portal,
    Select,
    Stack,
    Text,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {BiAt, BiError, BiWebcam} from "react-icons/bi";
import {checkHandle, configure} from "../backend/api";
import {useThemeColors} from "./ui/theme.ts";
import ProfilePictureUploader from "./PFPUploader.tsx";

export default function Setup() {
    const [handle, setHandle] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
    const [handleValid, setValid] = useState<boolean>(true);
    const [canSubmit, setCanSubmit] = useState<boolean | null>(null);

    const colors = useThemeColors();

    const onHandleUpdate = (value: string) => {
        setHandle(value);
        setValid(/^[a-zA-Z0-9_-]*$/.test(value));
    };

    let submittionErrorMessage = "";

    const handleSubmit = () => {
        if (!handleAvailable || !handle || bloodType === "") {
            submittionErrorMessage =
                "Please ensure all required fields are valid. The following fields have an error:\n\n";

            if (!handle) {
                submittionErrorMessage += "The handle is required\n";
            }

            if (!handleAvailable) {
                submittionErrorMessage +=
                    "The handle you selected is already in use by another user\n";
            }

            if (bloodType === "") {
                submittionErrorMessage += "Please choose your blood type\n";
            }

            setCanSubmit(false);
        } else {
            setCanSubmit(true);
            configure(handle, bloodType);
            window.location.href = "/app/feed";
        }
    };

    const types = createListCollection({
        items: [
            {label: "Muggle", value: "m"},
            {label: "Pureblood", value: "pb"},
            {label: "Halfblood", value: "hb"},
            {label: "Muggle Born", value: "mb"},
        ],
    });

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
                        <Heading size="lg">
                            Set up your profile
                        </Heading>

                        {canSubmit === null || canSubmit ? null : (
                            <Alert.Root status="error">
                                <Alert.Indicator/>
                                <Alert.Content>
                                    <Alert.Title>
                                        Error saving your settings
                                    </Alert.Title>
                                    <Alert.Description>
                                        {submittionErrorMessage}
                                    </Alert.Description>
                                </Alert.Content>
                            </Alert.Root>
                        )}

                        <Center>
                            <ProfilePictureUploader
                                fallback={<BiWebcam />}
                            />
                        </Center>

                        <Stack gap={4}>
                            <Field.Root invalid={!handleValid}>
                                <Field.Label>
                                    Handle
                                </Field.Label>

                                <Field.RequiredIndicator/>

                                <InputGroup startElement={<BiAt />}>
                                    <Input
                                        value={handle}
                                        onChange={(e) =>
                                            onHandleUpdate(e.target.value)
                                        }
                                        placeholder="Your unique handle"
                                        required
                                        autoFocus
                                        variant="subtle"
                                    />
                                </InputGroup>

                                <Field.ErrorText>
                                    <BiError size={2}/>
                                    Your handle may only contain letters,
                                    numbers, and "-" or "_"
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
                                <Field.Label>
                                    Blood Type
                                </Field.Label>

                                <Field.RequiredIndicator/>

                                <Select.Root
                                    collection={types}
                                    value={[bloodType]}
                                    onValueChange={(e) =>
                                        setBloodType(e.value[0])
                                    }
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
                                                    <Select.Item
                                                        item={type}
                                                        key={type.value}
                                                    >
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
                                onClick={handleSubmit}
                            >
                                Finish setup
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Center>
    );
}