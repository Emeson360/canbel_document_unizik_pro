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
} from "@chakra-ui/react";
import {
    formatTableDate,
    myAppendQueryParam,
    myRemoveQueryParam,
    replaceUnderscoreWithSpace,
} from "../../../utils/helpers";
import { router } from "@inertiajs/react";
import Pagination from "../../../utils/Pagination";
import {
    StudentSubmissionInterface,
    StudentSubmissionInterfacePaginated,
} from "../../../utils/types";
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { PiTrayBold, PiMagnifyingGlassBold } from "react-icons/pi";

interface PageProps {
    submissions: StudentSubmissionInterfacePaginated;
    filters: {
        query: string;
    };
    errors: any;
}

const StudentSubmissions = ({ submissions, filters, errors }: PageProps) => {
    const [titleQuery, setTitleQuery] = useState(filters.query || "");

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

    const Bg = useColorModeValue("#fff", "gray.800");
    const Ibg = useColorModeValue("#FAFAFB", "gray.700");
    const cardBg = useColorModeValue("#FAFAFB", "gray.700");
    const textColor = useColorModeValue("#1A202C", "#F7FAFC");

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
                    Student portal submissions
                </Heading>

                <Box width={["full", "300px"]}>
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
                                <Icon as={IoSearch} color={"root.primary"} />
                            </InputRightElement>
                        </InputGroup>
                    </form>
                </Box>
            </Flex>

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
                        as={filters.query ? PiMagnifyingGlassBold : PiTrayBold}
                        boxSize={"48px"}
                        color={"root.textMuted"}
                    />
                    <Heading as={"h4"} fontSize={"16px"} fontWeight={600}>
                        {filters.query
                            ? "No matching submissions"
                            : "No approved submissions yet"}
                    </Heading>
                    <Text
                        fontSize={"14px"}
                        color={"root.textMuted"}
                        textAlign={"center"}
                        maxW={"320px"}
                    >
                        {filters.query
                            ? `No approved submissions match "${filters.query}". Try a different name.`
                            : "Submissions approved by the Assistant Supervisor will show up here, ready to issue a certificate."}
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
    );
};

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
    cardBg,
    // errors,
}: {
    submission: StudentSubmissionInterface;
    cardBg: string;
    errors: any;
}) => {
    const borderColor = useColorModeValue("#D3D4DA", "gray.600");

    const issueCert = () => {
        router.visit(
            `/supervisor/documents/issue-document?submission-id=${submission.id}`,
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
                <Flex gap={2} w={"full"}>
                    <Button
                        size={"sm"}
                        variant={"black"}
                        flex={1}
                        onClick={issueCert}
                    >
                        Issue cert
                    </Button>
                    {/* <Button
                        size={"sm"}
                        variant={"danger"}
                        flex={1}
                        onClick={onDelModalOpen}
                    >
                        Delete
                    </Button> */}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default StudentSubmissions;
