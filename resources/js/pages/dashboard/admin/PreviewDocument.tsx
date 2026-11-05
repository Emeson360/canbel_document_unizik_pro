import { useState } from "react";
import { Heading, Box, Flex, Text, Icon, IconButton } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import {
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
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { LuArrowLeft } from "react-icons/lu";

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

    return (
        <>
            <Box
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
                            <Text fontWeight={500}>Layout Profile:</Text>
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
                                fields={getPreviewCanvasFields(
                                    document,
                                    selectedPositionSettings,
                                )}
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
                    </Box>
                )}
            </Box>
        </>
    );
};

export function InvalidDoc() {
    return (
        <>
            <Flex
                justify={"center"}
                align={"center"}
                minHeight={"400px"}
                flexDir={"column"}
                gap={4}
            >
                <Icon
                    as={BsFillExclamationTriangleFill}
                    fontSize={"70px"}
                    color={"gray.400"}
                />
                <Text
                    color={"gray.600"}
                    fontWeight={500}
                    fontSize={"18px"}
                    textAlign={"center"}
                >
                    <i>Invalid Document</i>
                </Text>
            </Flex>
        </>
    );
}

export default PreviewDocument;
