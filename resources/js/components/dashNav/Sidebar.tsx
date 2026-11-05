import { ReactNode, useState } from "react";
import {
    Box,
    CloseButton,
    Flex,
    Icon,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Image,
    Text,
    Collapse,
} from "@chakra-ui/react";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { IconType } from "react-icons";
import Logo from "../../assets/images/logo.png";
import MobileNav from "./TopNav";
import "./Nav.css";
import {
    PiUsersThreeDuotone,
    PiStudentBold,
    PiBuildingsDuotone,
} from "react-icons/pi";
import { CiViewList } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { useColorModeValue } from "@chakra-ui/react";
// import { LuUser2 } from "react-icons/lu";
import CustomLink from "../../utils/CustomLink";
import { router, usePage } from "@inertiajs/react";
import { CustomUsePageProps } from "../../utils/types";
import { useEffect } from "react";
import { BsGear } from "react-icons/bs";
import { TbLayoutGrid } from "react-icons/tb";

// import { RootState } from '../../redux/store';

interface LinkItemProps {
    name: string;
    icon: IconType;
    routeTo?: string;
    isCollapsible?: boolean;
    linkItems?: LinkItemProps[];
}

export function SideBar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const Bg = useColorModeValue("#FAFAFB", "gray.900");

    return (
        <Box minH="100vh" bg={Bg}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: "none", md: "block" }}
                className={"sidebarI vScroll"}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="sm"
            >
                <DrawerContent>
                    <SidebarContent
                        onClose={onClose}
                        className={"sidebarII vScroll"}
                    />
                </DrawerContent>
            </Drawer>

            {/* top nav */}
            <MobileNav onOpen={onOpen} />

            {/* dashboard content */}
            <Box ml={{ base: 0, md: 60 }} pt={0} p={["15px", "32px", "20px"]}>
                <Box mx={"auto"} maxWidth={"1400px"}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

/*******************
 * Main sidebar
 * *****************/
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const [linkItems, setLinkItems] = useState<LinkItemProps[]>([]);
    const role = user?.role;

    useEffect(() => {
        if (user?.role === "admin") {
            setLinkItems([
                {
                    name: "Dashboard",
                    icon: RiLayoutMasonryFill,
                    routeTo: `/${role}/dashboard`,
                },
                {
                    name: "Users",
                    icon: PiUsersThreeDuotone,
                    routeTo: `/${role}/users`,
                },
                {
                    name: "Documents",
                    icon: CiViewList,
                    routeTo: `/${role}/documents`,
                },
                {
                    name: "Faculties & Departments",
                    icon: PiBuildingsDuotone,
                    routeTo: `/${role}/faculties-and-departments`,
                },
                {
                    name: "Document Layout",
                    icon: TbLayoutGrid,
                    routeTo: `/${role}/document-layout`,
                },
                {
                    name: "Settings",
                    icon: BsGear,
                    routeTo: `/${role}/settings`,
                },
            ]);
        }

        if (user?.role === "registrar") {
            setLinkItems([
                {
                    name: "Dashboard",
                    icon: RiLayoutMasonryFill,
                    routeTo: `/${role}/dashboard`,
                },
                {
                    name: "Documents",
                    icon: CiViewList,
                    routeTo: `/${role}/documents`,
                },
                {
                    name: "Faculties & Departments",
                    icon: PiBuildingsDuotone,
                    routeTo: `/${role}/faculties-and-departments`,
                },
                {
                    name: "Settings",
                    icon: BsGear,
                    routeTo: `/${role}/settings`,
                },
            ]);
        }

        if (user?.role === "supervisor") {
            setLinkItems([
                {
                    name: "Dashboard",
                    icon: RiLayoutMasonryFill,
                    routeTo: `/${role}/dashboard`,
                },
                {
                    name: "Documents",
                    icon: CiViewList,
                    routeTo: `/${role}/documents`,
                },
                {
                    name: "Student Submissions",
                    icon: PiStudentBold,
                    routeTo: `/${role}/student-submissions`,
                },
                {
                    name: "Document Layout",
                    icon: TbLayoutGrid,
                    routeTo: `/${role}/document-layout`,
                },
                {
                    name: "Settings",
                    icon: BsGear,
                    routeTo: `/${role}/settings`,
                },
            ]);
        }
    }, [user]);

    const logOut = () => {
        router.post("/logout");
    };
    const mutedText = useColorModeValue("#16000066", "gray.200");
    const Bg = useColorModeValue("white", "gray.800");
    const hoverColor = useColorModeValue("root.black", "root.primary");

    return (
        <Box
            transition="3s ease"
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            overflowY={"auto"}
            bg={Bg}
            {...rest}
        >
            <Flex justify={"flex-end"} padding={3}>
                <CloseButton
                    color={"root.dangerDark"}
                    display={{ base: "flex", md: "none" }}
                    fontSize={"18px"}
                    onClick={onClose}
                />
            </Flex>
            <Flex
                h="5rem"
                alignItems="center"
                mx="8"
                mt={{ base: "20px", md: "47px" }}
                mb={"54px"}
                justifyContent="center"
                direction={"column"}
                gap={0}
            >
                <Image src={Logo} width={["100px", "150px"]} alt="logo" />
                <Text
                    textTransform={"capitalize"}
                    textAlign={"center"}
                    color={mutedText}
                    fontWeight={500}
                >
                    {user?.role}
                </Text>
            </Flex>
            {linkItems.map((link) =>
                link.isCollapsible ? (
                    <CollapsibleNavItem
                        key={link.name}
                        onClick={onClose}
                        icon={link.icon}
                        items={link.linkItems}
                    >
                        {link.name}
                    </CollapsibleNavItem>
                ) : (
                    <NavItem
                        key={link.name}
                        onClick={onClose}
                        routeTo={link.routeTo || ""}
                        icon={link.icon}
                    >
                        {link.name}
                    </NavItem>
                ),
            )}

            <Flex
                align="center"
                p="3"
                pl={"8"}
                my="5"
                mt={"50px"}
                transition={"0.2s ease"}
                role="group"
                cursor="pointer"
                className="sideLink"
                color={mutedText}
                onClick={logOut}
                _hover={{ color: hoverColor, borderRight: "3px solid" }}
            >
                <Icon
                    mr="4"
                    fontSize="24"
                    _groupHover={{
                        color: "brand.primaryII",
                    }}
                    as={AiOutlineLogout}
                />
                Logout
            </Flex>
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    routeTo?: string;
    items?: LinkItemProps[];
    mini?: boolean;
    children: ReactNode;
}
const NavItem = ({ icon, routeTo, children, mini, ...rest }: NavItemProps) => {
    const { url } = usePage();
    const isActive = url?.startsWith(routeTo || "");

    const hoverColor = useColorModeValue("root.black", "root.primary");
    const textColor = useColorModeValue("#16000066", "gray.200");

    return (
        <CustomLink
            href={routeTo || ""}
            className={isActive ? "activeSideLink" : ""}
        >
            <Flex
                align="center"
                p={1}
                pl={mini ? "45px" : "8"}
                my={mini ? 2 : 5}
                transition={"0.2s ease"}
                role="group"
                cursor="pointer"
                className="sideLink"
                color={textColor}
                _hover={{
                    color: hoverColor,
                    borderRight: "3px solid",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize={mini ? "20" : "24"}
                        _groupHover={{
                            color: "brand.primaryII",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </CustomLink>
    );
};

const CollapsibleNavItem = ({
    icon,
    children,
    items,
    onClick,
    ...rest
}: NavItemProps) => {
    const { isOpen, onToggle } = useDisclosure();
    const textColor = useColorModeValue("#16000066", "gray.200");

    return (
        <>
            <Flex
                justify={"space-between"}
                p={1}
                pl={"8"}
                pr={3}
                mt="5"
                mb={isOpen ? 0 : 5}
                transition={"0.2s ease"}
                cursor="pointer"
                className="sideLink"
                color={textColor}
                _hover={{
                    color: "root.primary",
                }}
                onClick={onToggle}
                {...rest}
            >
                <Flex align="center">
                    {icon && (
                        <Icon
                            mr="4"
                            fontSize="24"
                            _groupHover={{
                                color: "brand.primaryII",
                            }}
                            as={icon}
                        />
                    )}
                    {children}
                </Flex>
                <Icon
                    as={FaChevronDown}
                    className={isOpen ? "rotate-arrow" : "reverse-rotate-arrow"}
                />
            </Flex>
            <Collapse in={isOpen} animateOpacity>
                {items?.map((val) => (
                    <NavItem
                        key={val.name}
                        onClick={onClick}
                        routeTo={val.routeTo || ""}
                        icon={val.icon}
                        mini={true}
                    >
                        {val.name}
                    </NavItem>
                ))}
            </Collapse>
        </>
    );
};

export default SideBar;
