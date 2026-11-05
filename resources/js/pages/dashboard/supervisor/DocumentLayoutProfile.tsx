import { Fragment, useEffect, useState } from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CloseButton,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    IconButton,
    ListItem,
    SlideFade,
    Text,
    UnorderedList,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { router, usePage } from "@inertiajs/react";
import { CustomTab } from "@/utils/CustomTab";
import CustomInput from "@/utils/CustomInput";
import FormSideEffects from "@/utils/FormSideEffects";
import DocumentPositionCanvas from "@/utils/DocumentPositionCanvas";
import { replaceUnderscoreWithSpace } from "@/utils/helpers";
import {
    CustomUsePageProps,
    DocumentParamsPositionSettingInterface,
    LayoutSettingProfileInterface,
} from "@/utils/types";
import {
    LuArrowLeft,
    LuPanelRightClose,
    LuPanelRightOpen,
    LuPrinter,
} from "react-icons/lu";
import { DOCUMENT_TEMPLATE_IMAGE_BY_TYPE } from "@/utils/documentTemplateImages";
import {
    SAMPLE_VALUES,
    emptyFormState,
    getVisibleFields,
} from "@/utils/documentLayoutFields";

const PRINT_AREA_ID = "document-layout-print-area";
const SCREEN_AREA_ID = "document-layout-screen-area";
const BEFORE_PRINTING_ALERT_KEY = "document-layout-before-printing-dismissed";

interface PageProps {
    profile: LayoutSettingProfileInterface;
    settings: DocumentParamsPositionSettingInterface[];
    documentTypes: string[];
    errors: any;
}

const DocumentLayoutProfile = ({
    profile,
    settings,
    documentTypes,
    errors,
}: PageProps) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const documentTypeItems = documentTypes.map((value) => ({
        value,
        label: replaceUnderscoreWithSpace(value).toUpperCase(),
    }));
    const [activeType, setActiveType] = useState(documentTypes[0]);
    const visibleFields = getVisibleFields(activeType);
    const [formState, setFormState] = useState<Record<string, number>>(
        emptyFormState(visibleFields),
    );
    const [showForm, setShowForm] = useState(true);
    const [showBeforePrintingAlert, setShowBeforePrintingAlert] = useState(
        () => {
            const stored = sessionStorage.getItem(BEFORE_PRINTING_ALERT_KEY);
            const dismissed = stored ? JSON.parse(stored) : false;
            return !dismissed;
        },
    );
    const Bg = useColorModeValue("#fff", "gray.800");

    const dismissBeforePrintingAlert = () => {
        sessionStorage.setItem(BEFORE_PRINTING_ALERT_KEY, JSON.stringify(true));
        setShowBeforePrintingAlert(false);
    };

    useEffect(() => {
        const setting = settings.find((s) => s.document_type === activeType);
        if (!setting) {
            setFormState(emptyFormState(visibleFields));
            return;
        }

        setFormState(
            visibleFields.reduce(
                (acc, field) => {
                    acc[`${field.key}_x`] = (setting as any)[`${field.key}_x`];
                    acc[`${field.key}_y`] = (setting as any)[`${field.key}_y`];
                    return acc;
                },
                {} as Record<string, number>,
            ),
        );
    }, [activeType, settings]);

    const handleChange = (name: string, value: string) => {
        setFormState((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleSubmit = () => {
        router.patch(`/${user?.role}/document-layout/${profile.id}`, {
            document_type: activeType,
            ...formState,
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const activeTypeLabel = documentTypeItems.find(
        (type) => type.value === activeType,
    )?.label;

    const borderColor = useColorModeValue("#111111", "#ffffff"); // Dark for light mode, light for dark mode
    const border = `1px solid ${borderColor}`;

    return (
        <>
            <FormSideEffects errors={errors} />

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
            <Box id={PRINT_AREA_ID} display={"none"}>
                <DocumentPositionCanvas
                    scale={1}
                    fields={visibleFields.map((field) => ({
                        key: field.key,
                        x: formState[`${field.key}_x`] ?? 0,
                        y: formState[`${field.key}_y`] ?? 0,
                        value: SAMPLE_VALUES[field.key],
                    }))}
                />
            </Box>
            <Box
                id={SCREEN_AREA_ID}
                mt={[3, 0]}
                rounded={"12px"}
                minH={"300px"}
                bg={Bg}
                px={"20px"}
                pb={"45px"}
                pt={"20px"}
            >
                <Flex gap={2} mb={"20px"} align={"center"}>
                    <IconButton
                        aria-label="Go back"
                        icon={<LuArrowLeft />}
                        size={"sm"}
                        variant={"outline"}
                        borderRadius={"50%"}
                        onClick={() =>
                            router.visit(`/${user?.role}/document-layout`)
                        }
                    />
                    <Heading
                        as={"h3"}
                        textTransform={"capitalize"}
                        fontSize={"20px"}
                        fontWeight={700}
                    >
                        {profile.name}
                    </Heading>
                </Flex>

                <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                    align={{ base: "flex-start", md: "center" }}
                    justify="space-between"
                    mb={"20px"}
                >
                    <CustomTab
                        curState={activeType}
                        toggler={setActiveType}
                        tabs={documentTypeItems}
                    />

                    <Button
                        leftIcon={
                            showForm ? (
                                <LuPanelRightClose />
                            ) : (
                                <LuPanelRightOpen />
                            )
                        }
                        size={"sm"}
                        variant={"black"}
                        rounded={"8px"}
                        onClick={() => setShowForm((v) => !v)}
                    >
                        {showForm ? "Hide Form" : "Edit Positions"}
                    </Button>
                </Flex>

                {showBeforePrintingAlert && (
                    <Alert
                        status="info"
                        borderRadius={"8px"}
                        mb={"20px"}
                        alignItems={"flex-start"}
                    >
                        <AlertIcon />
                        <Box flex={"1"}>
                            <AlertTitle fontSize={"14px"}>
                                Before printing
                            </AlertTitle>
                            <AlertDescription fontSize={"14px"}>
                                <UnorderedList>
                                    <ListItem>Set paper size to A4</ListItem>
                                    <ListItem>Set margins to "None"</ListItem>
                                    <ListItem>
                                        Untick "Scale to fit" / "Fit to page" —
                                        set scale to 100%
                                    </ListItem>
                                    <ListItem>
                                        Turn off "Headers and footers"
                                    </ListItem>
                                </UnorderedList>
                            </AlertDescription>
                        </Box>
                        <CloseButton
                            aria-label="Dismiss"
                            size={"sm"}
                            onClick={dismissBeforePrintingAlert}
                        />
                    </Alert>
                )}

                <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={6}
                    align={"stretch"}
                    height={showForm ? "780px" : "unset"}
                    minH={showForm ? "unset" : "780px"}
                >
                    <Card
                        variant={"outline"}
                        flex={"1"}
                        width={"full"}
                        height={"full"}
                        display={"flex"}
                        flexDirection={"column"}
                        overflow={"hidden"}
                        transition={"all 0.3s ease"}
                        border={border}
                        shadow={
                            "14px 27px 45px 4px #B0B5B90D, -14px -25px 45px 4px #B0B5B90D"
                        }
                        rounded={"12px"}
                    >
                        <CardHeader pb={0} flexShrink={0}>
                            <Flex justify={"space-between"} align={"center"}>
                                <Box>
                                    <Text fontWeight={600}>Live Preview</Text>
                                    <Text
                                        color={"gray.500"}
                                        fontSize={"sm"}
                                        mt={1}
                                    >
                                        {activeTypeLabel} (sample data)
                                    </Text>
                                </Box>
                                <IconButton
                                    aria-label="Show/Hide form"
                                    icon={
                                        showForm ? (
                                            <LuPanelRightClose />
                                        ) : (
                                            <LuPanelRightOpen />
                                        )
                                    }
                                    size={"sm"}
                                    variant={"outline"}
                                    onClick={() => setShowForm((v) => !v)}
                                />
                            </Flex>
                        </CardHeader>
                        <CardBody
                            flex={"1"}
                            overflow={"auto"}
                            justifyContent={"center"}
                            display={"flex"}
                        >
                            <Box
                                width={"fit-content"}
                                mx={showForm ? undefined : "auto"}
                            >
                                <DocumentPositionCanvas
                                    scale={showForm ? 0.55 : 1}
                                    backgroundImageSrc={
                                        profile.show_document_template
                                            ? DOCUMENT_TEMPLATE_IMAGE_BY_TYPE[
                                                  activeType
                                              ]
                                            : undefined
                                    }
                                    fields={visibleFields.map((field) => ({
                                        key: field.key,
                                        x: formState[`${field.key}_x`] ?? 0,
                                        y: formState[`${field.key}_y`] ?? 0,
                                        value: SAMPLE_VALUES[field.key],
                                    }))}
                                />
                            </Box>
                        </CardBody>
                        <CardFooter pt={2} flexShrink={0}>
                            <Button
                                variant={"primary"}
                                rightIcon={<LuPrinter />}
                                width={"full"}
                                onClick={handlePrint}
                            >
                                Print sample
                            </Button>
                        </CardFooter>
                    </Card>

                    <SlideFade
                        in={showForm}
                        offsetX={40}
                        offsetY={0}
                        unmountOnExit
                        style={{
                            flex: "1 1 420px",
                            maxWidth: "420px",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Card
                            variant={"outline"}
                            width={"full"}
                            height={"full"}
                            display={"flex"}
                            flexDirection={"column"}
                            overflow={"hidden"}
                            border={border}
                            shadow={
                                "14px 27px 45px 4px #B0B5B90D, -14px -25px 45px 4px #B0B5B90D"
                            }
                            rounded={"12px"}
                        >
                            <CardHeader pb={0} flexShrink={0}>
                                <Text fontWeight={600}>Edit Positions</Text>
                                <Text color={"gray.500"} fontSize={"sm"} mt={1}>
                                    Set the X/Y position (in mm) of each field
                                    on the document paper.
                                </Text>
                            </CardHeader>
                            <CardBody flex={"1"} overflowY={"auto"}>
                                <VStack
                                    spacing={6}
                                    fontSize={"14px"}
                                    align="stretch"
                                >
                                    {visibleFields.map((field, index) => (
                                        <Fragment key={field.key}>
                                            <Grid
                                                templateColumns={"1fr"}
                                                gap={2}
                                            >
                                                <Text fontWeight={600}>
                                                    {field.label}
                                                </Text>
                                                <Grid
                                                    templateColumns={"1fr 1fr"}
                                                    gap={4}
                                                >
                                                    <GridItem>
                                                        <CustomInput
                                                            label="X"
                                                            type="number"
                                                            name={`${field.key}_x`}
                                                            value={
                                                                formState[
                                                                    `${field.key}_x`
                                                                ] ?? 0
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    `${field.key}_x`,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </GridItem>
                                                    <GridItem>
                                                        <CustomInput
                                                            label="Y"
                                                            type="number"
                                                            name={`${field.key}_y`}
                                                            value={
                                                                formState[
                                                                    `${field.key}_y`
                                                                ] ?? 0
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    `${field.key}_y`,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                            {index <
                                                visibleFields.length - 1 && (
                                                <Divider
                                                    borderColor={"gray.400"}
                                                />
                                            )}
                                        </Fragment>
                                    ))}
                                </VStack>
                            </CardBody>
                            <CardFooter pt={2} flexShrink={0}>
                                <Button
                                    variant={"primary"}
                                    width={"full"}
                                    onClick={handleSubmit}
                                >
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </SlideFade>
                </Flex>
            </Box>
        </>
    );
};

export default DocumentLayoutProfile;
