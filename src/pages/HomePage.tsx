import Header from "../components/Header";
import {Button, Heading, VStack} from "@chakra-ui/react";

function HomePage() {
    return (
        <>
            <Header headerType="landing"/>
            <VStack px="14" py="10" alignItems="self-start" gap={2}>
                <Heading as="h1">Welcome to the Wizarding World Social Service!</Heading>
                <p>A magical social media experience with your favorite characters!</p>
                <a href="/feed" className=" p-button-success">
                    <Button variant="surface">
                        Get Started
                    </Button>
                </a>
            </VStack>
        </>
    );
}

export default HomePage;
