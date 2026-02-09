import {
    Box,
    Button,
    Center,
    Container,
    Field,
    Heading,
    HStack,
    Input,
    Link,
    Separator,
    Stack,
    Text
} from "@chakra-ui/react";
import {useState} from "react";
import {useColorModeValue} from "../components/ui/color-mode.tsx";
import {BsGoogle} from "react-icons/bs";
import {AiFillFacebook} from "react-icons/ai";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const mutedText = useColorModeValue("gray.500", "gray.400");


    const oauthRedirect = (url: string) => {
        window.location.href = url;
    };

    return (
        <Center minH="100vh" bg={bg}>
            <Container maxW="sm">
                <Box
                    bg={cardBg}
                    p={8}
                    rounded="xl"
                    shadow="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <form action="/login" method={"POST"}>
                        <Stack gap={6}>
                            <Stack gap={1} textAlign="center">
                                <Heading size="lg">Please sign in</Heading>
                                <Text color={mutedText}>
                                    Use your account credentials
                                </Text>
                            </Stack>

                            <Stack gap={4}>
                                <Field.Root>
                                    <Field.Label>Email</Field.Label>
                                    <Input
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoFocus
                                        placeholder="Email"
                                        type="email"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>Password</Field.Label>
                                    <Input
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Password"
                                    />
                                </Field.Root>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        </Stack>
                    </form>

                    <HStack my={6} gap={4}>
                        <Separator flex="1"/>
                        <Text fontSize="sm" color={mutedText}>
                            or
                        </Text>
                        <Separator flex="1"/>
                    </HStack>


                    <Stack gap={3}>
                        <Button
                            variant="solid"
                            colorPalette="blue"
                            size="lg"
                            onClick={() => oauthRedirect("/oauth2/google")}
                        >
                            <BsGoogle/>
                            Login with Google
                        </Button>

                        <Button
                            variant="solid"
                            colorPalette="purple"
                            size="lg"
                            onClick={() => oauthRedirect("/oauth2/facebook")}
                        >
                            <AiFillFacebook/>
                            Login with Facebook
                        </Button>
                    </Stack>
                    <HStack my={6} gap={4}>
                        <Separator flex="1"/>
                        <Text fontSize="sm" color={mutedText}>
                            Don't have an account? <Link href="/app/signup">Register </Link>
                        </Text>
                        <Separator flex="1"/>
                    </HStack>
                </Box>
            </Container>
        </Center>
    );
}

export default LoginPage;
