import {Avatar, Box, Button, Dialog, FileUpload, HStack, IconButton, Portal, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {FaEdit} from "react-icons/fa";
import {BiUpload} from "react-icons/bi";
import {CgClose} from "react-icons/cg";
import {uploadProfilePicture} from "../backend/api.ts";
import {useThemeColors} from "./ui/theme.ts";
import {useUserContext} from "../context/userContext.tsx";

interface Props {
    image?: string | null;
    fallback?: React.ReactNode;
    size?: any;
    onUploadComplete?: () => void;
}

function ProfilePictureUploader({
                                    image,
                                    fallback,
                                    size = "2xl",
                                    onUploadComplete
                                }: Props) {

    const {refreshUser} = useUserContext()

    const colors = useThemeColors();

    const [preview, setPreview] = useState<string>(image ?? "");
    const [uploadOpen, setUploadOpen] = useState(false);

    useEffect(() => {
        setPreview(image ?? "");
    }, [image]);

    const handleUpload = async (file: File) => {
        const url = URL.createObjectURL(file);

        setPreview(url);

        try {
            const success = await uploadProfilePicture(file);

            if (success) {

                onUploadComplete?.();
                await refreshUser!!();
            }
        } finally {
            URL.revokeObjectURL(url);
        }
    };

    return (
        <Box position="relative" display="inline-block">
            <Avatar.Root size={size}>
                <Avatar.Image src={preview || undefined}/>
                <Avatar.Fallback>
                    {fallback}
                </Avatar.Fallback>
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

                                    <Dialog.CloseTrigger
                                        asChild
                                        onClick={() => setUploadOpen(false)}
                                    >
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
                                    onFileChange={(details) => {
                                        const file = details.acceptedFiles[0];

                                        if (!file) return;

                                        handleUpload(file).then();

                                        setUploadOpen(false);
                                    }}
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
    );
}

export default ProfilePictureUploader;