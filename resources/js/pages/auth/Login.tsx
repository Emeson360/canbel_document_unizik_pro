import { useState } from "react";
import {
    Flex,
    Button,
    Box,
    Image,
    Text,
    Heading,
    Card,
    CardHeader,
    CardBody,
    useColorMode,
    useColorModeValue,
    IconButton,
} from "@chakra-ui/react";
import CustomInput from "../../utils/CustomInput";
// import { showError, showSuccess } from "../../utils/Alert";
import { checkEmptyFields } from "../../utils/helpers";
import { Link, router } from "@inertiajs/react";
import { showError } from "../../utils/Alert";
import { useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import { FaMoon, FaSun } from "react-icons/fa6";

const Login = ({ errors }: { errors: any }) => {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [formState, setFormState] = useState({
        email: "",
        password: "",
    });

    const handleInputs = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormState({ ...formState, [name]: value });
    };

    useEffect(() => {
        if (errors) {
            const errorValues: string[] = Object.values(errors);
            errorValues.forEach((errorMessage) => {
                setIsFormSubmitting(false);
                showError(errorMessage);
            });
        }
    }, [errors]);

    const submitForm = async (e: any) => {
        e.preventDefault();
        const { email, password } = formState;

        const isFormEmpty = checkEmptyFields({
            email,
            password,
        });

        if (!isFormEmpty) {
            setIsFormSubmitting(true);
            router.post("/login", formState);
        }
    };

    const { colorMode, toggleColorMode } = useColorMode();
    const pageBg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const mutedColor = useColorModeValue("gray.600", "gray.400");

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={pageBg}
            p={6}
            position={"relative"}
        >
            <IconButton
                aria-label="Toggle theme"
                icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                position={"absolute"}
                top={"15px"}
                right={["10px", "40px"]}
            />
            <Box w={"full"} maxW={"md"}>
                <Flex align={"center"} justify={"center"} mb={6}>
                    <Image src={Logo} alt="logo" h={"42px"} />
                </Flex>

                <Card
                    boxShadow={"0px 0px 10px -2px rgba(0,0,0,0.1)"}
                    rounded={"2xl"}
                    border={"1px solid rgba(0,0,0,0.1)"}
                    bg={cardBg}
                >
                    <CardHeader pb={0}>
                        <Heading as={"h1"} fontSize={"xl"} fontWeight={600}>
                            Sign in to your account
                        </Heading>
                        <Text color={mutedColor} mt={1} fontSize={"sm"}>
                            Enter your credentials to continue
                        </Text>
                    </CardHeader>

                    <CardBody>
                        <form onSubmit={submitForm}>
                            <CustomInput
                                label="Email"
                                name="email"
                                type="email"
                                value={formState.email}
                                onChange={handleInputs}
                                mb="20px"
                            />
                            <CustomInput
                                label="Password"
                                name="password"
                                type="password"
                                value={formState.password}
                                onChange={handleInputs}
                                mb="20px"
                            />

                            <Button
                                type="submit"
                                variant={"primary"}
                                w={"full"}
                                size={"lg"}
                                height={"48px"}
                                fontWeight={500}
                                rounded="8px"
                                isLoading={isFormSubmitting}
                                loadingText="Loading..."
                            >
                                Sign In
                            </Button>

                            <Flex justify={"center"} mt={4}>
                                <Button
                                    variant={"link"}
                                    _hover={{ textDecor: "underline" }}
                                    as={Link}
                                    href={"/forgot-password"}
                                    fontSize={"sm"}
                                    color={"root.primary"}
                                    fontWeight={500}
                                >
                                    Forgot password?
                                </Button>
                            </Flex>
                        </form>
                    </CardBody>
                </Card>

                <Text
                    textAlign={"center"}
                    fontSize={"xs"}
                    color={mutedColor}
                    mt={6}
                >
                    © {new Date().getFullYear()} Canbel Technologies Ltd.
                </Text>
            </Box>
        </Flex>
    );
};

export default Login;
