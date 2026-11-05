import React, { useEffect, useRef, useState } from "react";
import {
    Flex,
    Button,
    Box,
    Image,
    Text,
    Heading,
    Card,
    CardHeader,
    CardBody,
    useColorModeValue,
} from "@chakra-ui/react";
import CustomInput from "../../utils/CustomInput";
import CustomMenu from "../../utils/CustomMenu";
import { DocumentMenu } from "../../utils/DocumentMenu";
import { showError, showSuccess } from "../../utils/Alert";
import { checkEmptyFields } from "../../utils/helpers";
import Logo from "../../assets/images/logo.png";
import SuccessIcon from "../../assets/images/ep_success-filled.svg";
import {
    CustomUsePageProps,
    DepartmentInterface,
    FacultyInterface,
} from "../../utils/types";
import { router, usePage } from "@inertiajs/react";

const initialFormState = {
    full_name: "",
    email: "",
    document_type: "",
    registration_number: "",
    nin: "",
    dob: "",
    faculty_id: "",
    department_id: "",
};

interface PageProps {
    departments: DepartmentInterface[];
    faculties: FacultyInterface[];
    documentTypes: string[];
    errors: any;
}

const Apply = ({
    departments,
    faculties,
    documentTypes,
    errors,
}: PageProps) => {
    const [formState, setFormState] = useState(initialFormState);
    const [file, setFile] = useState<File | undefined>();
    const [preview, setPreview] = useState<string>("");
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileElement: { current: any } | null = useRef(null);
    const { flash } = usePage<CustomUsePageProps>().props;

    const handleInputs = (e: any) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const clickFileElem = () => {
        if (fileElement && fileElement.current) {
            fileElement.current.click();
        }
    };

    const fileOnChange = (e: React.FocusEvent<HTMLInputElement>) => {
        let images = e.target.files;

        const allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
        if (!allowedExtensions.exec(e.target.value)) {
            showError("Invalid file type");
            return;
        }

        const TenMB = 10485760;
        if (images?.length) {
            if (images[0].size >= TenMB) {
                showError("File must be less than 10MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (base64) => {
                const img = new window.Image();
                img.onload = () => {
                    setFile(images?.length ? images[0] : undefined);
                };
                // @ts-ignore
                img.src = base64.target.result;
            };
            reader.readAsDataURL(images[0]);
        }
    };

    useEffect(() => {
        if (!file) {
            setPreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const facultyItemsArr = faculties.map((val) => ({
        label: val.name,
        value: val.id.toString(),
    }));

    const selectedFaculty = faculties.find(
        (val) => val.id.toString() === formState.faculty_id,
    );

    const departmentsItemsArr = departments
        .filter((val) => val.faculty_id === selectedFaculty?.id)
        .map((val) => ({
            label: val.name,
            value: val.id.toString(),
        }));

    const documentTypesItemsArr = documentTypes.map((val) => ({
        label: val.replace(/_/g, " ")?.toUpperCase(),
        value: val,
    }));

    useEffect(() => {
        if (flash?.success) {
            setIsFormSubmitting(false);
            setIsSubmitted(true);
            showSuccess(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (errors) {
            const errorValues: string[] = Object.values(errors);
            errorValues.forEach((errorMessage) => {
                setIsFormSubmitting(false);
                showError(errorMessage);
            });
        }
    }, [errors]);

    const resetForm = () => {
        setFormState(initialFormState);
        setFile(undefined);
        setIsSubmitted(false);
    };

    const handleSubmit = () => {
        const isEmpty = checkEmptyFields({
            full_name: formState.full_name,
            email: formState.email,
            document_type: formState.document_type,
            registration_number: formState.registration_number,
            nin: formState.nin,
            date_of_birth: formState.dob,
            faculty: formState.faculty_id,
            department: formState.department_id,
        });
        if (isEmpty) return;

        if (new Date(formState.dob) > new Date()) {
            showError("Date of birth cannot be in the future");
            return;
        }
        if (!file) {
            showError("Passport photograph is required");
            return;
        }

        setIsFormSubmitting(true);
        router.post("/student-portal", {
            ...formState,
            passport_photo: file,
        });
    };

    const pageBg = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const mutedColor = useColorModeValue("gray.600", "gray.400");
    const uploadBg = useColorModeValue("#F7F7F8", "gray.700");
    const uploadBorder = useColorModeValue("#D3D4DA", "gray.600");

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={pageBg}
            p={6}
        >
            <Box w={"full"} maxW={"xl"}>
                <Flex align={"center"} justify={"center"} mb={6}>
                    <Image src={Logo} alt="logo" h={"42px"} />
                </Flex>

                <Card
                    boxShadow={"0px 0px 10px -2px rgba(0,0,0,0.1)"}
                    rounded={"2xl"}
                    border={"1px solid rgba(0,0,0,0.1)"}
                    bg={cardBg}
                >
                    {isSubmitted ? (
                        <CardBody py={"60px"}>
                            <Flex
                                direction={"column"}
                                align={"center"}
                                textAlign={"center"}
                                gap={3}
                            >
                                <Image
                                    src={SuccessIcon}
                                    alt="Success"
                                    boxSize={"72px"}
                                />
                                <Heading
                                    as={"h1"}
                                    fontSize={"xl"}
                                    fontWeight={600}
                                >
                                    Application Received
                                </Heading>
                                <Text
                                    color={mutedColor}
                                    fontSize={"sm"}
                                    maxW={"sm"}
                                >
                                    Thank you,{" "}
                                    <Box as="span" textTransform={"capitalize"}>
                                        {formState.full_name || "student"}
                                    </Box>
                                    . Your information has been submitted for
                                    review.
                                </Text>
                                <Button
                                    variant={"outline"}
                                    mt={4}
                                    rounded={"8px"}
                                    onClick={resetForm}
                                >
                                    Submit another response
                                </Button>
                            </Flex>
                        </CardBody>
                    ) : (
                        <>
                            <CardHeader pb={0}>
                                <Heading
                                    as={"h1"}
                                    fontSize={"xl"}
                                    fontWeight={600}
                                >
                                    Student Portal Registration
                                </Heading>
                                <Text color={mutedColor} mt={1} fontSize={"sm"}>
                                    Fill in your details below to register
                                </Text>
                            </CardHeader>

                            <CardBody>
                                <Box mb="20px">
                                    <Text
                                        fontWeight={500}
                                        color={mutedColor}
                                        mb={2}
                                    >
                                        Passport Photograph
                                    </Text>
                                    <Text
                                        fontSize={"xs"}
                                        color={"root.primary"}
                                        mb={3}
                                    >
                                        Upload a passport photograph with a
                                        plain <b>red</b> background. Photos with
                                        any other background will not be
                                        accepted during verification.
                                    </Text>
                                    <Flex
                                        align={"center"}
                                        gap={4}
                                        p={3}
                                        rounded={"8px"}
                                        border={"1px dashed"}
                                        borderColor={uploadBorder}
                                        bg={uploadBg}
                                        cursor={"pointer"}
                                        onClick={clickFileElem}
                                    >
                                        <Box
                                            boxSize={"90px"}
                                            rounded={"8px"}
                                            overflow={"hidden"}
                                            border={"1px solid"}
                                            borderColor={uploadBorder}
                                            bg={"white"}
                                            flexShrink={0}
                                        >
                                            {preview ? (
                                                <Image
                                                    src={preview}
                                                    alt="passport preview"
                                                    boxSize={"90px"}
                                                    objectFit={"cover"}
                                                />
                                            ) : null}
                                        </Box>
                                        <Text
                                            fontSize={"sm"}
                                            color={mutedColor}
                                        >
                                            {file
                                                ? file.name
                                                : "Click to choose a passport photograph (JPG or PNG, max 10MB)"}
                                        </Text>
                                        <input
                                            type="file"
                                            ref={fileElement}
                                            onChange={fileOnChange}
                                            accept="image/jpeg,image/jpg,image/png"
                                            style={{ display: "none" }}
                                        />
                                    </Flex>
                                </Box>

                                <CustomInput
                                    label="Full Name"
                                    name="full_name"
                                    value={formState.full_name}
                                    onChange={handleInputs}
                                    mb="20px"
                                />
                                <CustomInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formState.email}
                                    onChange={handleInputs}
                                    mb="20px"
                                />
                                <CustomInput
                                    label="Registration Number"
                                    name="registration_number"
                                    value={formState.registration_number}
                                    onChange={handleInputs}
                                    mb="20px"
                                />
                                <Box mb="20px">
                                    <CustomMenu
                                        label="Certificate Type"
                                        value={formState.document_type}
                                        items={documentTypesItemsArr}
                                        setValue={(v) =>
                                            setFormState({
                                                ...formState,
                                                document_type: v,
                                            })
                                        }
                                    />
                                </Box>

                                <Flex
                                    gap={"20px"}
                                    direction={["column", "row"]}
                                    mb="20px"
                                >
                                    <Box width={["full", "50%"]}>
                                        <DocumentMenu
                                            label="Faculty"
                                            value={formState.faculty_id}
                                            items={facultyItemsArr}
                                            onChange={(v) =>
                                                setFormState({
                                                    ...formState,
                                                    faculty_id: v,
                                                    department_id: "",
                                                })
                                            }
                                        />
                                    </Box>
                                    <Box width={["full", "50%"]}>
                                        <DocumentMenu
                                            label="Department"
                                            placeholder={
                                                formState.faculty_id
                                                    ? "Select option"
                                                    : "Select a faculty first"
                                            }
                                            value={formState.department_id}
                                            items={departmentsItemsArr}
                                            onChange={(v) =>
                                                setFormState({
                                                    ...formState,
                                                    department_id: v,
                                                })
                                            }
                                        />
                                    </Box>
                                </Flex>

                                <Flex
                                    gap={"20px"}
                                    direction={["column", "row"]}
                                    mb="20px"
                                >
                                    <Box width={["full", "50%"]}>
                                        <CustomInput
                                            label="NIN"
                                            name="nin"
                                            value={formState.nin}
                                            onChange={handleInputs}
                                            type="number"
                                        />
                                    </Box>
                                    <Box width={["full", "50%"]}>
                                        <CustomInput
                                            label="Date of Birth"
                                            name="dob"
                                            type="date"
                                            value={formState.dob}
                                            onChange={handleInputs}
                                        />
                                    </Box>
                                </Flex>

                                <Button
                                    type="button"
                                    variant={"primary"}
                                    w={"full"}
                                    size={"lg"}
                                    height={"48px"}
                                    fontWeight={500}
                                    rounded="8px"
                                    isLoading={isFormSubmitting}
                                    loadingText="Submitting..."
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </CardBody>
                        </>
                    )}
                </Card>

                <Text
                    textAlign={"center"}
                    fontSize={"xs"}
                    color={mutedColor}
                    mt={6}
                >
                    © {new Date().getFullYear()} Canbel Technologies Ltd.
                </Text>
            </Box>
        </Flex>
    );
};

export default Apply;
