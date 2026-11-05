import { ChangeEvent, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { router, usePage } from "@inertiajs/react";
import { FiChevronRight, FiPlus } from "react-icons/fi";
import { HiMiniTrash } from "react-icons/hi2";
import {
    CustomUsePageProps,
    LayoutSettingProfileInterface,
} from "@/utils/types";
import { capitalizeText, checkEmptyFields } from "@/utils/helpers";
import CustomModal from "@/utils/CustomModal";
import CustomInput from "@/utils/CustomInput";
import CustomMenu from "@/utils/CustomMenu";
import CustomPrompt from "@/utils/CustomPrompt";
import CustomSwitch from "@/utils/customSwitch/CustomSwitch";
import FormSideEffects from "@/utils/FormSideEffects";
import { TbEdit } from "react-icons/tb";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface PageProps {
    profiles: LayoutSettingProfileInterface[];
    errors: any;
}

const DocumentLayout = ({ profiles, errors }: PageProps) => {
    const Bg = useColorModeValue("#fff", "gray.800");
    const {
        isOpen: isAddModalOpen,
        onOpen: onAddModalOpen,
        onClose: onAddModalClose,
    } = useDisclosure();

    const profileItemsArr = profiles.map((profile) => ({
        label: capitalizeText(profile.name),
        value: profile.id.toString(),
    }));

    return (
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
                <Heading
                    as={"h3"}
                    fontSize={"20px"}
                    fontWeight={700}
                    letterSpacing={"-2%"}
                >
                    Layout Setting Profiles
                    <Text as={"span"} color={"root.primary"}>
                        {" "}
                        ({profiles.length})
                    </Text>
                </Heading>

                <Button
                    rightIcon={<FiPlus />}
                    width={["full", "170px"]}
                    size={"sm"}
                    variant="black"
                    rounded={"8px"}
                    onClick={onAddModalOpen}
                >
                    New Profile
                </Button>
            </Flex>

            <TableContainer mt={"20px"}>
                <Table variant="simple">
                    <Thead>
                        <Tr color={"#534D59"}>
                            <Th>Name</Th>
                            <Th>Default</Th>
                            <Th>Show Document Template</Th>
                            <Th textAlign="right" pr={1}>
                                Action
                            </Th>
                            <Th w="32px" />
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
                        {profiles.map((profile) => (
                            <ProfileRowItem
                                profile={profile}
                                errors={errors}
                                key={`layout-setting-profile-${profile.id}`}
                            />
                        ))}
                    </Tbody>
                </Table>
                {!profiles.length ? (
                    <Text
                        my={"200px"}
                        textAlign={"center"}
                        color={"root.textMuted"}
                    >
                        You have not added any layout setting profiles yet
                    </Text>
                ) : (
                    ""
                )}
            </TableContainer>

            <AddProfileModal
                isOpen={isAddModalOpen}
                onClose={onAddModalClose}
                errors={errors}
                profileItemsArr={profileItemsArr}
            />
        </Box>
    );
};

const AddProfileModal = ({
    isOpen,
    onClose,
    errors,
    profileItemsArr,
}: {
    isOpen: boolean;
    onClose: () => void;
    errors: any;
    profileItemsArr: { label: string; value: string }[];
}) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [formState, setFormState] = useState({
        name: "",
        show_document_template: true,
        layout_template_id: profileItemsArr.length
            ? profileItemsArr[0].value
            : "",
    });

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const addProfile = () => {
        const { name, layout_template_id } = formState;

        const isFieldsEmpty = checkEmptyFields({ name, layout_template_id });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.post(`/${user?.role}/document-layout`, { ...formState });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={"New Layout Setting Profile"}
            size={["xs", "sm"]}
        >
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    onClose();
                    setFormState({
                        name: "",
                        show_document_template: false,
                        layout_template_id: "",
                    });
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
                <CustomMenu
                    label="Layout Template"
                    value={formState.layout_template_id}
                    items={profileItemsArr}
                    setValue={(val: string) =>
                        setFormState({ ...formState, layout_template_id: val })
                    }
                />
                <Box mt={2}>
                    <CustomSwitch
                        label1="Show Document Template"
                        value={formState.show_document_template}
                        toggle={() =>
                            setFormState({
                                ...formState,
                                show_document_template:
                                    !formState.show_document_template,
                            })
                        }
                    />
                </Box>
                <Button
                    variant={"black"}
                    width={"full"}
                    mt={5}
                    mb={3}
                    onClick={addProfile}
                    isLoading={isFormSubmitting}
                >
                    Add
                </Button>
            </Flex>
        </CustomModal>
    );
};

const ProfileRowItem = ({
    profile,
    errors,
}: {
    profile: LayoutSettingProfileInterface;
    errors: any;
}) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [name, setName] = useState(profile.name);
    const chevronColor = useColorModeValue("gray.400", "gray.500");
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

    const route = () => {
        router.get(`/${user?.role}/document-layout/${profile.id}`);
    };

    const handleToggleShowTemplate = () => {
        setIsToggling(true);
        router.patch(
            `/${user?.role}/document-layout-profiles/${profile.id}`,
            { show_document_template: !profile.show_document_template },
            { onFinish: () => setIsToggling(false) },
        );
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/${user?.role}/document-layout-profiles/${profile.id}`, {
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleUpdate = () => {
        const isFieldsEmpty = checkEmptyFields({ name });

        if (!isFieldsEmpty) {
            setIsFormSubmitting(true);
            router.patch(
                `/${user?.role}/document-layout-profiles/${profile.id}`,
                { name },
            );
        }
    };

    return (
        <>
            <FormSideEffects
                errors={errors}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    setIsDeleting(false);
                    onUpdateModalClose();
                    onDelModalClose();
                }}
                onError={() => {
                    setIsFormSubmitting(false);
                }}
                showErrorMsg={false}
            />
            <Tr role="group" _hover={{ bg: "#FAFAFB", cursor: "pointer" }}>
                <Td onClick={route}>
                    <Text
                        textTransform={"capitalize"}
                        transition="color 0.15s ease"
                        _groupHover={{
                            textDecoration: "underline",
                            color: "root.primary",
                        }}
                    >
                        {profile.name}
                    </Text>
                </Td>
                <Td onClick={route}>{profile.is_default ? "Yes" : "No"}</Td>
                <Td onClick={route}>
                    {profile.show_document_template ? "Yes" : "No"}
                </Td>
                <Td pr={1}>
                    <Flex align={"center"} justify={"flex-end"} gap={"10px"}>
                        <Tooltip
                            label={
                                profile.show_document_template
                                    ? "Hide document template"
                                    : "Show document template"
                            }
                            hasArrow
                        >
                            <Flex
                                rounded={"50%"}
                                boxSize={"25px"}
                                justify={"center"}
                                align={"center"}
                                cursor={isToggling ? "not-allowed" : "pointer"}
                                opacity={isToggling ? 0.5 : 1}
                                onClick={
                                    isToggling
                                        ? undefined
                                        : handleToggleShowTemplate
                                }
                            >
                                <Icon
                                    as={
                                        profile.show_document_template
                                            ? FaRegEye
                                            : FaRegEyeSlash
                                    }
                                    color={"root.primary"}
                                />
                            </Flex>
                        </Tooltip>
                        <Tooltip label={"Update"} hasArrow>
                            <Icon
                                onClick={onUpdateModalOpen}
                                as={TbEdit}
                                color={"blue.300"}
                            />
                        </Tooltip>
                        {!profile.is_default ? (
                            <Tooltip label={"Delete"} hasArrow>
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
                            </Tooltip>
                        ) : (
                            ""
                        )}
                    </Flex>
                </Td>
                <Td onClick={route} pl={0}>
                    <Icon as={FiChevronRight} color={chevronColor} />
                </Td>
            </Tr>

            <CustomPrompt
                isOpen={isDelModalOpen}
                onClose={onDelModalClose}
                variant="danger"
                action={`delete the "${profile.name}" layout setting profile`}
                primaryBtnAction={handleDelete}
                isActionLoading={isDeleting}
            />

            <CustomModal
                isOpen={isUpdateModalOpen}
                onClose={onUpdateModalClose}
                title={"Update Layout Setting Profile"}
                size={["xs", "sm"]}
            >
                <Flex direction={"column"} gap={3}>
                    <CustomInput
                        label="Name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        greyInput={true}
                    />
                    <Button
                        variant={"black"}
                        width={"full"}
                        mt={5}
                        mb={3}
                        onClick={handleUpdate}
                        isLoading={isFormSubmitting}
                    >
                        Update
                    </Button>
                </Flex>
            </CustomModal>
        </>
    );
};

export default DocumentLayout;
