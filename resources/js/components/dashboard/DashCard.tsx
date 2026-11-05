import { Flex, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
// import { useNavigate } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/react";
import { router } from "@inertiajs/react";

interface CardProp {
    stat?: string | number | undefined;
    title: string;
    icon: IconType;
    iconColor?: string[];
    route?: string;
    onClick?: () => void;
}

const DashCard = ({
    stat,
    title,
    icon,
    iconColor = ["#FAE6E5", "root.primary"],
    route,
    onClick,
}: CardProp) => {
    //   const navigate = useNavigate();
    const routeTo = (url: string) => {
        router.get(url);
    };
    const Bg = useColorModeValue("root.white", "gray.800");

    return (
        <Flex
            bg={Bg}
            rounded={"10px"}
            py={"28px"}
            justify={"center"}
            align={"center"}
            gap={"23px"}
            cursor={"pointer"}
            onClick={() => (route ? routeTo(route) : onClick?.())}
        >
            <Flex
                bg={iconColor[0]}
                boxSize={"60px"}
                rounded={"50%"}
                justify="center"
                align={"center"}
            >
                <Icon as={icon} fontSize="24px" color={iconColor[1]} />
            </Flex>
            <Flex direction={"column"}>
                {stat ? (
                    <Text fontSize={"22px"} fontWeight={700}>
                        {stat || 0}
                    </Text>
                ) : (
                    ""
                )}
                <Text
                    fontSize={"14px"}
                    textTransform={"capitalize"}
                    noOfLines={1}
                >
                    {title}
                </Text>
            </Flex>
        </Flex>
    );
};

export default DashCard;
