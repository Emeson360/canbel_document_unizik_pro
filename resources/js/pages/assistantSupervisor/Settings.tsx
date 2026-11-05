import { useEffect, useState } from "react";
import {
    Flex,
    Heading,
    Box,
    Button,
    Text,
    IconButton,
    useColorModeValue,
} from "@chakra-ui/react";
import { CustomTab } from "@/utils/CustomTab";
import Profile from "../dashboard/admin/settings/Profile";
import Password from "../dashboard/admin/settings/Password";
import FormSideEffects from "@/utils/FormSideEffects";
import { showError, showSuccess } from "@/utils/Alert";
import { router, usePage } from "@inertiajs/react";
import { CustomUsePageProps } from "@/utils/types";
import { LuArrowLeft } from "react-icons/lu";

interface PageProps {
    errors: any;
}

enum TabType {
    PROFILE,
    PASSWORD,
}

const settingTabsArray = [
    { label: "Profile", value: TabType.PROFILE },
    { label: "Password", value: TabType.PASSWORD },
];

const Settings = ({ errors }: PageProps) => {
    const { user, flash } = usePage<CustomUsePageProps>().props;
    const [settingsTab, setSettingsTab] = useState(TabType.PROFILE);
    const Bg = useColorModeValue("#F7F7F8", "gray.900");
    const CardBg = useColorModeValue("#fff", "gray.800");

    // this page renders standalone (no dashboard Layout), so it doesn't get
    // Layout's flash-toast side effect and has to show it itself
    useEffect(() => {
        if (flash?.success) showSuccess(flash.success, 10000);
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) showError(flash.error);
    }, [flash?.error]);

    const logOut = () => {
        router.post("/logout");
    };

    return (
        <Box minH={"100vh"} bg={Bg} py={"20px"} px={[3, "40px"]}>
            <FormSideEffects errors={errors} />
            <Flex justify={"space-between"} align={"center"} mb={"20px"}>
                <Flex align={"center"} gap={2}>
                    <IconButton
                        aria-label="Back"
                        icon={<LuArrowLeft />}
                        size={"sm"}
                        variant={"outline"}
                        borderRadius={"24px"}
                        as={"a"}
                        href={`/${user?.role}/dashboard`}
                    />
                    <Heading as={"h2"} fontSize={"22px"} fontWeight={700}>
                        Settings
                    </Heading>
                </Flex>
                <Flex align={"center"} gap={3}>
                    <Text fontSize={"14px"} textTransform={"capitalize"}>
                        {user?.name}
                    </Text>
                    <Button size={"sm"} variant={"outline"} onClick={logOut}>
                        Log out
                    </Button>
                </Flex>
            </Flex>

            <Box
                rounded={"12px"}
                minH={"300px"}
                bg={CardBg}
                px={"20px"}
                py={"45px"}
            >
                <Flex
                    justify={"space-between"}
                    align={"center"}
                    mb={"32px"}
                    gap={5}
                    direction={{ base: "column", md: "row" }}
                >
                    <Heading
                        as={"h3"}
                        fontSize={"24px"}
                        fontWeight={700}
                        letterSpacing={"-2%"}
                    >
                        {settingTabsArray[settingsTab]?.label}
                    </Heading>
                    <CustomTab
                        curState={settingsTab}
                        toggler={setSettingsTab}
                        tabs={settingTabsArray}
                    />
                </Flex>

                {settingsTab === TabType.PROFILE && <Profile errors={errors} />}
                {settingsTab === TabType.PASSWORD && (
                    <Password errors={errors} />
                )}
            </Box>
        </Box>
    );
};;

export default Settings;
