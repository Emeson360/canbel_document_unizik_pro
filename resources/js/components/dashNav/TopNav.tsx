import {
    FlexProps,
    Flex,
    Heading,
    IconButton,
    Avatar,
    Box,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { useColorModeValue } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link, router, usePage } from "@inertiajs/react";
import { CustomUsePageProps } from "../../utils/types";
// import { useLocation } from "react-router-dom";

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const { colorMode, toggleColorMode } = useColorMode();
    const path = location.pathname?.split("/");
    const curPage = path?.length ? path[2] : "ish";

    const textColor = useColorModeValue("root.black", "root.white");
    const mutedText = useColorModeValue("gray.600", "gray.400");
    const Bg = useColorModeValue("#FAFAFB", "gray.900");

    const logOut = () => {
        router.post("/logout");
    };

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={["15px", "32px"]}
            height="20"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            {...rest}
            bg={Bg}
            color={textColor}
        >
            {/* left */}
            <Flex align={"center"}>
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    rounded={"8px"}
                    size={"sm"}
                    mr={2}
                    icon={<FiMenu />}
                />
                <Heading
                    fontWeight={700}
                    fontSize={["20px", "26px"]}
                    textTransform={"capitalize"}
                >
                    {curPage?.replace(/-/g, " ").replace(/ai /g, "AI ")}
                </Heading>
            </Flex>

            {/* right side */}
            <Flex gap={"16px"} align={"center"}>
                <Box>
                    <Flex gap={4} align={"center"}>
                        {/* Theme toggle */}
                        <IconButton
                            aria-label="Toggle theme"
                            icon={
                                colorMode === "light" ? <FaMoon /> : <FaSun />
                            }
                            onClick={toggleColorMode}
                            variant="ghost"
                            size="sm"
                        />
                    </Flex>
                </Box>

                <Menu>
                    <MenuButton
                        py={2}
                        transition="all 0.3s"
                        _focus={{ boxShadow: "none" }}
                    >
                        <HStack>
                            <HStack>
                                <Avatar
                                    size={"sm"}
                                    src={user?.coverUrl || ""}
                                />
                                <Box>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </HStack>
                    </MenuButton>
                    <MenuList color={textColor}>
                        <Text
                            px={3}
                            fontWeight={600}
                            pt={2}
                            fontSize={"14px"}
                            textTransform={"capitalize"}
                        >
                            {user?.name}
                        </Text>
                        <Text
                            px={3}
                            fontWeight={500}
                            py={2}
                            pt={2}
                            fontSize={"12px"}
                            color={mutedText}
                        >
                            {user?.email}
                        </Text>
                        <Link href={`/${user?.role}/settings`}>
                            <MenuItem>Settings</MenuItem>
                        </Link>
                        <MenuDivider />
                        <MenuItem onClick={logOut}>Sign out</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    );
};

export default MobileNav;
