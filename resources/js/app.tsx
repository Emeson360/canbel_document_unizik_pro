import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/dashboard/Layout";
import { UserRoleEnum } from "./utils/types";
import "react-datepicker/dist/react-datepicker.css";

interface PageModule {
    default: React.ComponentType & {
        layout?: (page: React.ReactNode) => JSX.Element;
    };
}

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob<PageModule>("./Pages/**/*.tsx", {
            eager: true,
        });
        // console.log("Available pages:", Object.keys(pages));
        // console.log("Requested page:", `./Pages/${name}.tsx`);

        let page = pages[`./Pages/${name}.tsx`];

        // Check if page exists
        if (!page) {
            throw new Error(`Page not found: ./Pages/${name}.tsx`);
        }

        page.default.layout =
            name.startsWith(`dashboard/${UserRoleEnum.ADMIN}/`) ||
            name.startsWith(`dashboard/${UserRoleEnum.REGISTRAR}/`) ||
            name.startsWith(`dashboard/${UserRoleEnum.SUPERVISOR}/`)
                ? (page) => <Layout children={page} />
                : undefined;
        // if (name.startsWith("admin/")) {
        //     page.default.layout = (page: React.ReactNode) => (
        //         <Layout children={page} />
        //     );
        // } else {
        //     page.default.layout = undefined;
        // }
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ChakraProvider theme={theme}>
                <App {...props} />
            </ChakraProvider>
        );
    },
});
