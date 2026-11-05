import { Icon, Spinner, Text } from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
import { BsFileEarmarkTextFill } from "react-icons/bs";

const UploadBoxContent = ({
    isProcessing,
    fileLength,
}: {
    isProcessing: boolean;
    fileLength: number;
}) => {
    if (isProcessing) {
        return (
            <>
                <Spinner color={"brand.primary"} size={"xl"} />
                <Text fontSize={["18px", "20px"]} textAlign="center" mt={5}>
                    Processing file(s)
                </Text>
            </>
        );
    }

    return (
        <>
            {fileLength ? (
                <>
                    <Icon
                        as={BsFileEarmarkTextFill}
                        fontSize={["30px", "50px"]}
                        color={"root.primary"}
                    />
                    <Text
                        fontSize={["18px", "20px"]}
                        textAlign="center"
                        mt={3}
                        color={"root.black"}
                    >
                        {`${fileLength} file(s) to upload`}
                    </Text>
                </>
            ) : (
                <>
                    <Icon
                        as={FiUploadCloud}
                        fontSize={["30px", "50px"]}
                        //   color={"root.textMuted"}
                    />
                    <Text
                        fontSize={["18px", "20px"]}
                        textAlign="center"
                        mt={3}
                        //   color={"root.textMuted"}
                    >
                        Drag & drop or click to choose files
                    </Text>
                </>
            )}
        </>
    );
};

export default UploadBoxContent;
