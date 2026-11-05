import { useState } from "react";
import {
    Heading,
    Box,
    Flex,
    Button,
    Text,
    IconButton,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    UnorderedList,
    ListItem,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import {
    CustomUsePageProps,
    DocumentPaperInterface,
    DocumentParamsPositionSettingInterface,
    LayoutSettingProfileInterface,
} from "@/utils/types";
import {
    replaceUnderscoreWithSpace,
    returnDocStatusIndex,
} from "@/utils/helpers";
import LabelStatus from "@/utils/LabelStatus";
import DocumentPositionCanvas from "@/utils/DocumentPositionCanvas";
import { DOCUMENT_TEMPLATE_IMAGE_BY_TYPE } from "@/utils/documentTemplateImages";
import { getPreviewCanvasFields } from "@/utils/documentPreviewFields";
import CustomMenu from "@/utils/CustomMenu";
import { Link, usePage } from "@inertiajs/react";
import { InvalidDoc } from "../admin/PreviewDocument";
import { LuArrowLeft, LuPrinter } from "react-icons/lu";

const PRINT_AREA_ID = "document-preview-print-area";
const SCREEN_AREA_ID = "document-preview-screen-area";

interface PageProps {
    document: DocumentPaperInterface | null;
    documentStatuses: string[];
    positionSettings: DocumentParamsPositionSettingInterface[];
    layoutSettingProfiles: LayoutSettingProfileInterface[];
}

const PreviewDocument = ({
    document,
    documentStatuses,
    positionSettings,
    layoutSettingProfiles,
}: PageProps) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const userRole = user?.role;
    const Bg = useColorModeValue("#fff", "gray.800");

    const [selectedProfileId, setSelectedProfileId] = useState(
        () => layoutSettingProfiles[0]?.id.toString() ?? "",
    );

    const profileItemsArr = layoutSettingProfiles.map((profile) => ({
        label: profile.name,
        value: profile.id.toString(),
    }));

    const selectedProfile = layoutSettingProfiles.find(
        (profile) => profile.id.toString() === selectedProfileId,
    );

    const selectedPositionSettings =
        positionSettings.find(
            (setting) =>
                setting.layout_setting_profile_id?.toString() ===
                selectedProfileId,
        ) ?? null;

    const canvasFields = getPreviewCanvasFields(
        document,
        selectedPositionSettings,
    );

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Global
                styles={{
                    "@page": {
                        size: "210mm 297mm",
                        margin: 0,
                    },
                    "@media print": {
                        "body *": {
                            visibility: "hidden",
                        },
                        [`#${SCREEN_AREA_ID}`]: {
                            display: "none",
                        },
                        [`#${PRINT_AREA_ID}, #${PRINT_AREA_ID} *`]: {
                            visibility: "visible",
                        },
                        [`#${PRINT_AREA_ID}`]: {
                            display: "block",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            margin: 0,
                            padding: 0,
                        },
                    },
                }}
            />
            {document ? (
                <Box id={PRINT_AREA_ID} display={"none"}>
                    <DocumentPositionCanvas scale={1} fields={canvasFields} />
                </Box>
            ) : null}
            <Box
                id={SCREEN_AREA_ID}
                mt={[3, 0]}
                rounded={"12px"}
                minH={"300px"}
                bg={Bg}
                px={"40px"}
                py={"40px"}
            >
                <Flex mb={"32px"} align={"center"} justify={"space-between"}>
                    <Flex gap={2} align={"center"}>
                        <IconButton
                            aria-label="Go back"
                            icon={<LuArrowLeft />}
                            size={"sm"}
                            variant={"outline"}
                            borderRadius={"50%"}
                            onClick={() => window.history.back()}
                        />
                        <Heading as={"h3"} fontSize={"24px"} fontWeight={700}>
                            Preview Document
                        </Heading>
                        <LabelStatus
                            status={
                                document?.status !== undefined &&
                                document?.status !== null
                                    ? replaceUnderscoreWithSpace(
                                          documentStatuses[document.status],
                                      )
                                    : "--"
                            }
                        />
                    </Flex>
                    {document ? (
                        <Flex gap={2} align={"center"}>
                            <Text fontWeight={500}>Layout Profile</Text>
                            <CustomMenu
                                mini
                                value={selectedProfileId}
                                items={profileItemsArr}
                                setValue={(val: string) =>
                                    setSelectedProfileId(val)
                                }
                            />
                        </Flex>
                    ) : null}
                </Flex>
                {!document ? (
                    <InvalidDoc />
                ) : (
                    <Box overflowX={"auto"}>
                        {document?.status ===
                        returnDocStatusIndex("approved") ? (
                            <Alert
                                status="info"
                                borderRadius={"8px"}
                                mb={"20px"}
                                alignItems={"flex-start"}
                            >
                                <AlertIcon />
                                <Box>
                                    <AlertTitle fontSize={"14px"}>
                                        Before printing
                                    </AlertTitle>
                                    <AlertDescription fontSize={"14px"}>
                                        <UnorderedList>
                                            <ListItem>
                                                Set paper size to A4
                                            </ListItem>
                                            <ListItem>
                                                Set margins to "None"
                                            </ListItem>
                                            <ListItem>
                                                Untick "Scale to fit" / "Fit to
                                                page" — set scale to 100%
                                            </ListItem>
                                            <ListItem>
                                                Turn off "Headers and footers"
                                            </ListItem>
                                        </UnorderedList>
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        ) : null}
                        <Box mx={"auto"} width={"fit-content"}>
                            <DocumentPositionCanvas
                                backgroundImageSrc={
                                    document.type &&
                                    selectedProfile?.show_document_template
                                        ? DOCUMENT_TEMPLATE_IMAGE_BY_TYPE[
                                              document.type
                                          ]
                                        : undefined
                                }
                                fields={canvasFields}
                            />
                        </Box>
                        {document?.status ===
                        returnDocStatusIndex("refused") ? (
                            <Box
                                background={"gray.400"}
                                padding={"15px"}
                                borderRadius={"10px"}
                                mt={5}
                            >
                                <Text fontWeight={500} fontSize={"18px"}>
                                    Refusal comment:
                                </Text>
                                <Text>
                                    {document?.refusal_comment || "No comment"}
                                </Text>

                                <Text fontWeight={500} fontSize={"18px"} mt={5}>
                                    Refusal by:
                                </Text>
                                {document?.approver ? (
                                    <Text textTransform={"capitalize"}>
                                        {document?.approver?.name}
                                    </Text>
                                ) : (
                                    "--"
                                )}
                            </Box>
                        ) : (
                            ""
                        )}
                        {document?.status ===
                        returnDocStatusIndex("refused") ? (
                            <Button
                                width={"full"}
                                variant={"outline"}
                                mt={10}
                                as={Link}
                                href={`/${userRole}/documents/update/${document?.id}`}
                            >
                                Edit Document
                            </Button>
                        ) : (
                            <Button
                                width={"full"}
                                variant={"black"}
                                mt={10}
                                rightIcon={<LuPrinter />}
                                onClick={handlePrint}
                                disabled={
                                    document?.status !==
                                    returnDocStatusIndex("approved")
                                }
                            >
                                Print
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </>
    );
};

export default PreviewDocument;
