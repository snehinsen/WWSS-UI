import {useColorModeValue} from "./color-mode.tsx";

export function useThemeColors() {
    return {
        // Page + surfaces
        bgPage: useColorModeValue("gray.100", "gray.950"),
        cardBg: useColorModeValue("white", "gray.900"),
        mutedText: useColorModeValue("gray.500", "gray.400"),


        // Text
        textPrimary: useColorModeValue("black", "white"),
        textSecondary: useColorModeValue("gray.600", "gray.400"),

        // UI elements
        border: useColorModeValue("gray.200", "gray.600"),
        hoverBg: useColorModeValue("gray.50", "gray.800"),

        // Buttons (static)
        buttonPrimary: useColorModeValue("blue.500", "blue.800"),
        buttonPrimaryHover: "#054ba0",
    };
}
