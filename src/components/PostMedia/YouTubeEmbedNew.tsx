import { Box, AspectRatio, Spinner, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";

interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
    compact?: boolean;
}

export function YouTubeEmbed({ videoId, compact = false }: YouTubeEmbedProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return (
            <Box bg="red.50" p={2} borderRadius="md" borderLeft="4px solid" borderLeftColor="red.500" fontSize="xs">
                <Text color="red.700">Invalid video ID</Text>
            </Box>
        );
    }

    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const videoWidth = compact ? { base: "280px", md: "300px" } : "100%";
    const videoMaxWidth = compact ? "300px" : "100%";

    return (
        <Box position="relative" w={videoWidth} maxW={videoMaxWidth} minW={0} flex={compact ? "0 1 auto" : "1"}>
            {isLoading && (
                <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={1}>
                    <Spinner size="sm" />
                </Box>
            )}
            {error && (
                <Box bg="red.50" p={2} borderRadius="md" borderLeft="3px solid" borderLeftColor="red.500" fontSize="xs">
                    <Text color="red.700">Failed to load</Text>
                </Box>
            )}
            <AspectRatio ratio={16 / 9} w="100%" maxW="100%">
                <iframe
                    src={embedUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                        border: "none",
                        borderRadius: "0.375rem",
                        display: isLoading ? "none" : "block",
                    }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setError("Failed to load video");
                    }}
                />
            </AspectRatio>
        </Box>
    );
}

interface YouTubeEmbedsProps {
    videoIds: string[];
}

export function YouTubeEmbeds({ videoIds }: YouTubeEmbedsProps) {
    if (!videoIds || videoIds.length === 0) {
        return null;
    }

    return (
        <HStack align="start" gap={3} w="100%" flexWrap="wrap">
            {videoIds.map((videoId) => (
                <YouTubeEmbed key={videoId} videoId={videoId} compact={true} />
            ))}
        </HStack>
    );
}

