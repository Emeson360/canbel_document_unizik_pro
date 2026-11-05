import { useState } from "react";
import { Flex, Heading, Box } from "@chakra-ui/react";
import { CustomTab } from "../../../utils/CustomTab";
import Password from "../admin/settings/Password";
// import Preferences from "./settings/Preferences";
import { useColorModeValue } from "@chakra-ui/react";
import Profile from "../admin/settings/Profile";
import FormSideEffects from "@/utils/FormSideEffects";

interface PageProps {
    errors: any;
}

enum TabType {
    PROFILE,
    PASSWORD,
    PREFERENCES,
}

const settingTabsArray = [
    { label: "Profile", value: TabType.PROFILE },
    { label: "Password", value: TabType.PASSWORD },
    // { label: "Preferences", value: TabType.PREFERENCES },
];

const Settings = ({ errors }: PageProps) => {
    const [settingsTab, setSettingsTab] = useState(TabType.PROFILE);
    const Bg = useColorModeValue("#fff", "gray.800");

    return (
        <>
            <FormSideEffects errors={errors} />
            <Box
                mt={[3, 0]}
                rounded={"12px"}
                minH={"300px"}
                bg={Bg}
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
                {/* {settingsTab === TabType.PREFERENCES && <Preferences />} */}
            </Box>
        </>
    );
};

export default Settings;
