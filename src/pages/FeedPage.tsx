import Feed from "../components/Feed";
import Header from "../components/Header";
import {VStack} from "@chakra-ui/react";

function FeedPage() {
    return (
        <VStack gap={5} alignItems="self-start">
            <Header headerType="logged-in"/>
            <h2>Feed</h2>
            <Feed/>
        </VStack>
    );
}

export default FeedPage;
