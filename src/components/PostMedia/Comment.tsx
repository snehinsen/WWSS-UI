import Markdown from "@uiw/react-markdown-preview";
import MDMappings from "../editor/MDMappings.tsx";import {Post} from "../../backend/types"
import {Avatar, Box, Heading, HStack, Link, Text, VStack} from "@chakra-ui/react";
import {useThemeColors} from "../ui/theme.ts";
import {YouTubeEmbeds} from "./YouTubeEmbedNew.tsx";
import {extractAllYouTubeVideoIds} from "./YouTubeExtractor.ts";


interface Props {
    comment: Post;
}

function Comment({ comment }: Props) {
    const theme = useThemeColors();
    const youtubeVideoIds = extractAllYouTubeVideoIds(comment.body);
    
    return (
        <Box
            bg={theme.cardBg}
            w="100%"
            minW={0}
            p={{ base: 3, md: 4 }}
            borderRadius={{ base: "0.5rem", md: "0.75rem" }}
            shadow="sm"
        >
            <HStack gap={{ base: 2, md: 3 }} align="start" w="100%" minW={0} flexWrap="wrap">
                {/* Avatar */}
                <Avatar.Root size="md" minW={0}>
                    <Avatar.Image src={comment.user.pfp} alt={`${comment.user.firstName}'s avatar`} />
                    <Avatar.Fallback>{comment.user.firstName.charAt(0)+comment.user.lastName.charAt(0)}</Avatar.Fallback>
                </Avatar.Root>

                {/* Comment content */}
                <VStack align="start" gap={1} w={{ base: "100%", md: "calc(100% - 3rem)" }} minW={0}>
                    <Box>
                        <Link
                            href={`/app/profile/${comment.user.handle}`}
                        >
                            <Heading
                                size={{ base: "3xl", md: "md" }}
                                className="title"
                            >
                                {`${comment.user.firstName } ${comment.user.lastName}` || "Loading..."}
                            </Heading>
                        </Link>
                        <Text
                            fontSize={{ base: "xs", md: "sm" }}
                            color={theme.mutedText}
                        >
                            @{comment.user.handle || "Loading handle..."}
                        </Text>
                    </Box>

                    {/* Markdown body */}
                    <Box w="100%" minW={0}>
                        <Markdown
                            source={comment.body}
                            components={MDMappings}
                            wrapperElement={{ "data-color-mode": undefined }}
                            style={{ background: "none" }}
                        />
                    </Box>

                    {/* YouTube video embeds */}
                    {youtubeVideoIds.length > 0 && (
                        <Box w="100%" mt={2} mb={1}>
                            <YouTubeEmbeds videoIds={youtubeVideoIds} />
                        </Box>
                    )}
                </VStack>
            </HStack>
        </Box>
    )

}

export default Comment;