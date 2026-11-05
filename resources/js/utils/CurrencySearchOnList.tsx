import React, { useState } from "react";
import { Box, List, ListItem, Text } from "@chakra-ui/react";
import Flag from "react-world-flags";

type CurrencyType = {
    name: string;
    code: string;
};

export type Props = {
    data: CurrencyType[];
    onChange: (args: CurrencyType) => void;
};

export const CurrencySearchOnList = ({ data, onChange }: Props) => {
    const [filteredList] = useState(data);
    const [selectedItem, setSelectedItem] = useState<CurrencyType | undefined>(
        undefined
    );

    return (
        <Box
            my={1}
            maxH="xs"
            bg="#292A2D"
            width="full"
            zIndex={999}
            height="auto"
            overflow="auto"
            borderRadius="lg"
            position="absolute"
            boxShadow="0px 1px 30px rgba(0, 0, 0, 0.1)"
        >
            <List>
                {filteredList?.map((item, index) => (
                    <ListItem
                        key={index}
                        paddingY={2}
                        pl={2}
                        display={"flex"}
                        alignItems={"center"}
                        color="#ACB9C4"
                        cursor="pointer"
                        fontWeight="500"
                        textTransform="capitalize"
                        onClick={() => {
                            onChange(item);
                            setSelectedItem(item);
                        }}
                        style={{ transition: "all .125s ease" }}
                        _hover={{ bg: "#00132A" }}
                        sx={
                            item?.code === selectedItem?.code
                                ? {
                                      backgroundColor: "#00132A",
                                      color: "#396070",
                                  }
                                : {}
                        }
                    >
                        <Flag
                            code={item?.code?.slice(0, -1)}
                            width={"22px"}
                            height={"22px"}
                            style={{ flexShrink: 0, display: "inline-block" }}
                        />
                        <Text as="span" ml={4} fontSize={"14px"}>
                            {item?.name}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
