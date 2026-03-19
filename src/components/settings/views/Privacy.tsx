import {Heading, VStack} from "@chakra-ui/react";
import {useThemeColors} from "../../ui/theme.ts";

function Privacy() {

    const theme = useThemeColors();


    return (
        <VStack
            bg={theme.cardBg}
            h="full"
        >
            <Heading>
                Privacy
            </Heading>
        </VStack>
    )
}

export default Privacy;