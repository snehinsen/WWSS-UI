import { ReactElement } from "react";
import { Box, VStack, ScrollArea } from "@chakra-ui/react";
import { useThemeColors } from "../ui/theme.ts";
import {useColorModeValue} from "../ui/color-mode.tsx";

export interface SettingsView {
    label: string;
    component: () => ReactElement;
}

interface Props {
    currentPage: SettingsView;
    onPageChange: (pageIndex: number) => void;
    pages: SettingsView[];
}

function Sidebar({ currentPage, onPageChange, pages }: Props) {

    const theme = useThemeColors();

    return (
        <Box
            h="full"
            bg={theme.cardBg}
            w={{ base: "100%", md: "240px" }}
            borderRadius="md"
            overflow="hidden"
        >
            <ScrollArea.Root h="full">
                <ScrollArea.Viewport>
                    <VStack
                        p={1}
                        align="stretch"
                    >
                        {pages.map((page: SettingsView, index: number) => (
                            <Box
                                key={index}
                                px={3}
                                py={2}
                                borderRadius="md"
                                cursor="pointer"
                                bg={
                                    currentPage.label === page.label
                                        ? theme.buttonPrimary
                                        : "transparent"
                                }
                                color={currentPage.label === page.label
                                    ? "white"
                                    : useColorModeValue("black", "white")}
                                _hover={{
                                    bg: theme.buttonPrimaryHover,
                                    color: "white",
                            }}

                                onClick={() => onPageChange(index)}
                            >
                                {page.label}
                            </Box>
                        ))}
                    </VStack>
                </ScrollArea.Viewport>

                <ScrollArea.Scrollbar orientation="vertical" />
            </ScrollArea.Root>
        </Box>
    );
}

export default Sidebar;