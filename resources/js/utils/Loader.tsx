import React from "react";
import { Spinner } from "@chakra-ui/react";

const Loader = ({
    isLoading,
    height = "100vh",
}: {
    isLoading: boolean;
    height?: string;
}) => {
    return isLoading ? (
        <div
            style={{
                width: "100%",
                marginTop: "40px",
                display: "flex",
                height,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Spinner color={"#9F31D6"} />
        </div>
    ) : (
        <></>
    );
};

export default Loader;
