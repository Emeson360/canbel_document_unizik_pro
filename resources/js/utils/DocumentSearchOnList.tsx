import { useState } from "react";
import { Box, Input, List, ListItem, Text } from "@chakra-ui/react";
import { MenuItemsObj } from "./CustomMenu";

export type Props = {
    data: MenuItemsObj[];
    onChange: (args: MenuItemsObj) => void;
};

export const DocumentSearchOnList = ({ data, onChange }: Props) => {
    const [filteredList, setFilteredList] = useState(data);
    const [selectedItem, setSelectedItem] = useState<MenuItemsObj | undefined>(
        undefined
    );

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        const result =
            data?.filter((item: MenuItemsObj) => {
                return item.label.toLowerCase().includes(value);
            }) || [];
        setFilteredList(result);
    };

    return (
        <Box
            my={1}
            maxH="xs"
            bg="#292A2D"
            width="210px"
            zIndex={999}
            height="auto"
            overflow="auto"
            borderRadius="lg"
            position="absolute"
            boxShadow="0px 1px 30px rgba(0, 0, 0, 0.1)"
        >
            <Box position="sticky" top="0" padding={4} bg={"#292A2D"}>
                <Input
                    size="sm"
                    type="search"
                    borderRadius="md"
                    color={"#f0f0f0"}
                    autoComplete="off"
                    placeholder="Search..."
                    onChange={(event) => handleSearch(event)}
                    _focusWithin={{ borderColor: "secondary" }}
                    _invalid={{ bg: "white", borderColor: "gray.50" }}
                />
            </Box>

            <List>
                {filteredList?.map((item: MenuItemsObj, index: number) => (
                    <ListItem
                        key={index}
                        paddingY={2}
                        pl={4}
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
                            item?.value === selectedItem?.value
                                ? {
                                      backgroundColor: "#00132A",
                                      color: "#396070",
                                  }
                                : {}
                        }
                    >
                        <Text as="span" ml={4}>
                            {item?.label}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
