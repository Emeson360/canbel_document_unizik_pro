import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Avatar, Button, Flex, Box, Text } from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi2";
import CustomInput from "../../../../utils/CustomInput";
import { usePage } from "@inertiajs/react";
import { CustomUsePageProps } from "@/utils/types";
import { showError } from "@/utils/Alert";
import FormSideEffects from "@/utils/FormSideEffects";

interface TabProps {
    errors: any;
}

const Profile = ({ errors }: TabProps) => {
    // const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const { user, fsUrl } = usePage<CustomUsePageProps>().props;
    const fileElement: { current: any } | null = useRef(null);
    const [file, setFile] = useState<File | undefined>();
    const [preview, setPreview] = useState<string>("");
    const [formState, setFormState] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "",
        coverUrl: `${fsUrl}/${user?.coverUrl}`,
    });

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
                        // localStorage["lotteryPhoto"] = reader.result;
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

    const handleInputs = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    // const handleSubmit = () => {
    // const { firstname, lastname, companyName, phone, username, rate } =
    //   formState;
    // const isFieldsEmpty = checkEmptyFields({
    //   phone,
    //   last_name: !companyName ? lastname : "nr",
    //   first_name: !companyName ? firstname : "nr",
    //   company_name: companyName ? companyName : "nr",
    // });
    // if (!isFieldsEmpty) {
    // }
    // };

    return (
        <>
            <FormSideEffects
                errors={errors}
                onError={() => {}}
                onSuccess={() => {}}
            />
            <Box mb={"22px"}>
                <Text fontSize={"14px"} mb={"10px"}>
                    Photo Profile
                </Text>
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
            </Box>
            <Box width={{ md: "full", lg: "80%" }}>
                <Box mb={"22px"}>
                    <CustomInput
                        label="Full Name"
                        value={formState.name}
                        name="name"
                        onChange={handleInputs}
                        greyInput={true}
                        // readOnly={user?.role?.toLowerCase() !== "admin"}
                        readOnly
                    />
                </Box>
                <Flex
                    gap={{ base: "10px", md: "40px" }}
                    direction={["column", "row"]}
                    mb={"22px"}
                >
                    <Box width={["full", "50%"]}>
                        <CustomInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleInputs}
                            greyInput={true}
                            readOnly
                        />
                    </Box>
                    <Box width={["full", "50%"]}>
                        <CustomInput
                            label="Role"
                            name="role"
                            value={formState.role}
                            onChange={handleInputs}
                            greyInput={true}
                            readOnly
                        />
                    </Box>
                </Flex>

                {/* {user?.role?.toLowerCase() === "admin" ? (
                    <Button
                        width={"full"}
                        mt={10}
                        variant={"black"}
                        rounded={"24px"}
                        onClick={handleSubmit}
                        isLoading={isFormSubmitting}
                    >
                        Update
                    </Button>
                ) : (
                    ""
                )} */}
            </Box>
        </>
    );
};

export default Profile;
