import React from "react";
import {
    Box,
    useDisclosure,
    useOutsideClick,
    Icon,
    Button,
    FormLabel,
    Text,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import Flag from "react-world-flags";
// import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import CurrencyList from "./currency-list.json";
import { CurrencySearchOnList } from "./CurrencySearchOnList";

export type PhoneNumberInputProps = {
    value: string;
    onChange: (currency: string) => void;
    label?: string;
    color?: string;
};

type CurrencyType = {
    name: string;
    code: string;
};

export const CurrencyInput = ({
    onChange,
    value,
    label,
    color = "root.white",
}: PhoneNumberInputProps) => {
    const ref = useRef(null);
    const [currency, setCurrency] = useState<string | undefined>();
    const [countryFlag, setCountryFlag] = useState<string | undefined>();
    const { isOpen, onToggle, onClose } = useDisclosure();

    useOutsideClick({
        ref: ref,
        handler: () => onClose(),
    });

    useEffect(() => {
        if (value) {
            const valuesCurrency = CurrencyList?.find((item) =>
                value ? value === item.code : false
            ) || { code: "USD" };
            const currencyCheck =
                valuesCurrency?.code === "CFX" ? "XAF" : valuesCurrency?.code;
            setCurrency(currencyCheck);
            setCountryFlag(valuesCurrency?.code?.slice(0, -1) || "US");
        }
    }, [value]);

    const onCountryChange = (item: CurrencyType) => {
        const currencyCheck = item.code === "CFX" ? "XAF" : item.code;

        setCurrency(currencyCheck);
        setCountryFlag(item?.code?.slice(0, -1));
        onChange(currencyCheck);
        onClose();
    };

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
                <Button
                    rightIcon={
                        isOpen ? (
                            <Icon as={IoIosArrowUp} color="root.white" />
                        ) : (
                            <Icon as={IoIosArrowDown} color="root.white" />
                        )
                    }
                    height={"35px"}
                    color={color}
                    onClick={onToggle}
                    variant={"outline"}
                    px={"8px"}
                    py={0}
                    fontSize={"14px"}
                    fontWeight={400}
                    borderColor={"root.white"}
                    rounded={"4px"}
                    _hover={{ bg: "transparent" }}
                >
                    <Flag
                        code={countryFlag}
                        width={"24px"}
                        height={"24px"}
                        style={{ flexShrink: 0, marginRight: "2px" }}
                    />
                    <Text as={"span"} ml={1}>
                        {currency || "Select currency"}
                    </Text>
                </Button>

                {isOpen ? (
                    <CurrencySearchOnList
                        data={CurrencyList}
                        onChange={onCountryChange}
                    />
                ) : null}
            </Box>
        </>
    );
};
