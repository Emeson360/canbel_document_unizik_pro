import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import { PiSealCheckFill } from "react-icons/pi";
import DashCard from "../../../components/dashboard/DashCard";
import { router, usePage } from "@inertiajs/react";
import { CustomUsePageProps, DocumentPaperInterface } from "@/utils/types";
import { FaTimesCircle } from "react-icons/fa";
import { replaceUnderscoreWithSpace } from "@/utils/helpers";
import LabelStatus from "@/utils/LabelStatus";

interface PageProps {
    dashStats: {
        pendingApprovals: number;
        refusalCount: number;
    };
    recentDocuments: DocumentPaperInterface[];
    documentStatuses: string[];
}

const Dashboard = ({
    dashStats,
    recentDocuments,
    documentStatuses,
}: PageProps) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const Bg = useColorModeValue("root.white", "gray.900");

    return (
        <Box px={[0, "20px"]} py={"13px"} mt={[3, 0]}>
            <Grid
                gridTemplateColumns={"repeat(auto-fit, minmax(200px, 1fr))"}
                gap={"24px"}
            >
                <GridItem>
                    <DashCard
                        stat={dashStats.pendingApprovals.toString()}
                        title="Pending approvals"
                        icon={PiSealCheckFill}
                        route={`/${user?.role}/documents`}
                    />
                </GridItem>
                <GridItem>
                    <DashCard
                        stat={dashStats.refusalCount.toString()}
                        title="Refused documents"
                        iconColor={["#FFF4F0", "#FF8F6B"]}
                        icon={FaTimesCircle}
                        route={`/${user?.role}/documents`}
                    />
                </GridItem>
            </Grid>

            <Box
                mt={"24px"}
                rounded={"12px"}
                minH={"300px"}
                bg={Bg}
                px={"20px"}
                py={"13px"}
            >
                <Flex justify={"space-between"} align={"center"}>
                    <Heading
                        as={"h3"}
                        fontSize={"20px"}
                        fontWeight={700}
                        letterSpacing={"-2%"}
                    >
                        Recent documents
                    </Heading>
                    <Button
                        size={"sm"}
                        variant={"outline"}
                        fontWeight={400}
                        onClick={() => router.get("/registrar/documents")}
                    >
                        View all
                    </Button>
                </Flex>

                <TableContainer mt={"20px"}>
                    <Table variant="simple">
                        <Thead>
                            <Tr color={"#534D59"}>
                                <Th>Holder's Name</Th>
                                <Th>Type</Th>
                                <Th>Registration number</Th>
                                <Th>Issued by</Th>
                                <Th>status</Th>
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
                            {recentDocuments?.map((val) => (
                                <Tr
                                    key={val.id}
                                    _hover={{
                                        bg: "#FAFAFB",
                                        cursor: "pointer",
                                    }}
                                    fontSize={"12px"}
                                    onClick={() =>
                                        router.get(
                                            `/registrar/documents/preview/${val.id}`,
                                        )
                                    }
                                >
                                    <Td textTransform={"capitalize"}>
                                        {val.holders_name}
                                    </Td>
                                    <Td textTransform={"uppercase"}>
                                        {replaceUnderscoreWithSpace(
                                            val?.type || "",
                                        )}
                                    </Td>
                                    <Td textTransform={"uppercase"}>
                                        {val.registration_number}
                                    </Td>
                                    <Td textTransform={"capitalize"}>
                                        {val.issuer?.name}
                                    </Td>
                                    <Td>
                                        <LabelStatus
                                            status={
                                                val.status !== undefined &&
                                                val.status !== null
                                                    ? replaceUnderscoreWithSpace(
                                                          documentStatuses[
                                                              val.status
                                                          ],
                                                      )
                                                    : "--"
                                            }
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                    {!recentDocuments?.length ? (
                        <Text
                            my={"100px"}
                            textAlign={"center"}
                            color={"root.textMuted"}
                        >
                            No documents issued yet
                        </Text>
                    ) : (
                        ""
                    )}
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Dashboard;
