import { ChangeEvent, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    Icon,
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react";
import { router } from "@inertiajs/react";
import { DepartmentInterface, FacultyInterface } from "@/utils/types";
import { checkEmptyFields } from "@/utils/helpers";
import { FiPlus } from "react-icons/fi";
import { HiPencil } from "react-icons/hi";
import CustomModal from "@/utils/CustomModal";
import CustomInput from "@/utils/CustomInput";
import CustomMenu from "@/utils/CustomMenu";
import { CustomTab } from "@/utils/CustomTab";
import Pagination from "@/utils/Pagination";
import FormSideEffects from "@/utils/FormSideEffects";

type PaginatedList<T> = {
    data: T[];
    per_page: number;
    current_page: number;
    total: number;
    path: string;
};

interface CurrentPageProps {
    dpts: PaginatedList<DepartmentInterface>;
    faculties: PaginatedList<FacultyInterface>;
    errors: any;
}

const TABS = [
    { label: "Faculties", value: "faculties" },
    { label: "Departments", value: "dpts" },
];

// TODO: fix multi submission disrupt form side effects bug
const ManageDpts = ({ dpts, faculties, errors }: CurrentPageProps) => {
    const [activeTab, setActiveTab] = useState<"dpts" | "faculties">(
        "faculties",
    );
    const {
        isOpen: isAddModalOpen,
        onOpen: onAddModalOpen,
        onClose: onAddModalClose,
    } = useDisclosure();

    const facultyItemsArr = faculties.data.map((val) => ({
        label: val.name,
        value: val.id.toString(),
    }));

    const isDptTab = activeTab === "dpts";
    const activeList = isDptTab ? dpts : faculties;
    const Bg = useColorModeValue("#fff", "gray.800");

    return (
        <>
            <Box
                mt={[3, 0]}
                rounded={"12px"}
                minH={"300px"}
                bg={Bg}
                px={"20px"}
                py={"13px"}
            >
                <Flex
                    justifyContent={"space-between"}
                    align={"center"}
                    direction={{ base: "column", md: "row" }}
                    gap={"15px"}
                >
                    <Flex
                        gap={3}
                        align={"center"}
                        direction={{ base: "column", md: "row" }}
                    >
                        <Heading
                            as={"h3"}
                            fontSize={"20px"}
                            fontWeight={700}
                            letterSpacing={"-2%"}
                        >
                            {isDptTab ? "Departments" : "Faculties"}
                            <Text as={"span"} color={"root.primary"}>
                                {" "}
                                ({activeList.total})
                            </Text>
                        </Heading>
                        <CustomTab
                            curState={activeTab}
                            toggler={setActiveTab}
                            tabs={TABS}
                        />
                    </Flex>

                    <Button
                        rightIcon={<FiPlus />}
                        width={["full", "170px"]}
                        size={"sm"}
                        variant="black"
                        rounded={"8px"}
                        onClick={onAddModalOpen}
                    >
                        Add {isDptTab ? "Department" : "Faculty"}
                    </Button>
                </Flex>

                {/* table */}
                <TableContainer mt={"20px"}>
                    <Table variant="simple">
                        <Thead>
                            <Tr color={"#534D59"}>
                                <Th>Name</Th>
                                {isDptTab ? <Th>Faculty</Th> : ""}
                                <Th textAlign="right" pr={1}>
                                    Action
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody
                            sx={{
                                "tr:hover": {
                                    backgroundColor: "gray.100",
                                    _dark: {
                                        backgroundColor: "gray.700",
                                    },
                                    cursor: "pointer",
                                },
                            }}
                        >
                            {isDptTab
                                ? dpts.data.map((dpt) => (
                                      <DptRowItem
                                          dpt={dpt}
                                          errors={errors}
                                          facultyItemsArr={facultyItemsArr}
                                          key={`dpt-${dpt.id}`}
                                      />
                                  ))
                                : faculties.data.map((faculty) => (
                                      <FacultyRowItem
                                          faculty={faculty}
                                          errors={errors}
                                          key={`faculty-${faculty.id}`}
                                      />
                                  ))}
                        </Tbody>
                    </Table>
                    {!activeList.data.length ? (
                        <Text
                            my={"200px"}
                            textAlign={"center"}
                            color={"root.textMuted"}
                        >
                            You have not added any{" "}
                            {isDptTab ? "departments" : "faculties"} yet
                        </Text>
                    ) : (
                        ""
                    )}
                </TableContainer>
                <Pagination
                    limit={activeList.per_page}
                    curPage={activeList.current_page}
                    totalItems={activeList.total}
                    url={activeList.path}
                />

                {isDptTab ? (
                    <AddDptModal
                        isOpen={isAddModalOpen}
                        onClose={onAddModalClose}
                        errors={errors}
                        facultyItemsArr={facultyItemsArr}
                    />
                ) : (
                    <AddFacultyModal
                        isOpen={isAddModalOpen}
                        onClose={onAddModalClose}
                        errors={errors}
                    />
                )}
            </Box>
        </>
    );
};

/*******************
 * Departments
 * *****************/
const AddDptModal = ({
    isOpen,
    onClose,
    errors,
    facultyItemsArr,
}: {
    isOpen: boolean;
    onClose: () => void;
    errors: any;
    facultyItemsArr: { label: string; value: string }[];
}) => {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [formState, setFormState] = useState({
        name: "",
        key: "",
        faculty_id: "",
    });

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const addDpt = () => {
        const { name, key } = formState;

        const isFieldsEmpty = checkEmptyFields({ name, key });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.post("/registrar/manage-dpts", { ...formState });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={"Add a Department"}
            size={["xs", "xl"]}
        >
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    onClose();
                    setFormState({ name: "", key: "", faculty_id: "" });
                }}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
            />
            <Flex direction={"column"} gap={3}>
                <CustomInput
                    label="Name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputs}
                    greyInput={true}
                />
                <CustomInput
                    label="Key"
                    name="key"
                    value={formState.key}
                    onChange={handleInputs}
                    greyInput={true}
                />
                <CustomMenu
                    label="Faculty"
                    placeholder="Select faculty"
                    value={formState.faculty_id}
                    items={facultyItemsArr}
                    setValue={(val: string) =>
                        setFormState({ ...formState, faculty_id: val })
                    }
                />
                <Button
                    variant={"black"}
                    width={"full"}
                    mt={5}
                    mb={3}
                    onClick={addDpt}
                    isLoading={isFormSubmitting}
                >
                    Add
                </Button>
            </Flex>
        </CustomModal>
    );
};

const DptRowItem = ({
    dpt,
    errors,
    facultyItemsArr,
}: {
    dpt: DepartmentInterface;
    errors: any;
    facultyItemsArr: { label: string; value: string }[];
}) => {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [formState, setFormState] = useState({
        name: dpt.name,
        key: dpt.key,
        oldKey: dpt.key,
        faculty_id: dpt.faculty_id?.toString() || "",
    });
    const {
        isOpen: isUpdateModalOpen,
        onOpen: onUpdateModalOpen,
        onClose: onUpdateModalClose,
    } = useDisclosure();

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = () => {
        const { name, key } = formState;

        const isFieldsEmpty = checkEmptyFields({ name, key });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.patch("/registrar/manage-dpts", {
                id: dpt.id,
                ...formState,
            });
        }
    };

    return (
        <>
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    onUpdateModalClose();
                }}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
                showErrorMsg={false}
            />
            <Tr _hover={{ bg: "#FAFAFB", cursor: "pointer" }}>
                <Td onClick={onUpdateModalOpen}>
                    <Text textTransform={"capitalize"}>{dpt.name}</Text>
                </Td>
                <Td onClick={onUpdateModalOpen}>
                    <Text textTransform={"capitalize"}>
                        {dpt.faculty?.name || "-"}
                    </Text>
                </Td>
                <Td pr={1}>
                    <Flex align={"center"} justify={"flex-end"} gap={"10px"}>
                        <Flex
                            bg={"#BBBBBD"}
                            rounded={"50%"}
                            boxSize={"25px"}
                            justify={"center"}
                            align={"center"}
                            cursor={"pointer"}
                            onClick={onUpdateModalOpen}
                        >
                            <Icon as={HiPencil} color={"#000"} />
                        </Flex>
                    </Flex>
                </Td>
            </Tr>

            {/* update dpt modal */}
            <CustomModal
                isOpen={isUpdateModalOpen}
                onClose={onUpdateModalClose}
                title={"Update Department"}
                size={["xs", "xl"]}
            >
                <Flex direction={"column"} gap={3}>
                    <CustomInput
                        label="Name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputs}
                        greyInput={true}
                    />
                    <CustomInput
                        label="Key"
                        name="key"
                        value={formState.key}
                        onChange={handleInputs}
                        greyInput={true}
                    />
                    <CustomMenu
                        label="Faculty"
                        placeholder="Select faculty"
                        value={formState.faculty_id}
                        items={facultyItemsArr}
                        setValue={(val: string) =>
                            setFormState({ ...formState, faculty_id: val })
                        }
                    />
                    <Button
                        variant={"black"}
                        width={"full"}
                        mt={5}
                        mb={3}
                        onClick={handleSubmit}
                        isLoading={isFormSubmitting}
                    >
                        Update
                    </Button>
                </Flex>
            </CustomModal>
        </>
    );
};

/*******************
 * Faculties
 * *****************/
const AddFacultyModal = ({
    isOpen,
    onClose,
    errors,
}: {
    isOpen: boolean;
    onClose: () => void;
    errors: any;
}) => {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [formState, setFormState] = useState({ name: "", key: "" });

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const addFaculty = () => {
        const { name, key } = formState;

        const isFieldsEmpty = checkEmptyFields({ name, key });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.post("/registrar/manage-faculties", { ...formState });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={"Add a Faculty"}
            size={["xs", "xl"]}
        >
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    onClose();
                    setFormState({ name: "", key: "" });
                }}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
            />
            <Flex direction={"column"} gap={3}>
                <CustomInput
                    label="Name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputs}
                    greyInput={true}
                />
                <CustomInput
                    label="Key"
                    name="key"
                    value={formState.key}
                    onChange={handleInputs}
                    greyInput={true}
                />
                <Button
                    variant={"black"}
                    width={"full"}
                    mt={5}
                    mb={3}
                    onClick={addFaculty}
                    isLoading={isFormSubmitting}
                >
                    Add
                </Button>
            </Flex>
        </CustomModal>
    );
};

const FacultyRowItem = ({
    faculty,
    errors,
}: {
    faculty: FacultyInterface;
    errors: any;
}) => {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [formState, setFormState] = useState({
        name: faculty.name,
        key: faculty.key,
        oldKey: faculty.key,
    });
    const {
        isOpen: isUpdateModalOpen,
        onOpen: onUpdateModalOpen,
        onClose: onUpdateModalClose,
    } = useDisclosure();

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = () => {
        const { name, key } = formState;

        const isFieldsEmpty = checkEmptyFields({ name, key });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.patch("/registrar/manage-faculties", {
                id: faculty.id,
                ...formState,
            });
        }
    };

    return (
        <>
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    onUpdateModalClose();
                }}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
                showErrorMsg={false}
            />
            <Tr _hover={{ bg: "#FAFAFB", cursor: "pointer" }}>
                <Td onClick={onUpdateModalOpen}>
                    <Text textTransform={"capitalize"}>{faculty.name}</Text>
                </Td>
                <Td pr={1}>
                    <Flex align={"center"} justify={"flex-end"} gap={"10px"}>
                        <Flex
                            bg={"#BBBBBD"}
                            rounded={"50%"}
                            boxSize={"25px"}
                            justify={"center"}
                            align={"center"}
                            cursor={"pointer"}
                            onClick={onUpdateModalOpen}
                        >
                            <Icon as={HiPencil} color={"#000"} />
                        </Flex>
                    </Flex>
                </Td>
            </Tr>

            {/* update faculty modal */}
            <CustomModal
                isOpen={isUpdateModalOpen}
                onClose={onUpdateModalClose}
                title={"Update Faculty"}
                size={["xs", "xl"]}
            >
                <Flex direction={"column"} gap={3}>
                    <CustomInput
                        label="Name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputs}
                        greyInput={true}
                    />
                    <CustomInput
                        label="Key"
                        name="key"
                        value={formState.key}
                        onChange={handleInputs}
                        greyInput={true}
                    />
                    <Button
                        variant={"black"}
                        width={"full"}
                        mt={5}
                        mb={3}
                        onClick={handleSubmit}
                        isLoading={isFormSubmitting}
                    >
                        Update
                    </Button>
                </Flex>
            </CustomModal>
        </>
    );
};

export default ManageDpts;
