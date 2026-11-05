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
import { PiSealCheckFill, PiUsersThreeFill } from "react-icons/pi";
import DashCard from "../../../components/dashboard/DashCard";
import { router } from "@inertiajs/react";
// import CustomBigCalendar from "../../../utils/CustomBigCalendar";

interface PageProps {
    dashStats: {
        teamCount: number;
        approvedCount: number;
    };
    userRoleStats: { role: string; total: number }[];
    errors: any;
}

const Dashboard = ({ dashStats, userRoleStats }: PageProps) => {
    const Bg = useColorModeValue("root.white", "gray.900");

    return (
        <Box px={[0, "20px"]} py={"13px"} mt={[3, 0]}>
            <Grid
                gridTemplateColumns={"repeat(auto-fit, minmax(200px, 1fr))"}
                gap={"24px"}
            >
                <GridItem>
                    <DashCard
                        stat={dashStats.teamCount}
                        title="Team members"
                        icon={PiUsersThreeFill}
                        route="/admin/users"
                    />
                </GridItem>
                <GridItem>
                    <DashCard
                        stat={dashStats.approvedCount}
                        title="Issued documents"
                        icon={PiSealCheckFill}
                        iconColor={["#FFF4F0", "#FF8F6B"]}
                        route="/admin/documents"
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
                        Team members by role
                    </Heading>
                    <Button
                        size={"sm"}
                        variant={"outline"}
                        fontWeight={400}
                        onClick={() => router.get("/admin/users")}
                    >
                        View all
                    </Button>
                </Flex>

                <TableContainer mt={"20px"}>
                    <Table variant="simple">
                        <Thead>
                            <Tr color={"#534D59"}>
                                <Th>Role</Th>
                                <Th textAlign="right" pr={1}>
                                    Count
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
                            {userRoleStats?.map((val) => (
                                <Tr key={val.role}>
                                    <Td textTransform={"capitalize"}>
                                        {val.role.replace(/[-_]/g, " ")}
                                    </Td>
                                    <Td textAlign="right">{val.total}</Td>
                                </Tr>
                            ))}
                            <Tr fontWeight={600}>
                                <Td>Total</Td>
                                <Td textAlign={"right"}>
                                    {dashStats.teamCount}
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                    {!userRoleStats?.length ? (
                        <Text
                            my={"200px"}
                            textAlign={"center"}
                            color={"root.textMuted"}
                        >
                            No team members yet
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
