import {
    Alert,
    Avatar,
    Box,
    Dialog,
    Field,
    FileUpload,
    Heading,
    HStack,
    IconButton,
    Input, Portal,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";
import {useThemeColors} from "../../ui/theme.ts";
import {useUserContext} from "../../../context/userContext.tsx";
import {BiUpload} from "react-icons/bi";
import {useEffect, useState} from "react";
import {uploadProfilePicture} from "../../../backend/api.ts";

function General() {

    const theme = useThemeColors();

    const {user, loading} = useUserContext();

    const [isChangePFPDialogOpen, setIsPFPDialogOpen] = useState(false);
    const [pfp, setPfp] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(user!!.pfp);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);


    useEffect(() => {
        const upload = async () => {
            if (!pfp) return setPreview(user!!.pfp);
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

    return (
        <VStack
            bg={theme.cardBg}
            h="full"
            gap={2}
            py={3}
            borderRadius="md"
        >
            {uploadSuccess === false && (
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>Unable to upload profile picture</Alert.Title>
                        <Alert.Description>
                            The file you uploaded did not save properly. Try uploading again, or try again later.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            )}

            <Heading>
                Overview
            </Heading>

            {!loading ? (
                <>
                    <Box position="relative">
                        <Avatar.Root size="2xl">
                            <Avatar.Image src={preview}/>
                            <Avatar.Fallback>{`${user?.firstName.charAt(0).toUpperCase()} ${user?.lastName.charAt(0).toUpperCase()}`}</Avatar.Fallback>
                        </Avatar.Root>
                        <IconButton
                            variant="surface"
                            position="absolute"
                            bottom="-4.5"
                            right="-2"
                            size="xs"
                            onClick={() => {
                                setIsPFPDialogOpen(true);
                            }}
                        >
                            <BiUpload/>
                        </IconButton>
                    </Box>

                    <Heading className="title" size="5xl">{user?.firstName}</Heading>
                    <Text color={theme.mutedText}>@{user?.handle}</Text>
                    <Box w="full" px={5}>
                        <Heading>Change My Profile</Heading>
                        <form>
                            <Field.Root orientation="horizontal">
                                <Field.Label>Handle</Field.Label>
                                <Input placeholder="Your new handle" value={user?.handle}/>
                            </Field.Root>
                        </form>
                    </Box>
                </>
            ) : (
                <Spinner/>
            )}

            <Dialog.Root open={isChangePFPDialogOpen} onOpenChange={(status) => {
                setIsPFPDialogOpen(status.open);
            }}>
                <Portal>
                    <Dialog.Positioner>
                        <Dialog.Backdrop/>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Heading>Change Profile Picture</Heading>
                            </Dialog.Header>
                            <Dialog.Body>
                                <FileUpload.Root
                                    maxFiles={1}
                                    accept={["image/png", "image/jpeg"]}
                                    onFileChange={
                                        (details) => {
                                            setPfp(details.acceptedFiles[0] ?? null)
                                            setIsPFPDialogOpen(false)
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
                                                color={theme.mutedText}
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

        </VStack>
    )
}

export default General;