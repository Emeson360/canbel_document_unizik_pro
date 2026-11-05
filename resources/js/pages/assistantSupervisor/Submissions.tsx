import { ReactNode, useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    Image,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    SimpleGrid,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import {
    formatTableDate,
    myAppendQueryParam,
    myRemoveQueryParam,
    replaceUnderscoreWithSpace,
} from "@/utils/helpers";
import { router, usePage } from "@inertiajs/react";
import Pagination from "@/utils/Pagination";
import CustomPrompt from "@/utils/CustomPrompt";
import CustomModal from "@/utils/CustomModal";
import CustomInput from "@/utils/CustomInput";
import CustomMenu from "@/utils/CustomMenu";
import { DocumentMenu } from "@/utils/DocumentMenu";
import { showError, showSuccess } from "@/utils/Alert";
import {
    CustomUsePageProps,
    DepartmentInterface,
    FacultyInterface,
    StudentSubmissionInterface,
    StudentSubmissionInterfacePaginated,
} from "@/utils/types";
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { PiCheckCircleFill, PiMagnifyingGlassBold } from "react-icons/pi";

interface PageProps {
    submissions: StudentSubmissionInterfacePaginated;
    departments: DepartmentInterface[];
    faculties: FacultyInterface[];
    filters: {
        query: string;
    };
    errors: any;
}

const Submissions = ({
    submissions,
    departments,
    faculties,
    filters,
    errors,
}: PageProps) => {
    const { user, flash } = usePage<CustomUsePageProps>().props;
    const [titleQuery, setTitleQuery] = useState(filters.query || "");

    // this page renders standalone (no dashboard Layout), so it doesn't get
    // Layout's flash-toast side effect and has to show it itself
    useEffect(() => {
        if (flash?.success) showSuccess(flash.success, 10000);
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) showError(flash.error);
    }, [flash?.error]);

    const runSearch = (value: string) => {
        const queryString = value
            ? myAppendQueryParam({ query: value, pg: 1 })
            : myRemoveQueryParam("query");
        const newUrl = `${window.location.pathname}?${queryString}`;
        router.get(
            newUrl,
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        if (titleQuery === (filters.query || "")) return;

        const handler = setTimeout(() => runSearch(titleQuery), 400);
        return () => clearTimeout(handler);
    }, [titleQuery]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        runSearch(titleQuery);
    };

    const logOut = () => {
        router.post("/logout");
    };

    const Bg = useColorModeValue("#F7F7F8", "gray.900");
    const CardBg = useColorModeValue("#fff", "gray.800");
    const Ibg = useColorModeValue("#FAFAFB", "gray.700");
    const cardBg = useColorModeValue("#FAFAFB", "gray.700");
    const textColor = useColorModeValue("#1A202C", "#F7FAFC");

    return (
        <Box minH={"100vh"} bg={Bg} py={"20px"} px={[3, "40px"]}>
            <Flex justify={"space-between"} align={"center"} mb={"20px"}>
                <Heading as={"h2"} fontSize={"22px"} fontWeight={700}>
                    Pending student submissions
                </Heading>
                <Flex align={"center"} gap={3}>
                    <Text fontSize={"14px"} textTransform={"capitalize"}>
                        {user?.name}
                    </Text>
                    <Button
                        size={"sm"}
                        variant={"outline"}
                        borderRadius={"24px"}
                        as={"a"}
                        href={`/${user?.role}/settings`}
                    >
                        Settings
                    </Button>
                    <Button
                        size={"sm"}
                        variant={"outline"}
                        borderRadius={"24px"}
                        onClick={logOut}
                    >
                        Log out
                    </Button>
                </Flex>
            </Flex>

            <Box
                rounded={"12px"}
                minH={"300px"}
                bg={CardBg}
                px={"20px"}
                py={"13px"}
            >
                <Box width={["full", "350px"]}>
                    <form onSubmit={handleSearch}>
                        <InputGroup>
                            <Input
                                placeholder="Search by Name or Reg. Number"
                                rounded={"24px"}
                                bg={Ibg}
                                color={textColor}
                                type={"search"}
                                value={titleQuery}
                                onChange={({ target }) =>
                                    setTitleQuery(target.value)
                                }
                            />
                            <InputRightElement onClick={handleSearch}>
                                <Icon as={IoSearch} color={"root.primary"} />
                            </InputRightElement>
                        </InputGroup>
                    </form>
                </Box>

                {filters.query ? (
                    <Flex mt={2}>
                        <Button
                            leftIcon={<MdCancel />}
                            size={"sm"}
                            variant={"outline"}
                            fontWeight={400}
                            onClick={() => router.get(window.location.pathname)}
                        >
                            Clear search
                        </Button>
                    </Flex>
                ) : (
                    ""
                )}

                <Flex direction={"column"} gap={"16px"} mt={"20px"}>
                    {submissions?.data?.map((submission) => (
                        <SubmissionCard
                            key={submission.id}
                            submission={submission}
                            departments={departments}
                            faculties={faculties}
                            cardBg={cardBg}
                            errors={errors}
                        />
                    ))}
                </Flex>

                {!submissions?.data?.length ? (
                    <Flex
                        direction={"column"}
                        align={"center"}
                        justify={"center"}
                        gap={3}
                        py={"100px"}
                    >
                        <Icon
                            as={
                                filters.query
                                    ? PiMagnifyingGlassBold
                                    : PiCheckCircleFill
                            }
                            boxSize={"48px"}
                            color={
                                filters.query ? "root.textMuted" : "green.400"
                            }
                        />
                        <Heading as={"h4"} fontSize={"16px"} fontWeight={600}>
                            {filters.query
                                ? "No matching submissions"
                                : "You're all caught up"}
                        </Heading>
                        <Text
                            fontSize={"14px"}
                            color={"root.textMuted"}
                            textAlign={"center"}
                            maxW={"320px"}
                        >
                            {filters.query
                                ? `No pending submissions match "${filters.query}". Try a different name.`
                                : "There are no pending student submissions to review right now."}
                        </Text>
                    </Flex>
                ) : (
                    ""
                )}

                <Pagination
                    limit={submissions.per_page}
                    curPage={submissions.current_page}
                    totalItems={submissions.total}
                    url={submissions.path}
                />
            </Box>
        </Box>
    );
};;;;;;;;;

const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
    <Flex gap={2} fontSize={"13px"}>
        <Text color={"root.textMuted"}>{label}:</Text>
        <Text fontWeight={600} textTransform={"capitalize"}>
            {value || "--"}
        </Text>
    </Flex>
);

const SubmissionCard = ({
    submission,
    departments,
    faculties,
    cardBg,
    errors,
}: {
    submission: StudentSubmissionInterface;
    departments: DepartmentInterface[];
    faculties: FacultyInterface[];
    cardBg: string;
    errors: any;
}) => {
    const borderColor = useColorModeValue("#D3D4DA", "gray.600");
    const { flash } = usePage<CustomUsePageProps>().props;
    const [isApproving, setIsApproving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editFormState, setEditFormState] = useState({
        full_name: submission.full_name,
        faculty_id: submission.faculty_id?.toString() || "",
        department_id: submission.department_id?.toString() || "",
    });
    const {
        isOpen: isDelModalOpen,
        onOpen: onDelModalOpen,
        onClose: onDelModalClose,
    } = useDisclosure();
    const {
        isOpen: isEditModalOpen,
        onOpen: onEditModalOpen,
        onClose: onEditModalClose,
    } = useDisclosure();

    const departmentsItemsArr = departments.map((val) => ({
        label: val.name,
        value: val.id.toString(),
    }));

    const facultyItemsArr = faculties.map((val) => ({
        label: val.name,
        value: val.id.toString(),
    }));

    useEffect(() => {
        if (flash?.success) {
            setIsApproving(false);
            setIsDeleting(false);
            setIsUpdating(false);
            onDelModalClose();
            onEditModalClose();
        }
    }, [flash?.success]);

    useEffect(() => {
        if (errors) {
            const errorValues: string[] = Object.values(errors);
            if (errorValues.length) {
                errorValues.forEach((errorMessage) => showError(errorMessage));
                setIsApproving(false);
                setIsDeleting(false);
                setIsUpdating(false);
            }
        }
    }, [errors]);

    const approveSubmission = () => {
        setIsApproving(true);
        router.patch(
            `/assistant-supervisor/student-submissions/${submission.id}/approve`,
        );
    };

    const deleteSubmission = () => {
        setIsDeleting(true);
        router.delete(
            `/assistant-supervisor/student-submissions/${submission.id}`,
        );
    };

    const updateAndApproveSubmission = () => {
        setIsUpdating(true);
        router.patch(
            `/assistant-supervisor/student-submissions/${submission.id}`,
            editFormState,
        );
    };

    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            justify={"space-between"}
            gap={"20px"}
            bg={cardBg}
            rounded={"12px"}
            p={"20px"}
        >
            <Box flex={1}>
                <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacingY={3}
                    spacingX={6}
                >
                    <InfoRow label="Full name" value={submission.full_name} />
                    <InfoRow
                        label="Date of birth"
                        value={
                            submission.dob
                                ? formatTableDate(submission.dob)
                                : "--"
                        }
                    />
                    <InfoRow label="NIN" value={submission.nin} />
                    <InfoRow
                        label="Faculty"
                        value={submission.faculty?.name}
                    />
                    <InfoRow
                        label="Registration number"
                        value={submission.registration_number}
                    />
                    <InfoRow
                        label="Department"
                        value={submission.department?.name}
                    />
                    <InfoRow
                        label="Certificate type"
                        value={replaceUnderscoreWithSpace(
                            submission.document_type || "",
                        )}
                    />
                </SimpleGrid>
            </Box>

            <Flex direction={"column"} align={"center"} gap={2} minW={"140px"}>
                <Box
                    boxSize={"120px"}
                    rounded={"8px"}
                    overflow={"hidden"}
                    border={"1px solid"}
                    borderColor={borderColor}
                    bg={"gray.100"}
                    flexShrink={0}
                >
                    {submission.passport_photo_url ? (
                        <Image
                            src={submission.passport_photo_url}
                            alt={submission.full_name}
                            boxSize={"120px"}
                            objectFit={"cover"}
                        />
                    ) : null}
                </Box>
                <Flex direction={"column"} gap={2} w={"full"}>
                    <Button
                        size={"sm"}
                        variant={"success"}
                        w={"full"}
                        isLoading={isApproving}
                        onClick={approveSubmission}
                    >
                        Approve
                    </Button>
                    <Flex gap={2} w={"full"}>
                        <Button
                            size={"sm"}
                            variant={"outline"}
                            flex={1}
                            leftIcon={<FiEdit />}
                            onClick={() => {
                                setEditFormState({
                                    full_name: submission.full_name,
                                    faculty_id:
                                        submission.faculty_id?.toString() ||
                                        "",
                                    department_id:
                                        submission.department_id?.toString() ||
                                        "",
                                });
                                onEditModalOpen();
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            size={"sm"}
                            variant={"danger"}
                            flex={1}
                            onClick={onDelModalOpen}
                        >
                            Delete
                        </Button>
                    </Flex>
                </Flex>
            </Flex>

            <CustomModal
                isOpen={isEditModalOpen}
                onClose={onEditModalClose}
                title={"Edit submission"}
                size={["xs", "xl"]}
            >
                <Flex direction={"column"} gap={3}>
                    <CustomInput
                        label="Full Name"
                        name="full_name"
                        value={editFormState.full_name}
                        onChange={({ target }) =>
                            setEditFormState({
                                ...editFormState,
                                full_name: target.value,
                            })
                        }
                        greyInput={true}
                    />
                    <CustomMenu
                        label="Faculty"
                        value={editFormState.faculty_id}
                        items={facultyItemsArr}
                        setValue={(val: string) =>
                            setEditFormState({
                                ...editFormState,
                                faculty_id: val,
                            })
                        }
                    />
                    <DocumentMenu
                        label="Department"
                        value={editFormState.department_id}
                        items={departmentsItemsArr}
                        onChange={(val: string) =>
                            setEditFormState({
                                ...editFormState,
                                department_id: val,
                            })
                        }
                    />
                    <Button
                        variant={"black"}
                        width={"full"}
                        mt={5}
                        mb={3}
                        onClick={updateAndApproveSubmission}
                        isLoading={isUpdating}
                    >
                        Update and approve
                    </Button>
                </Flex>
            </CustomModal>

            <CustomPrompt
                isOpen={isDelModalOpen}
                onClose={onDelModalClose}
                variant="danger"
                action={`delete ${submission.full_name}'s submission`}
                primaryBtnAction={deleteSubmission}
                isActionLoading={isDeleting}
            />
        </Flex>
    );
};

export default Submissions;
