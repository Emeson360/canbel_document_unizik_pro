import { SimpleGrid, Button } from "@chakra-ui/react";

interface ToggleProps {
    toggler: (user: any) => void;
    curState: any;
    tabs: { label: string; value: string | number }[];
}

export const CustomTab = ({ toggler, curState, tabs }: ToggleProps) => {
    return (
        <SimpleGrid
            bg={"#F8F8F8"}
            rounded={"6.5px"}
            p={0}
            //   gap={2}
            columns={tabs.length}
            minW={{ base: "100%", md: "266px" }}
            height={"max-content"}
        >
            {tabs?.map((tab) => (
                <Button
                    key={`tab-item-${tab.value}`}
                    bg={curState === tab.value ? "root.primary" : "transparent"}
                    color={curState === tab.value ? "#fff" : "root.black"}
                    onClick={() => toggler(tab.value)}
                    fontSize={{ base: "13px" }}
                    p={{ base: "8px 13px" }}
                    rounded={"6.5px"}
                    size={"sm"}
                    _hover={{
                        bg: curState === tab.value ? "root.primary" : "#E2E8F0",
                    }}
                >
                    {tab.label}
                </Button>
            ))}
        </SimpleGrid>
    );
};
