import {
    extendTheme,
    ThemeConfig,
    // theme as base
} from "@chakra-ui/react";
// @ts-ignore
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";
import "@fontsource-variable/red-hat-text";

const styles = {
    global: (props: StyleFunctionProps) => ({
        body: {
            color: mode("root.black", "root.white")(props),
            bg: mode("#FAFAFB", "root.black")(props),
        },
    }),
};

const components = {
    Drawer: {
        // setup light/dark mode component defaults
        baseStyle: (props: Dict<any> | StyleFunctionProps) => ({
            dialog: {
                bg: mode("white", "#141214")(props),
            },
        }),
    },
    Textarea: {
        baseStyle: {
            bg: "#F7F7F8",
        },
    },
    Button: {
        variants: {
            primary: {
                bg: "root.primary",
                color: "root.white",
                _hover: {
                    bg: "root.primaryDark",
                },
                _disabled: {
                    _hover: {
                        bg: "#ce0100 !important",
                    },
                },
            },
            black: {
                bg: "root.secondary",
                color: "root.white",
                // borderRadius: "24px",
                _disabled: {
                    _hover: {
                        bg: "root.secondary !important",
                    },
                },
            },
            light: {
                bg: "#F8F8F8",
                color: "root.black",
                _hover: {
                    bg: "#EBEBEB",
                },
            },
            outline: {
                border: "1px solid",
                borderColor: "root.black",
            },
            outlineDashed: {
                border: "2px dashed",
                borderColor: "root.black",
                borderRadius: "24px",
            },
            success: {
                bg: "root.success",
                borderRadius: "8px",
                color: "root.white",
                _hover: {
                    bg: "root.successDark",
                },
                _disabled: {
                    _hover: {
                        bg: "root.success !important",
                    },
                },
            },
            warning: {
                bg: "root.warning",
                borderRadius: "8px",
                color: "root.white",
                _hover: {
                    bg: "root.warningDark",
                },
            },
            danger: {
                bg: "root.danger",
                color: "root.white",
                _hover: {
                    bg: "root.dangerDark",
                },
                _disabled: {
                    _hover: {
                        bg: "root.danger !important",
                    },
                },
            },
        },
    },
};

// 2. Add your color mode config
const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    styles,
    components,
    colors: {
        root: {
            primary: "#CE0100",
            primaryTint: "#DE5555",
            primaryDark: "#890000",
            secondary: "#160000",
            // secondaryTint: "#FFF7CC",
            lightGrey: "#E8E8E8",
            lighterGrey: "#F3F3F3",
            success: "#06C167",
            successTint: "#06c1674d",
            successDark: "#048044",
            danger: "#FC7F79",
            dangerTint: "#ffe1de4d",
            dangerDark: "#DE1135",
            warning: "#FFD600",
            warningDark: "#AA8E00",
            warningTint: "#FFF1AA",
            textMuted: "#868686",
            black: "#191919",
            white: "#FFFFFF",
        },
    },
    fonts: {
        heading: `'Red Hat Text Variable', sans-serif`,
        body: `'Red Hat Text Variable', sans-serif`,
    },
});

export default theme;
