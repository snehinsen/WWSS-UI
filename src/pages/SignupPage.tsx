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
import {register, UserRegistration} from "../backend/api.ts";

function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const bg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const mutedText = useColorModeValue("gray.500", "gray.400");

    const handleSubmit = () => {
        const user: UserRegistration = {
            name: name,
            email: email,
            password: password,
        }
        register(user);

    };

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
                    <Stack gap={6}>
                        <Stack gap={1} textAlign="center">
                            <Heading size="lg">Please sign un</Heading>
                        </Stack>

                        <Stack gap={4}>
                            <Field.Root>
                                <Field.Label>Name</Field.Label>
                                <Input
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Your name"
                                    type="text"
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Email</Field.Label>
                                <Input
                                    name="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                colorScheme="blue"
                                size="lg"
                                onClick={handleSubmit}
                            >
                                Sign up
                            </Button>
                        </Stack>
                    </Stack>

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
                            Sign Up with Google
                        </Button>

                        <Button
                            variant="solid"
                            colorPalette="purple"
                            size="lg"
                            onClick={() => oauthRedirect("/oauth2/facebook")}
                        >
                            <AiFillFacebook/>
                            Sign Up with Facebook
                        </Button>

                        <HStack my={6} gap={4}>
                            <Separator flex="1"/>
                            <Text fontSize="sm" color={mutedText}>
                                Already have an account? <Link href="/app/login">Log In</Link>
                            </Text>
                            <Separator flex="1"/>
                        </HStack>
                    </Stack>
                </Box>
            </Container>
        </Center>
    );
}

export default SignupPage;
