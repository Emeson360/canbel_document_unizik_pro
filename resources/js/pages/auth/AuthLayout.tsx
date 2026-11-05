import { ReactNode } from "react";
import {
    Flex,
    Heading,
    Image,
    Text,
    Box,
    useColorMode,
    IconButton,
    useColorModeValue,
} from "@chakra-ui/react";
import Logo from "../../assets/images/logo.png";
import { FaMoon, FaSun } from "react-icons/fa6";

interface LayoutProps {
    children: ReactNode;
    heading?: string;
    subHeading?: ReactNode;
    animateLogo?: boolean;
    //   logoReplacement?: string;
}

const AuthLayout = ({
    children,
    heading,
    subHeading,
    animateLogo = false,
}: //   logoReplacement,
LayoutProps) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const Bg = useColorModeValue("#fff", "gray.800");

    return (
        <Flex justify={"center"} align={"center"} minH={"100vh"} bg={Bg}>
            <Box width={{ base: "90%", md: "550px" }} py={"50px"}>
                <Flex
                    position={"absolute"}
                    top={"15px"}
                    left={["10px", "40px"]}
                    align={"center"}
                >
                    <Image
                        src={Logo}
                        className={animateLogo ? "animateLogo" : ""}
                        height={"50px"}
                        alt="logo"
                    />
                </Flex>
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
                <Box my="32px">
                    <Heading
                        as={"h2"}
                        fontSize="24px"
                        fontWeight={700}
                        textAlign={"center"}
                    >
                        {heading}
                    </Heading>
                    {subHeading ? (
                        <Text textAlign={"center"} mt={"8px"}>
                            {subHeading}
                        </Text>
                    ) : (
                        ""
                    )}
                </Box>

                {children}
            </Box>
        </Flex>
    );
};

export default AuthLayout;
