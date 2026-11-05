import { useState } from "react";
import {
    Heading,
    Box,
    Flex,
    Button,
    Text,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
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
import CustomModal from "@/utils/CustomModal";
import CustomTextArea from "@/utils/CustomTextArea";
import FormSideEffects from "@/utils/FormSideEffects";
import { router, usePage } from "@inertiajs/react";
import CustomPrompt from "@/utils/CustomPrompt";
import { InvalidDoc } from "../admin/PreviewDocument";
import { LuArrowLeft } from "react-icons/lu";

interface PageProps {
    document: DocumentPaperInterface | null;
    documentStatuses: string[];
    positionSettings: DocumentParamsPositionSettingInterface[];
    layoutSettingProfiles: LayoutSettingProfileInterface[];
    errors: any;
}

const PreviewDocument = ({
    document,
    documentStatuses,
    positionSettings,
    layoutSettingProfiles,
    errors,
}: PageProps) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const userRole = user?.role;
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const Bg = useColorModeValue("#fff", "gray.800");
    const [formState, setFormState] = useState({
        refusal_comment: "",
    });

    const defaultProfile =
        layoutSettingProfiles.find((profile) => profile.is_default) ??
        layoutSettingProfiles[0];

    const selectedPositionSettings =
        positionSettings.find(
            (setting) =>
                setting.layout_setting_profile_id === defaultProfile?.id,
        ) ?? null;

    const {
        isOpen: isRefusalModalOpen,
        onOpen: onRefusalModalOpen,
        onClose: onRefusalModalClose,
    } = useDisclosure();
    const {
        isOpen: isApprovePromptOpen,
        onOpen: onApprovePromptOpen,
        onClose: onApprovePromptClose,
    } = useDisclosure();

    const refuseDocument = () => {
        setIsFormSubmitting(true);
        router.post(`/${userRole}/documents/approve-refuse/${document?.id}`, {
            ...formState,
            isActionApprove: 0,
        });
    };

    const approveDocument = () => {
        setIsFormSubmitting(true);
        router.post(`/${userRole}/documents/approve-refuse/${document?.id}`, {
            ...formState,
            isActionApprove: 1,
        });
    };

    return (
        <>
            <FormSideEffects
                errors={errors}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
            />
            <Box
                mt={[3, 0]}
                rounded={"12px"}
                minH={"300px"}
                bg={Bg}
                px={"40px"}
                py={"40px"}
            >
                <Flex gap={2} mb={"32px"} align={"center"}>
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
                                      documentStatuses[document.status]
                                  )
                                : "--"
                        }
                    />
                </Flex>
                {!document ? (
                    <InvalidDoc />
                ) : (
                    <Box overflowX={"auto"}>
                        <Box mx={"auto"} width={"fit-content"}>
                            <DocumentPositionCanvas
                                backgroundImageSrc={
                                    document.type &&
                                    defaultProfile?.show_document_template
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
                                        {document?.approver?.id === user?.id
                                            ? "Me"
                                            : document?.approver?.name}
                                    </Text>
                                ) : (
                                    "--"
                                )}
                            </Box>
                        ) : (
                            ""
                        )}
                        <Flex
                            flexDir={{ base: "column", md: "row" }}
                            gap={5}
                            display={
                                document?.status !==
                                returnDocStatusIndex("awaitingApproval")
                                    ? "none"
                                    : "flex"
                            }
                        >
                            <Button
                                width={{ base: "full", md: "50%" }}
                                variant={"danger"}
                                mt={10}
                                onClick={onRefusalModalOpen}
                            >
                                Refuse
                            </Button>
                            <Button
                                width={{ base: "full", md: "50%" }}
                                variant={"success"}
                                mt={10}
                                onClick={onApprovePromptOpen}
                            >
                                Approve
                            </Button>
                        </Flex>
                    </Box>
                )}
            </Box>

            <CustomPrompt
                isOpen={isApprovePromptOpen}
                onClose={onApprovePromptClose}
                variant="success"
                action={`approve this document`}
                primaryBtnAction={approveDocument}
                isActionLoading={isFormSubmitting}
            />

            {/* refusal modal */}
            <CustomModal
                isOpen={isRefusalModalOpen}
                onClose={onRefusalModalClose}
                title={"Refuse document"}
                size={["xs", "xl"]}
            >
                <Flex direction={"column"} gap={3}>
                    <CustomTextArea
                        label="Comment"
                        placeholder="Any comment?"
                        value={formState.refusal_comment}
                        onChange={({ target }) => {
                            setFormState({
                                ...formState,
                                refusal_comment: target.value,
                            });
                        }}
                    />
                    <Button
                        variant={"black"}
                        width={"full"}
                        mt={5}
                        mb={3}
                        onClick={refuseDocument}
                        isLoading={isFormSubmitting}
                    >
                        Submit
                    </Button>
                </Flex>
            </CustomModal>
        </>
    );
};

export default PreviewDocument;
