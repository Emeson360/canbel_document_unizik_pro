import { useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Link,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Text,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Tooltip,
    Button,
} from "@chakra-ui/react";
import {
    capitalizeText,
    myAppendQueryParam,
    myRemoveQueryParam,
    replaceUnderscoreWithSpace,
} from "../../../utils/helpers";
import { router, usePage } from "@inertiajs/react";
import Pagination from "../../../utils/Pagination";
import {
    CustomUsePageProps,
    DepartmentInterface,
    DocumentPaperInterface,
    DocumentPaperInterfacePaginated,
} from "../../../utils/types";
import { IoSearch } from "react-icons/io5";
import LabelStatus from "@/utils/LabelStatus";
import { TiEye } from "react-icons/ti";
import CustomMenu, { MenuItemsObj } from "@/utils/CustomMenu";
import { DocumentMenu } from "@/utils/DocumentMenu";
import { MdCancel } from "react-icons/md";

interface PageProps {
    allDocuments: DocumentPaperInterfacePaginated;
    documentStatuses: string[];
    documentTypes: string[];
    departments: DepartmentInterface[];
    filters: {
        query: string;
        status: string;
        type: string;
        department: string;
    };
}

const Documents = ({
    allDocuments,
    documentStatuses,
    documentTypes,
    departments,
    filters,
}: PageProps) => {
    const [titleQuery, setTitleQuery] = useState(filters.query || "");
    const dptItemsArr: MenuItemsObj[] = departments?.map((val) => ({
        label: capitalizeText(val.name),
        value: val.id.toString(),
    }));
    const docTypeItemsArr: MenuItemsObj[] = documentTypes?.map((val) => ({
        label: replaceUnderscoreWithSpace(val)?.toUpperCase(),
        value: val,
    }));
    const docStatusItemsArr: MenuItemsObj[] = documentStatuses?.map(
        (val, idx) => {
            if (val?.toLowerCase() === "pending") {
                return { label: "--" };
            }

            return {
                label: capitalizeText(replaceUnderscoreWithSpace(val)),
                value: idx.toString(),
            };
        }
    );

    const handleSearch = (e: any) => {
        e.preventDefault();

        if (titleQuery) {
            const newParams = { pg: 1, query: titleQuery };
            const queryString = myAppendQueryParam(newParams);
            const newUrl = `${window.location.pathname}?${queryString}`;
            router.get(newUrl);
        }
    };

    const Bg = useColorModeValue("#fff", "gray.800");
    const Ibg = useColorModeValue("#FAFAFB", "gray.700");

    const textColor = useColorModeValue("#1A202C", "#F7FAFC");

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
                    <Flex gap={3} direction={{ base: "column", md: "row" }}>
                        <Flex gap={2} align={"center"} flexWrap={"wrap"}>
                            <Heading
                                as={"h3"}
                                fontSize={"20px"}
                                fontWeight={700}
                                letterSpacing={"-2%"}
                            >
                                All documents
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
                                        placeholder="Search by Name, Reg. No."
                                        rounded={"24px"}
                                        bg={Ibg}
                                        color={textColor}
                                        type={"search"}
                                        value={titleQuery}
                                        onChange={({ target }) => {
                                            const newValue = target.value;
                                            const oldValue = titleQuery;

                                            // If old value had content and new value is empty, clear was clicked
                                            if (
                                                oldValue.length > 0 &&
                                                newValue === ""
                                            ) {
                                                const queryString =
                                                    myRemoveQueryParam("query");
                                                const newUrl = `${window.location.pathname}?${queryString}`;
                                                router.get(newUrl);
                                            } else {
                                                setTitleQuery(target.value);
                                            }
                                        }}
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
                    </Flex>
                </Flex>

                {/* filters */}
                <Flex gap={3} flexWrap={"wrap"} mt={2}>
                    <CustomMenu
                        value={filters.status}
                        items={docStatusItemsArr}
                        placeholder="All Status"
                        mini={true}
                        setValue={(val: string) => {
                            let queryString;
                            if (val === "undefined") {
                                queryString = myRemoveQueryParam("status");
                            } else {
                                const newParams = { status: val, pg: 1 };
                                queryString = myAppendQueryParam(newParams);
                            }
                            const newUrl = `${window.location.pathname}?${queryString}`;
                            router.get(newUrl);
                        }}
                    />
                    <CustomMenu
                        value={filters.type}
                        items={docTypeItemsArr}
                        placeholder="All Type"
                        mini={true}
                        setValue={(val: string) => {
                            let queryString;
                            if (val === "undefined") {
                                queryString = myRemoveQueryParam("type");
                            } else {
                                const newParams = { type: val, pg: 1 };
                                queryString = myAppendQueryParam(newParams);
                            }
                            const newUrl = `${window.location.pathname}?${queryString}`;
                            router.get(newUrl);
                        }}
                    />
                    <DocumentMenu
                        value={filters.department}
                        items={dptItemsArr}
                        placeholder="All Department"
                        mini={true}
                        onChange={(val: string) => {
                            let queryString;
                            if (val === "undefined") {
                                queryString = myRemoveQueryParam("department");
                            } else {
                                const newParams = { department: val, pg: 1 };
                                queryString = myAppendQueryParam(newParams);
                            }
                            const newUrl = `${window.location.pathname}?${queryString}`;
                            router.get(newUrl);
                        }}
                    />
                    {filters.status ||
                    filters.department ||
                    filters.type ||
                    filters.query ? (
                        <Button
                            leftIcon={<MdCancel />}
                            size={"sm"}
                            variant={"outline"}
                            fontWeight={400}
                            onClick={() => {
                                router.get(window.location.pathname);
                            }}
                        >
                            Clear filters
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
                                <Th>Holder's Name</Th>
                                <Th>Type</Th>
                                <Th>Registration number</Th>
                                <Th>Department</Th>
                                <Th>Discipline</Th>
                                <Th>Issued by</Th>
                                <Th>Approved/Refused by</Th>
                                <Th>status</Th>
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
                            {allDocuments?.data?.map((val) => (
                                <RowItem
                                    val={val}
                                    key={val?.id}
                                    documentStatuses={documentStatuses}
                                />
                            ))}
                        </Tbody>
                    </Table>
                    {!allDocuments?.data.length ? (
                        <Text
                            my={"200px"}
                            textAlign={"center"}
                            color={"root.textMuted"}
                        >
                            No results to show here
                        </Text>
                    ) : (
                        ""
                    )}
                </TableContainer>
                <Pagination
                    limit={allDocuments.per_page}
                    curPage={allDocuments.current_page}
                    totalItems={allDocuments.total}
                    url={allDocuments.path}
                />
            </Box>
        </>
    );
};

const RowItem = ({
    val,
    documentStatuses,
}: {
    val: DocumentPaperInterface;
    documentStatuses: string[];
}) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const userRole = user?.role;

    const route = () => {
        router.get(`/${userRole}/documents/preview/${val?.id}`);
    };

    return (
        <>
            <Tr _hover={{ bg: "#FAFAFB", cursor: "pointer" }} fontSize={"12px"}>
                <Td onClick={route} textTransform={"capitalize"}>
                    {val.holders_name}
                </Td>
                <Td onClick={route} textTransform={"uppercase"}>
                    {replaceUnderscoreWithSpace(val?.type || "")}
                </Td>
                <Td onClick={route} textTransform={"uppercase"}>
                    {val.registration_number}
                </Td>
                <Td onClick={route} textTransform={"capitalize"}>
                    {val.department?.name}
                </Td>
                <Td onClick={route} textTransform={"uppercase"}>
                    {val.discipline || "--"}
                </Td>
                <Td onClick={route} textTransform={"capitalize"}>
                    {val.issuer?.name}
                </Td>
                <Td onClick={route} textTransform={"capitalize"}>
                    {val.approver?.name || "--"}
                </Td>
                <Td onClick={route}>
                    <Flex justify={"center"}>
                        <LabelStatus
                            status={
                                val.status !== undefined && val.status !== null
                                    ? replaceUnderscoreWithSpace(
                                          documentStatuses[val.status]
                                      )
                                    : "--"
                            }
                        />
                    </Flex>
                </Td>
                <Td pr={2}>
                    <Flex align={"center"} justify={"flex-end"} gap={"10px"}>
                        <Tooltip label={"Preview"} hasArrow>
                            <Link
                                href={`/${userRole}/documents/preview/${val?.id}`}
                                style={{ height: "17px" }}
                            >
                                <Icon
                                    as={TiEye}
                                    color={"root.primary"}
                                    fontSize={"17px"}
                                    cursor={"pointer"}
                                />
                            </Link>
                        </Tooltip>
                    </Flex>
                </Td>
            </Tr>
        </>
    );
};

export default Documents;
