import { ChangeEvent, useState } from "react";
import { Heading, Box, Flex, Button, Image, Text } from "@chakra-ui/react";
import CustomInput from "../../../utils/CustomInput";
import {
    checkEmptyFields,
    classifyCgpa,
    formatDateForMySQL,
    isCgpaValid,
    replaceUnderscoreWithSpace,
} from "../../../utils/helpers";
import { useColorModeValue } from "@chakra-ui/react";
import {
    DepartmentInterface,
    DocumentPaperInterface,
    FacultyInterface,
} from "@/utils/types";
import CustomMenu from "@/utils/CustomMenu";
import { DocumentMenu } from "@/utils/DocumentMenu";
import FormSideEffects from "@/utils/FormSideEffects";
import { router } from "@inertiajs/react";
import CustomDatePicker from "@/utils/CustomDatePicker";
import { InvalidDoc } from "../admin/PreviewDocument";
import { showError } from "@/utils/Alert";

interface PageProps {
    document: DocumentPaperInterface | null;
    departments: DepartmentInterface[];
    faculties: FacultyInterface[];
    disciplines: string[];
    errors: any;
}

const UpdateDocument = ({
    document,
    departments,
    faculties,
    disciplines,
    errors,
}: PageProps) => {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const departmentsItemsArr = departments.map((val) => ({
        label: val.name,
        value: val.id.toString(),
    }));
    const facultyItemsArr = faculties.map((val) => ({
        label: val.name,
        value: val.id.toString(),
    }));
    const disciplinesItemsArr = disciplines.map((val) => ({
        label: val.toUpperCase(),
        value: val,
    }));
    const isPostgraduate = document?.type === "postgraduate";
    const [formState, setFormState] = useState({
        // document_id: document.id.toString(),
        type: document?.type || "",
        effective_date: document?.effective_date
            ? new Date(document?.effective_date)
            : null,
        holders_name: document?.holders_name || "",
        registration_number: document?.registration_number || "",
        nin: document?.nin || "",
        dob: document?.dob ? document.dob.slice(0, 10) : "",
        faculty_id: document?.faculty_id?.toString() || "",
        department_id: document?.department_id?.toString() || "",
        discipline: document?.discipline || "",
        cgpa: document?.cgpa || "",
        cgpa_class: document?.cgpa_class || "",
    });
    const handleInputs = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "cgpa") {
            setFormState({
                ...formState,
                cgpa: value,
                cgpa_class: isCgpaValid(value) ? classifyCgpa(value) : "",
            });
            return;
        }

        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = () => {
        const {
            holders_name,
            department_id,
            discipline,
            effective_date,
            cgpa,
            registration_number,
            nin,
            dob,
            faculty_id,
            type,
            cgpa_class,
        } = formState;

        if (!isPostgraduate && cgpa && !isCgpaValid(cgpa)) {
            showError("CGPA must be a number between 1.0 and 4.0");
            return;
        }

        const isFieldsEmpty = checkEmptyFields({
            holders_name,
            department: department_id,
            given_date: effective_date,
            registration_number,
            nin,
            date_of_birth: dob,
            faculty: faculty_id,
            type,
            ...(isPostgraduate ? {} : { discipline, cgpa_class, cgpa }),
        });

        if (isFieldsEmpty) return;

        // TODO: format effective_date before submission
        setIsFormSubmitting(true);
        const dt = effective_date?.toString();
        router.patch(`/supervisor/documents/update/${document?.id}`, {
            ...formState,
            effective_date: formatDateForMySQL(dt || ""),
        });
    };

    const Bg = useColorModeValue("#fff", "gray.800");

    const borderColor = useColorModeValue("#111111", "#ffffff"); // Dark for light mode, light for dark mode
    const border = `1px solid ${borderColor}`;

    return (
        <>
            <FormSideEffects
                errors={errors}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
                onSuccess={() => setIsFormSubmitting(false)}
            />
            <Box
                mt={[3, 0]}
                rounded={"12px"}
                minH={"300px"}
                bg={Bg}
                px={"40px"}
                py={"40px"}
            >
                <Heading
                    as={"h3"}
                    fontSize={"24px"}
                    fontWeight={700}
                    mb={"32px"}
                >
                    Update Document
                </Heading>
                {!document ? (
                    <InvalidDoc />
                ) : (
                    <Box>
                        <Box
                            border={border}
                            shadow={
                                "14px 27px 45px 4px #B0B5B90D, -14px -25px 45px 4px #B0B5B90D"
                            }
                            padding={"22px 20px"}
                            rounded={"12px"}
                            mb={"32px"}
                        >
                            <Heading
                                as={"h4"}
                                fontSize={"20px"}
                                fontWeight={700}
                                mb={"24px"}
                            >
                                Document Info
                            </Heading>

                            <Box mb={"22px"}>
                                <CustomInput
                                    label="Document Type"
                                    value={replaceUnderscoreWithSpace(
                                        document?.type?.toUpperCase() || ""
                                    )}
                                    readOnly
                                    greyInput={true}
                                />
                            </Box>

                            <Box display={formState.type ? "block" : "none"}>
                                <CustomDatePicker
                                    label="Given date"
                                    value={formState.effective_date}
                                    onChange={(date) =>
                                        setFormState({
                                            ...formState,
                                            effective_date: date,
                                        })
                                    }
                                    greyInput={true}
                                />
                            </Box>
                        </Box>

                        <Box
                            border={border}
                            shadow={
                                "14px 27px 45px 4px #B0B5B90D, -14px -25px 45px 4px #B0B5B90D"
                            }
                            padding={"22px 20px"}
                            rounded={"12px"}
                            mb={"32px"}
                        >
                            <Heading
                                as={"h4"}
                                fontSize={"20px"}
                                fontWeight={700}
                                mb={"24px"}
                            >
                                Student Record
                            </Heading>

                            <Box mb={"22px"}>
                                <Text fontWeight={500} color={"#48494D"} mb={2}>
                                    Passport Photograph
                                </Text>
                                <Flex
                                    align={"center"}
                                    gap={4}
                                    p={3}
                                    rounded={"8px"}
                                    border={"1px dashed"}
                                    borderColor={"#D3D4DA"}
                                    bg={"#F7F7F8"}
                                    cursor={"not-allowed"}
                                >
                                    <Box
                                        boxSize={"70px"}
                                        rounded={"8px"}
                                        overflow={"hidden"}
                                        border={"1px solid"}
                                        borderColor={"#D3D4DA"}
                                        bg={"white"}
                                        flexShrink={0}
                                    >
                                        {document?.passport_photo_url ? (
                                            <Image
                                                src={document.passport_photo_url}
                                                alt="passport preview"
                                                boxSize={"70px"}
                                                objectFit={"cover"}
                                            />
                                        ) : null}
                                    </Box>
                                    <Text fontSize={"sm"} color={"#48494D"}>
                                        Photo on file from student portal —
                                        locked
                                    </Text>
                                </Flex>
                            </Box>
                            <Box mb={"22px"}>
                                <CustomInput
                                    label="Holder's name"
                                    value={formState.holders_name}
                                    name="holders_name"
                                    onChange={handleInputs}
                                    greyInput={true}
                                />
                            </Box>
                            <Box mb={"22px"}>
                                <CustomInput
                                    label="Registration number"
                                    value={formState.registration_number}
                                    name="registration_number"
                                    onChange={handleInputs}
                                    readOnly
                                    greyInput={true}
                                />
                            </Box>
                            <Flex gap={"10px"} direction={["column", "row"]} mb={"22px"}>
                                <Box width={["full", "50%"]}>
                                    <CustomInput
                                        label="NIN"
                                        value={formState.nin}
                                        name="nin"
                                        onChange={handleInputs}
                                        readOnly
                                        greyInput={true}
                                    />
                                </Box>
                                <Box width={["full", "50%"]}>
                                    <CustomInput
                                        label="Date of birth"
                                        type="date"
                                        value={formState.dob}
                                        name="dob"
                                        onChange={handleInputs}
                                        readOnly
                                        greyInput={true}
                                    />
                                </Box>
                            </Flex>
                            <Box mb={"22px"}>
                                <DocumentMenu
                                    label={"Faculty"}
                                    value={formState.faculty_id}
                                    items={facultyItemsArr}
                                    onChange={(val) =>
                                        setFormState({
                                            ...formState,
                                            faculty_id: val,
                                        })
                                    }
                                />
                            </Box>
                            <Flex
                                gap={"10px"}
                                direction={["column", "row"]}
                                mb={"22px"}
                            >
                                {isPostgraduate ? (
                                    ""
                                ) : (
                                    <Box width={["full", "50%"]}>
                                        <CustomMenu
                                            label={"Discipline"}
                                            value={formState.discipline}
                                            items={disciplinesItemsArr}
                                            setValue={(val) =>
                                                setFormState({
                                                    ...formState,
                                                    discipline: val,
                                                })
                                            }
                                        />
                                    </Box>
                                )}
                                <Box
                                    width={[
                                        "full",
                                        isPostgraduate ? "full" : "50%",
                                    ]}
                                >
                                    <DocumentMenu
                                        label={"Department"}
                                        value={formState.department_id}
                                        items={departmentsItemsArr}
                                        onChange={(value) =>
                                            setFormState({
                                                ...formState,
                                                department_id: value,
                                            })
                                        }
                                    />
                                </Box>
                            </Flex>
                            {isPostgraduate ? (
                                ""
                            ) : (
                                <Flex
                                    gap={"10px"}
                                    direction={["column", "row"]}
                                >
                                    <Box width={["full", "50%"]}>
                                        <CustomInput
                                            label="CGPA"
                                            type="number"
                                            value={formState.cgpa}
                                            name="cgpa"
                                            onChange={handleInputs}
                                            greyInput={true}
                                        />
                                    </Box>
                                    <Box width={["full", "50%"]}>
                                        <CustomInput
                                            label="Classified as"
                                            value={formState.cgpa_class}
                                            name="cgpa_class"
                                            readOnly
                                            greyInput={true}
                                        />
                                    </Box>
                                </Flex>
                            )}
                        </Box>

                        <Flex mt={10} gap={5} align={"center"}>
                            {/* <Button
                                width={"full"}
                                variant={"black"}
                                onClick={handleSubmit}
                            >
                                Preview
                            </Button> */}

                            <Button
                                width={"full"}
                                variant={"primary"}
                                isLoading={isFormSubmitting}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Flex>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default UpdateDocument;
