import { createStandaloneToast } from "@chakra-ui/react";
const { toast } = createStandaloneToast();

export const showSuccess = (msg: string, autoClose: number = 5000) => {
    toast({
        position: "top-right",
        title: msg,
        status: "success",
        duration: autoClose,
        isClosable: true,
    });
};

export const showError = (msg: string) => {
    toast({
        position: "top-right",
        title: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
    });
};

export const showWarning = (msg: string) => {
    toast({
        position: "top-right",
        title: msg,
        status: "warning",
        duration: 5000,
        isClosable: true,
    });
};

export const showInfo = (msg: string) => {
    toast({
        position: "top",
        title: msg,
        status: "info",
        duration: 5000,
        isClosable: true,
    });
};
