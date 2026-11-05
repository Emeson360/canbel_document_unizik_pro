import {
    Box,
    useDisclosure,
    useOutsideClick,
    Icon,
    Button,
    FormLabel,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { DocumentSearchOnList } from "./DocumentSearchOnList";
import { MenuItemsObj } from "./CustomMenu";
import { FaChevronDown } from "react-icons/fa6";
import { useColorModeValue } from "@chakra-ui/react";

export type InputProps = {
    value: string;
    onChange: (inputValue: string) => void;
    label?: string;
    placeholder?: string;
    mini?: boolean;
    btnVariant?: string;
    items: MenuItemsObj[];
    mb?: string | number;
    w?: string | number;
    textAlign?: "left" | "center" | "right";
};

export const DocumentMenu = ({
    onChange,
    value,
    label,
    items,
    mini = false,
    placeholder = "Select option",
    btnVariant = "solid",
    textAlign = "center",
    mb,
    w,
}: InputProps) => {
    const ref = useRef(null);
    const [inputValue, setInputValue] = useState<undefined | string>();
    const { isOpen, onToggle, onClose } = useDisclosure();

    useOutsideClick({
        ref: ref,
        handler: () => onClose(),
    });

    useEffect(() => {
        let selected: MenuItemsObj[];
        selected = items.filter((val) => val?.value === value);
        if (!selected.length) {
            selected = items.filter((val) => val.label === value);
        }

        setInputValue(selected[0]?.label);
    }, [items, value]);

    const onInputValueChange = (item: MenuItemsObj) => {
        // setCurrency(item?.value || "");
        onChange(item?.value || "");
        onClose();
    };
    const Bg = useColorModeValue("#F7F7F8", "#2D3748");

    return (
        <>
            {label ? (
                <FormLabel fontWeight={500} color={"#48494D"}>
                    {label}
                </FormLabel>
            ) : (
                ""
            )}
            <Box as="section" ref={ref} position="relative">
                {mini ? (
                    <Button
                        variant={btnVariant}
                        rightIcon={<FaChevronDown />}
                        size={"sm"}
                        overflow={"hidden"}
                        fontWeight={400}
                        textAlign={textAlign}
                        justifyContent={"space-between"}
                        width={w || "unset"}
                        onClick={onToggle}
                        textTransform={"capitalize"}
                    >
                        {inputValue || placeholder}
                    </Button>
                ) : (
                    <Button
                        width={"100%"}
                        textAlign={textAlign || "left"}
                        bg={Bg}
                        mb={mb}
                        height={"48px"}
                        justifyContent={"space-between"}
                        overflow={"hidden"}
                        rightIcon={
                            <Icon
                                as={TiArrowSortedDown}
                                color={"root.primary"}
                                fontSize={"24px"}
                            />
                        }
                        fontWeight={400}
                        onClick={onToggle}
                        textTransform={"capitalize"}
                    >
                        {inputValue || placeholder}
                    </Button>
                )}

                {isOpen ? (
                    <DocumentSearchOnList
                        data={items || []}
                        onChange={onInputValueChange}
                    />
                ) : null}
            </Box>
        </>
    );
};
