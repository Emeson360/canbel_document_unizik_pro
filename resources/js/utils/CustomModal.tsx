import React, { ReactNode } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    size?: string | string[];
    noCloseBtn?: boolean;
    scrollBehaviour?: "inside" | "outside";
    children: ReactNode;
}

const CustomModal = ({
    isOpen,
    onClose,
    title,
    size = ["xs", "md"],
    scrollBehaviour = "outside",
    children,
}: ModalProps) => {
    const Bg = useColorModeValue("#fff", "gray.800"); // White in light mode, gray.800 in dark mode
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => onClose?.()}
                size={size}
                scrollBehavior={scrollBehaviour}
                isCentered
            >
                <ModalOverlay />
                <ModalContent rounded={"12px"} bg={Bg}>
                    {title ? <ModalHeader>{title}</ModalHeader> : ""}
                    {onClose ? <ModalCloseButton className="no-print" /> : ""}
                    <ModalBody px={[4, 6]}>{children}</ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CustomModal;
