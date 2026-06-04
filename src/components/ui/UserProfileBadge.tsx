import {BotIcon} from "lucide-react";
import {Badge} from "@chakra-ui/react";


interface Props {
    isBot?: boolean;
}

export default function UserProfileBadge({isBot}: Props) {
    return (
        <>
            {isBot ? (
                <Badge variant="solid" colorPalette="blue" p={1} borderRadius={30}>
                    <BotIcon/>
                </Badge>
            ) : null}
        </>
    )
}