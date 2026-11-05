import React, { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";

interface CustomLinkProps extends LinkProps {
    href: string;
    children: ReactNode;
    method?: string;
}

const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
    return (
        <ChakraLink as={Link} href={href} {...props}>
            {children}
        </ChakraLink>
    );
};

export default CustomLink;
