import {
    FormControl,
    FormLabel,
    Input,
    FormControlProps,
    Icon,
    InputGroup,
    InputRightElement,
    useColorModeValue,
} from "@chakra-ui/react";
import { PiCalendarDotsFill } from "react-icons/pi";
import DatePicker from "react-datepicker";
import { useRef } from "react";

interface CustomInputProps extends FormControlProps {
    label?: string;
    type?: string;
    value: Date | null;
    placeholder?: string;
    readOnly?: boolean;
    greyInput?: boolean;
    onChange: (e: any) => void;
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    startToday?: boolean;
    portalId?: undefined | string;
}

const CustomDatePicker = ({
    label,
    value,
    onChange,
    placeholder = "",
    readOnly = false,
    greyInput,
    showTimeSelect = false,
    showTimeSelectOnly = false,
    startToday = false,
    portalId,
    ...rest
}: CustomInputProps) => {
    const inputRef: { current: any } | null = useRef(null);

    const clickInput = () => {
        if (inputRef.current && inputRef.current.setFocus) {
            inputRef.current.setFocus();
        }
    };
    const labelColor = useColorModeValue("#48494D", "white");
    const readOnlyBg = useColorModeValue("gray.300", "gray.600");
    const normalBg = useColorModeValue("#F7F7F8", "gray.700");

    const backgroundColor = !greyInput
        ? "transparent"
        : readOnly
        ? readOnlyBg
        : normalBg;

    return (
        <FormControl {...rest}>
            {label ? (
                <FormLabel fontWeight={500} color={labelColor}>
                    {label}
                </FormLabel>
            ) : (
                ""
            )}
            <InputGroup
                rounded={"8px"}
                px={"16px"}
                height={"48px"}
                bg={backgroundColor}
                alignItems={"center"}
                onClick={clickInput}
            >
                <Input
                    as={DatePicker}
                    px={0}
                    border={"none"}
                    ref={inputRef}
                    selected={value}
                    minDate={startToday ? new Date() : undefined}
                    onChange={onChange}
                    showTimeSelect={showTimeSelect}
                    showTimeSelectOnly={showTimeSelectOnly}
                    dateFormat={showTimeSelectOnly ? "h:mm aa" : "dd/MM/yyyy"}
                    portalId={portalId || "c_popper"}
                    //   onCalendarOpen={() => dispatch(updateHideFileUpload(true))}
                    //   onCalendarClose={() => dispatch(updateHideFileUpload(false))}
                    readOnly={readOnly}
                    // placeholder={placeholder}
                    placeholderText={placeholder}
                    _focusVisible={{ border: "none" }}
                    autoComplete={"off"}
                />
                <InputRightElement top={1}>
                    <Icon
                        as={PiCalendarDotsFill}
                        color={"root.primary"}
                        fontSize={"22px"}
                    />
                </InputRightElement>
            </InputGroup>
        </FormControl>
    );
};

export default CustomDatePicker;
