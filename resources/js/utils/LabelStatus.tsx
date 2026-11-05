import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { GoDotFill } from "react-icons/go";

const LabelStatus = ({ status }: { status: string }) => {
    let bg = "#FFF2DD";
    let color = "#D98634";

    switch (status?.toLowerCase()) {
        case "success":
            bg = "#E9FFEF";
            color = "#409261";
            break;

        case "fulfilled":
            bg = "#CBEFDB";
            color = "#2F855A";
            break;

        case "active":
            bg = "#E9FFEF";
            color = "#409261";
            break;

        case "approved":
            bg = "#E9FFEF";
            color = "#409261";
            break;

        case "in-progress":
            bg = "#BCEAFB";
            color = "#124051";
            break;

        case "free":
            bg = "#BCEAFB";
            color = "#124051";
            break;

        case "on hold":
            bg = "#BCEAFB";
            color = "#124051";
            break;

        case "cancelled":
            bg = "#EEAAAA";
            color = "#CE0100";
            break;

        case "canceled":
            bg = "#EEAAAA";
            color = "#CE0100";
            break;

        case "refused":
            bg = "#EEAAAA";
            color = "#CE0100";
            break;

        case "low-stock":
            bg = "#EEAAAA";
            color = "#CE0100";
            break;
    }

    return (
        <Flex
            gap={1}
            align={"center"}
            justify={"center"}
            bg={bg}
            color={color}
            py={"2px"}
            px={2}
            rounded={"full"}
            fontSize={"12px"}
            width={"max-content"}
        >
            <Icon as={GoDotFill} fontSize={"10px"} color={color} />
            <Text textTransform={"capitalize"}>{status}</Text>
        </Flex>
    );
};

export default LabelStatus;
