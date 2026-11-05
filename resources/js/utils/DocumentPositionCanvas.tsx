import { ReactNode } from "react";
import { Box, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { DocumentPositionFieldKey } from "./types";
import { capitalizeText } from "./helpers";
import LobsterTwoBold from "../assets/fonts/Lobster_Two/LobsterTwo-Bold.ttf";

interface DocumentPositionCanvasProps {
    fields: {
        key: DocumentPositionFieldKey;
        x: number;
        y: number;
        value: ReactNode;
    }[];
    scale?: number;
    // Admin-only visual reference overlay (e.g. the physical paper template)
    // to help line up field positions. Never shown when printing.
    backgroundImageSrc?: string;
}

// A4 portrait, in millimeters — matches the physical paper stock these fields print onto.
const CANVAS_WIDTH_MM = 210;
const CANVAS_HEIGHT_MM = 297;

// Standard passport photo proportions — the photo box is fixed-size, only its
// position (x/y) is configurable.
const PASSPORT_PHOTO_WIDTH_MM = 30;
const PASSPORT_PHOTO_HEIGHT_MM = 35;

const DocumentPositionCanvas = ({
    fields,
    scale = 1,
    backgroundImageSrc,
}: DocumentPositionCanvasProps) => {
    const canvasBg = useColorModeValue("gray.300", "gray.500");

    const canvas = (
        <Box
            shadow={
                "14px 27px 45px 4px #B0B5B90D, -14px -25px 45px 4px #B0B5B90D"
            }
            background={canvasBg}
            width={`${CANVAS_WIDTH_MM}mm`}
            minHeight={`${CANVAS_HEIGHT_MM}mm`}
            position={"relative"}
            overflow={"hidden"}
            transform={scale !== 1 ? `scale(${scale})` : undefined}
            transformOrigin={"top left"}
            color={"blackAlpha.900"}
            sx={{ "@media print": { background: "white" } }}
        >
            <Global
                styles={`
                    @font-face {
                        font-family: "Lobster Two";
                        src: url(${LobsterTwoBold}) format("truetype");
                        font-weight: 700;
                        font-style: normal;
                    }
                `}
            />
            {backgroundImageSrc ? (
                <Image
                    src={backgroundImageSrc}
                    alt="Document template reference"
                    position={"absolute"}
                    top={0}
                    left={0}
                    width={"100%"}
                    height={"100%"}
                    objectFit={"cover"}
                    zIndex={0}
                    pointerEvents={"none"}
                    sx={{ "@media print": { display: "none" } }}
                />
            ) : null}
            {fields.map((field) => {
                if (field.key === "passport_photo") {
                    const photoSrc =
                        typeof field.value === "string" && field.value
                            ? field.value
                            : undefined;

                    return (
                        <Box
                            key={field.key}
                            position={"absolute"}
                            left={`${field.x}mm`}
                            top={`${field.y}mm`}
                            width={`${PASSPORT_PHOTO_WIDTH_MM}mm`}
                            height={`${PASSPORT_PHOTO_HEIGHT_MM}mm`}
                            border={"1px solid #999"}
                            bg={"gray.100"}
                            overflow={"hidden"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            zIndex={1}
                        >
                            {photoSrc ? (
                                <Image
                                    src={photoSrc}
                                    alt="Passport photograph"
                                    width={"100%"}
                                    height={"100%"}
                                    objectFit={"cover"}
                                />
                            ) : (
                                <Text fontSize={"10px"} color={"gray.500"}>
                                    Photo
                                </Text>
                            )}
                        </Box>
                    );
                }

                if (
                    field.key === "holders_name" ||
                    field.key === "department_name"
                ) {
                    return (
                        <Text
                            key={field.key}
                            position={"absolute"}
                            left={`${field.x}mm`}
                            top={`${field.y}mm`}
                            fontSize={"24px"}
                            fontWeight={600}
                            fontFamily={'"Lobster Two", cursive'}
                            zIndex={1}
                        >
                            {capitalizeText(String(field.value)) ?? "--"}
                        </Text>
                    );
                }

                if (field.key === "discipline") {
                    return (
                        <Text
                            key={field.key}
                            position={"absolute"}
                            left={`${field.x}mm`}
                            top={`${field.y}mm`}
                            fontSize={"20px"}
                            fontWeight={600}
                            fontFamily={'"Lobster Two", cursive'}
                            zIndex={1}
                        >
                            {capitalizeText(String(field.value)) ?? "--"}
                        </Text>
                    );
                }

                if (field.key === "nin" || field.key === "dob") {
                    const placeholder = field.key === "nin" ? "NIN: " : "DOB: ";
                    return (
                        <Text
                            key={field.key}
                            position={"absolute"}
                            left={`${field.x}mm`}
                            top={`${field.y}mm`}
                            fontSize={"16px"}
                            fontWeight={600}
                            zIndex={1}
                        >
                            {field.value ? placeholder + field.value : "--"}
                        </Text>
                    );
                }

                if (field.key === "registration_number") {
                    return (
                        <Text
                            key={field.key}
                            position={"absolute"}
                            left={`${field.x}mm`}
                            top={`${field.y}mm`}
                            fontSize={"16px"}
                            fontWeight={600}
                            zIndex={1}
                        >
                            {field.value ?? "--"}
                        </Text>
                    );
                }

                if (field.key === "cgpa_class") {
                    return (
                        <Text
                            key={field.key}
                            position={"absolute"}
                            left={`${field.x}mm`}
                            top={`${field.y}mm`}
                            fontSize={"24px"}
                            fontWeight={600}
                            fontFamily={'"Lobster Two", cursive'}
                            zIndex={1}
                        >
                            {field.value ?? "--"}
                        </Text>
                    );
                }

                return (
                    <Text
                        key={field.key}
                        position={"absolute"}
                        left={`${field.x}mm`}
                        top={`${field.y}mm`}
                        fontSize={"24px"}
                        fontWeight={600}
                        zIndex={1}
                    >
                        {field.value ?? "--"}
                    </Text>
                );
            })}
        </Box>
    );

    if (scale === 1) {
        return canvas;
    }

    return (
        <Box
            width={`${CANVAS_WIDTH_MM * scale}mm`}
            height={`${CANVAS_HEIGHT_MM * scale}mm`}
            overflow={"hidden"}
        >
            {canvas}
        </Box>
    );
};

export default DocumentPositionCanvas;
