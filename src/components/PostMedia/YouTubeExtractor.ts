/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - youtube.com/watch?v=VIDEO_ID (without protocol)
 * - youtu.be/VIDEO_ID (without protocol)
 */
export function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    try {
        // Handle youtu.be short links
        const shortMatch = url.match(/(?:youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (shortMatch && shortMatch[1]) {
            return shortMatch[1];
        }

        // Handle youtube.com watch links with query parameters
        const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/\?v=)([a-zA-Z0-9_-]{11})/);
        if (watchMatch && watchMatch[1]) {
            return watchMatch[1];
        }

        // Try parsing as URL to handle edge cases
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        
        // Check youtube.com
        if (urlObj.hostname.includes('youtube.com')) {
            const videoId = urlObj.searchParams.get('v');
            if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                return videoId;
            }
        }

        // Check youtu.be
        if (urlObj.hostname === 'youtu.be') {
            const videoId = urlObj.pathname.substring(1);
            if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                return videoId;
            }
        }
    } catch (e) {
        // Invalid URL, return null
    }

    return null;
}

/**
 * Finds all YouTube URLs in a text string
 */
export function extractAllYouTubeUrls(text: string): string[] {
    if (!text) return [];

    // Regex pattern to match YouTube URLs
    const youtubeUrlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;
    
    const urls: string[] = [];
    let match;

    while ((match = youtubeUrlPattern.exec(text)) !== null) {
        urls.push(match[0]);
    }

    return urls;
}

/**
 * Finds all unique YouTube video IDs in a text string
 */
export function extractAllYouTubeVideoIds(text: string): string[] {
    const urls = extractAllYouTubeUrls(text);
    const videoIds: Set<string> = new Set();

    urls.forEach((url) => {
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
            videoIds.add(videoId);
        }
    });

    return Array.from(videoIds);
}

