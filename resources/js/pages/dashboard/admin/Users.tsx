import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import {
    Avatar,
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
    useColorModeValue,
    Text,
    useDisclosure,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { HiPencil } from "react-icons/hi";
import { showError } from "../../../utils/Alert";
import {
    capitalizeText,
    checkEmptyFields,
    myAppendQueryParam,
    myRemoveQueryParam,
} from "../../../utils/helpers";
import { router, usePage } from "@inertiajs/react";
import CustomModal from "../../../utils/CustomModal";
import CustomInput from "../../../utils/CustomInput";
import CustomMenu, { MenuItemsObj } from "../../../utils/CustomMenu";
import Pagination from "../../../utils/Pagination";
import {
    CustomUsePageProps,
    UserInterface,
    UserInterfacePaginated,
} from "../../../utils/types";
import CustomPrompt from "@/utils/CustomPrompt";
import { HiMiniTrash } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import FormSideEffects from "@/utils/FormSideEffects";

const ROLE_ITEMS: MenuItemsObj[] = [
    { label: "Registrar", value: "registrar" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Assistant Supervisor", value: "assistant-supervisor" },
];

interface PageProps {
    allUsers: UserInterfacePaginated;
    query: string;
    role: string;
    errors: any;
}

const Users = ({ allUsers, role, errors }: PageProps) => {
    const [titleQuery, setTitleQuery] = useState("");
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const fileElement: { current: any } | null = useRef(null);
    const [file, setFile] = useState<File | undefined>();
    const [preview, setPreview] = useState<string>("");
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        role: "",
    });
    const {
        isOpen: isAddModalOpen,
        onOpen: onAddModalOpen,
        onClose: onAddModalClose,
    } = useDisclosure();

    const handleInputs = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const handleSearch = (e: any) => {
        e.preventDefault();

        if (titleQuery) {
            const newParams = { pg: 1, query: titleQuery };
            const queryString = myAppendQueryParam(newParams);
            const newUrl = `${window.location.pathname}?${queryString}`;
            router.get(newUrl);
        }
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
            return false;
        }

        const TwoMB = 10485760;
        if (images?.length) {
            if (images[0].size >= TwoMB) {
                showError("File must be less than 10MB");
                return;
            } else {
                const reader = new FileReader();

                reader.onload = (base64) => {
                    const img = new Image();
                    img.onload = () => {
                        setFile(images?.length ? images[0] : undefined);
                    };

                    // @ts-ignore
                    img.src = base64.target.result;
                };

                reader.readAsDataURL(images[0]);
            }
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

    const addTeamMember = () => {
        const { name, email, role } = formState;

        const isFieldsEmpty = checkEmptyFields({
            full_name: name,
            email,
            role,
        });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.post("/admin/users", { ...formState, photo: file });
        }
    };
    const Bg = useColorModeValue("#fff", "gray.800");
    const Ibg = useColorModeValue("#FAFAFB", "gray.700");

    const textColor = useColorModeValue("#1A202C", "#F7FAFC");

    return (
        <>
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    onAddModalClose();
                    setFormState({ name: "", email: "", role: "" });
                    setFile(undefined);
                }}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
            />
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
                    <Flex gap={3} direction={{ base: "column", md: "row" }}>
                        <Flex gap={2} align={"center"} flexWrap={"wrap"}>
                            <Heading
                                as={"h3"}
                                fontSize={"20px"}
                                fontWeight={700}
                                letterSpacing={"-2%"}
                            >
                                Users
                            </Heading>
                        </Flex>
                    </Flex>

                    <Flex
                        justify={"flex-end"}
                        align={"center"}
                        gap={3}
                        width={["full", "70%", "50%"]}
                        direction={["column", "row"]}
                    >
                        <Box width={["full", "70%"]}>
                            <form onSubmit={handleSearch}>
                                <InputGroup>
                                    <Input
                                        placeholder="Search by name"
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
                                        <Icon
                                            as={IoSearch}
                                            color={"root.primary"}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </form>
                        </Box>
                        <Button
                            rightIcon={<FiPlus />}
                            width={["full", "100px"]}
                            size={"sm"}
                            variant="black"
                            rounded={"8px"}
                            onClick={onAddModalOpen}
                        >
                            Add New
                        </Button>
                    </Flex>
                </Flex>

                {/* filters */}
                <Flex gap={3} flexWrap={"wrap"} mt={2}>
                    <CustomMenu
                        value={role}
                        items={ROLE_ITEMS}
                        placeholder="All Roles"
                        mini={true}
                        setValue={(val: string) => {
                            let queryString;
                            if (!val) {
                                queryString = myRemoveQueryParam("role");
                            } else {
                                const newParams = { role: val, pg: 1 };
                                queryString = myAppendQueryParam(newParams);
                            }
                            const newUrl = `${window.location.pathname}?${queryString}`;
                            router.get(newUrl);
                        }}
                    />
                    {role ? (
                        <Button
                            leftIcon={<MdCancel />}
                            size={"sm"}
                            variant={"outline"}
                            fontWeight={400}
                            onClick={() => {
                                const queryString = myRemoveQueryParam("role");
                                router.get(
                                    `${window.location.pathname}?${queryString}`
                                );
                            }}
                        >
                            Clear filter
                        </Button>
                    ) : (
                        ""
                    )}
                </Flex>

                {/* table */}
                <TableContainer mt={"20px"}>
                    <Table variant="simple">
                        <Thead>
                            <Tr color={"#534D59"}>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Role</Th>
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
                                        backgroundColor: "gray.700", // Dark mode hover
                                    },
                                    cursor: "pointer",
                                },
                            }}
                        >
                            {allUsers?.data?.map((val) => (
                                <RowItem
                                    val={val}
                                    errors={errors}
                                    key={val?.id}
                                />
                            ))}
                        </Tbody>
                    </Table>
                    {!allUsers?.data.length ? (
                        <Text
                            my={"200px"}
                            textAlign={"center"}
                            color={"root.textMuted"}
                        >
                            You have not added any users yet
                        </Text>
                    ) : (
                        ""
                    )}
                </TableContainer>
                <Pagination
                    limit={allUsers.per_page}
                    curPage={allUsers.current_page}
                    totalItems={allUsers.total}
                    url={allUsers.path}
                />

                {/* add member modal */}
                <CustomModal
                    isOpen={isAddModalOpen}
                    onClose={onAddModalClose}
                    title={"Add a User"}
                    size={["xs", "xl"]}
                >
                    <Flex direction={"column"} gap={3}>
                        <Flex justify={"center"} align={"center"} mb={3}>
                            <Box
                                pos={"relative"}
                                width={"100px"}
                                cursor={"pointer"}
                                onClick={clickFileElem}
                            >
                                <Avatar src={preview} boxSize={"100px"} />
                                <input
                                    type="file"
                                    ref={fileElement}
                                    onChange={fileOnChange}
                                    style={{ display: "none" }}
                                />
                                <Button
                                    bg={"root.white"}
                                    pos={"absolute"}
                                    bottom={0}
                                    right={0}
                                    size="xs"
                                    padding={"5px"}
                                    shadow={"md"}
                                >
                                    <HiPencil color="#000" fontSize={"18px"} />
                                </Button>
                            </Box>
                        </Flex>
                        <CustomInput
                            label="Full Name"
                            name="name"
                            value={formState.name}
                            onChange={handleInputs}
                            greyInput={true}
                        />
                        <CustomInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleInputs}
                            greyInput={true}
                        />
                        <CustomMenu
                            label="Role"
                            placeholder="Select role"
                            value={formState.role}
                            items={ROLE_ITEMS}
                            setValue={(val: string) =>
                                setFormState({ ...formState, role: val })
                            }
                        />
                        <Button
                            variant={"black"}
                            width={"full"}
                            mt={5}
                            mb={3}
                            onClick={addTeamMember}
                            isLoading={isFormSubmitting}
                        >
                            Add
                        </Button>
                    </Flex>
                </CustomModal>
            </Box>
        </>
    );
};

const RowItem = ({ val, errors }: { val: UserInterface; errors: any }) => {
    const { fsUrl } = usePage<CustomUsePageProps>().props;
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isItemDeleting, setIsItemDeleting] = useState(false);
    const fileElement: { current: any } | null = useRef(null);
    const [file, setFile] = useState<File | undefined>();
    const [preview, setPreview] = useState<string>("");
    const [formState, setFormState] = useState({
        name: val.name,
        email: val.email,
        role: val.role as string,
        coverUrl: `${fsUrl}/${val.coverUrl}`,
    });
    const {
        isOpen: isUpdateModalOpen,
        onOpen: onUpdateModalOpen,
        onClose: onUpdateModalClose,
    } = useDisclosure();
    const {
        isOpen: isDelModalOpen,
        onOpen: onDelModalOpen,
        onClose: onDelModalClose,
    } = useDisclosure();

    const handleInputs = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const clickFileElem = () => {
        if (fileElement.current) {
            fileElement.current.click();
        }
    };

    const fileOnChange = (e: React.FocusEvent<HTMLInputElement>) => {
        let images = e.target.files;

        const allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
        if (!allowedExtensions.exec(e.target.value)) {
            showError("Invalid file type");
            return false;
        }

        const TwoMB = 10485760;
        if (images?.length) {
            if (images[0].size >= TwoMB) {
                showError("File must be less than 10MB");
                return;
            } else {
                const reader = new FileReader();

                reader.onload = (base64) => {
                    const img = new Image();
                    img.onload = () => {
                        setFile(images?.length ? images[0] : undefined);
                    };

                    // @ts-ignore
                    img.src = base64.target.result;
                };

                reader.readAsDataURL(images[0]);
            }
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

    const deleteItem = () => {
        setIsItemDeleting(true);
        router.delete(`/admin/users/${val?.id}`);
    };

    const handleSubmit = () => {
        const { name, email, role } = formState;

        const isFieldsEmpty = checkEmptyFields({
            full_name: name,
            email,
            role,
        });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.post(
                `/admin/users/${val.id}`,
                file
                    ? {
                          ...formState,
                          photo: file,
                          _method: "patch",
                      }
                    : {
                          ...formState,
                          _method: "patch",
                      },
                { forceFormData: true }
            );
        }
    };

    return (
        <>
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    setIsItemDeleting(false);
                    onUpdateModalClose();
                    onDelModalClose();
                }}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
                showErrorMsg={false}
            />
            <Tr _hover={{ bg: "#FAFAFB", cursor: "pointer" }}>
                <Td onClick={onUpdateModalOpen}>
                    <Flex align={"center"} gap={2}>
                        <Avatar
                            src={`${fsUrl}/${val.coverUrl}`}
                            boxSize={"33px"}
                        />
                        <Text
                            textTransform={"capitalize"}
                        >{`${val?.name}`}</Text>
                    </Flex>
                </Td>
                <Td onClick={onUpdateModalOpen}>{val?.email}</Td>
                <Td onClick={onUpdateModalOpen}>
                    {capitalizeText(val.role.replace(/[-_]/g, " "))}
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
                            onClick={onDelModalOpen}
                        >
                            <Icon as={HiMiniTrash} color={"#000"} />
                        </Flex>
                    </Flex>
                </Td>
            </Tr>

            <CustomPrompt
                isOpen={isDelModalOpen}
                onClose={onDelModalClose}
                variant="danger"
                action={`delete this team member`}
                primaryBtnAction={deleteItem}
                isActionLoading={isItemDeleting}
            />

            {/* update member modal */}
            <CustomModal
                isOpen={isUpdateModalOpen}
                onClose={onUpdateModalClose}
                title={"Update User"}
                size={["xs", "xl"]}
            >
                <Flex direction={"column"} gap={3}>
                    <Flex justify={"center"} align={"center"} mb={3}>
                        <Box
                            pos={"relative"}
                            width={"100px"}
                            cursor={"pointer"}
                            onClick={clickFileElem}
                        >
                            <Avatar
                                src={preview || formState.coverUrl}
                                boxSize={"100px"}
                            />
                            <input
                                type="file"
                                ref={fileElement}
                                onChange={fileOnChange}
                                style={{ display: "none" }}
                            />
                            <Button
                                bg={"root.white"}
                                pos={"absolute"}
                                bottom={0}
                                right={0}
                                size="xs"
                                padding={"5px"}
                                shadow={"md"}
                            >
                                <HiPencil color="#000" fontSize={"18px"} />
                            </Button>
                        </Box>
                    </Flex>
                    <CustomInput
                        label="Full Name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputs}
                        greyInput={true}
                    />
                    <CustomInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputs}
                        greyInput={true}
                    />
                    <CustomMenu
                        label="Role"
                        placeholder="Select role"
                        value={formState.role}
                        items={ROLE_ITEMS}
                        setValue={(val: string) =>
                            setFormState({ ...formState, role: val })
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

export default Users;
