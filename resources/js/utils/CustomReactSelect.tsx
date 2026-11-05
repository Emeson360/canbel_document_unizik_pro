import Select from "react-select";
// import makeAnimated from "react-select/animated";
import { MenuItemsObj } from "./CustomMenu";
import { Box, Text } from "@chakra-ui/react";

interface ReactSelectProps {
    label?: string;
    options: MenuItemsObj[];
    isMulti?: boolean;
    isDisabled?: boolean;
    value: MenuItemsObj[];
    onChange: (option: MenuItemsObj[]) => void;
}

const CustomReactSelect = ({
    options,
    isMulti = false,
    value,
    label,
    isDisabled,
    onChange,
}: ReactSelectProps) => {
    // const animatedComponents = makeAnimated();

    return (
        <Box>
            {label ? (
                <Text fontWeight={500} color={"#48494D"} mb={2}>
                    {label}
                </Text>
            ) : (
                ""
            )}
            <Select
                closeMenuOnSelect={false}
                // components={animatedComponents}
                value={value}
                isMulti={isMulti}
                options={options}
                // @ts-ignore
                onChange={onChange}
                isDisabled={isDisabled}
            />
        </Box>
    );
};

export default CustomReactSelect;
