import {
    FormControl,
    FormLabel,
    FormControlProps,
    Textarea,
} from "@chakra-ui/react";

interface CustomTextAreaProps extends FormControlProps {
    label?: string;
    type?: string;
    value: string;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    greyInput?: boolean;
    onChange: (e: any) => void;
}

const CustomTextArea = ({
    label,
    type = "text",
    value,
    name,
    onChange,
    placeholder = "",
    readOnly = false,
    greyInput,
    ...rest
}: CustomTextAreaProps) => {
    return (
        <FormControl {...rest}>
            {label ? (
                <FormLabel fontWeight={500} color={"#48494D"}>
                    {label}
                </FormLabel>
            ) : (
                ""
            )}
            <Textarea
                rounded={"8px"}
                border={greyInput ? "none" : "1px"}
                borderColor={"#D3D4DA"}
                bg={greyInput ? "#F7F7F8" : "transparent"}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                minH={"150px"}
            />
        </FormControl>
    );
};

export default CustomTextArea;
