import { ReactNode } from "react";
// import { useDisclosure } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import Sidebar from "../dashNav/Sidebar";
import { usePage } from "@inertiajs/react";
import { CustomUsePageProps } from "../../utils/types";
import { showSuccess, showError } from "../../utils/Alert";

const Layout = ({ children }: { children: ReactNode }) => {
    const { flash } = usePage<CustomUsePageProps>().props;
    if (flash?.success) {
        showSuccess(flash.success, 10000);
    }

    if (flash?.error) {
        showError(flash?.error);
        console.log("first error", flash?.error);
    }

    return (
        <>
            <Box>
                <Sidebar>{children}</Sidebar>
            </Box>
        </>
    );
};

export default Layout;
