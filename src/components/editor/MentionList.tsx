import {Avatar, Box, HStack, Text, VStack} from "@chakra-ui/react";
import {forwardRef, useImperativeHandle, useState} from "react";
import {User} from "../../backend/types";
import {useThemeColors} from "../ui/theme.ts";

interface Props {
    items: User[];
    command: (item: User) => void;
    query: string;
}

const MentionList = forwardRef(({items, command, query}: Props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const colors = useThemeColors();

    const selectItem = (index: number) => {
        const item = items[index];
        if (item) command(item);
    };

    useImperativeHandle(ref, () => ({
        onKeyDown: ({event}: any) => {
            if (event.key === "ArrowUp") {
                setSelectedIndex((i) => (i + items.length - 1) % items.length);
                return true;
            }
            if (event.key === "ArrowDown") {
                setSelectedIndex((i) => (i + 1) % items.length);
                return true;
            }
            if (event.key === "Enter") {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    const highlightMatch = (text: string) => {
        const regex = new RegExp(`(${query})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, idx) =>
            regex.test(part) ? (
                <Text as="span" key={idx} color="yellow.300" fontWeight="bold">
                    {part}
                </Text>
            ) : (
                <Text as="span" key={idx}>
                    {part}
                </Text>
            )
        );
    };

    return (
        <Box bg={colors.cardBg} borderRadius="md" p={2} shadow="lg" minW="250px">
            {items.length > 0 ? (
                <VStack align="stretch" gap={1}>
                    {items.map((item:User, index: number) => (
                        <HStack
                            key={index}
                            px={2}
                            py={1}
                            borderRadius="md"
                            bg={index === selectedIndex ? colors.hoverBg : "transparent"}
                            cursor="pointer"
                            _hover={{bg: colors.hoverBg}}
                            onClick={() => selectItem(index)}
                        >
                            <Avatar.Root size="xs">
                                <Avatar.Image src={item.pfp}/>
                                <Avatar.Fallback>{item.name.charAt(0)}</Avatar.Fallback>
                            </Avatar.Root>
                            <VStack align="start" gap={0}>
                                <Text fontWeight="bold">{highlightMatch(item.name)}</Text>
                                <Text fontSize="sm" color="gray.300">
                                    @{item.handle}
                                </Text>
                            </VStack>
                        </HStack>
                    ))}
                </VStack>) : (
                <Text color={colors.mutedText} textAlign="center">No users found</Text>
            )}
        </Box>
    );
});

export default MentionList;