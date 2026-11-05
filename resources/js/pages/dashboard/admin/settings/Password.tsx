import { ChangeEvent, useState } from "react";
import { Button, Box } from "@chakra-ui/react";
import CustomInput from "../../../../utils/CustomInput";
import { showError } from "../../../../utils/Alert";
import { checkEmptyFields } from "../../../../utils/helpers";
import { router, usePage } from "@inertiajs/react";
import FormSideEffects from "@/utils/FormSideEffects";
import { CustomUsePageProps } from "@/utils/types";

interface TabProps {
    errors: any;
}

const Password = ({ errors }: TabProps) => {
    const { user } = usePage<CustomUsePageProps>().props;
    const userRole = user?.role;
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [formState, setFormState] = useState({
        old_password: "",
        new_password: "",
        confirm_Password: "",
    });

    const handleInputs = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = () => {
        const { new_password, confirm_Password, old_password } = formState;
        const isFormEmpty = checkEmptyFields({
            current_password: old_password,
            new_password,
            confirm_Password,
        });

        if (!isFormEmpty) {
            // pwd validation
            if (new_password.length < 6) {
                showError("New password should be at least 6 characters");
                return;
            }

            if (new_password !== confirm_Password) {
                showError("Passwords do not match");
                return;
            }

            setIsFormSubmitting(true);
            router.post(`/${userRole}/settings/change-password`, {
                ...formState,
            });
        }
    };

    return (
        <>
            <FormSideEffects
                errors={errors}
                showErrorMsg={false}
                onError={() => setIsFormSubmitting(false)}
                onSuccess={() => {
                    setIsFormSubmitting(false);
                    setFormState({
                        old_password: "",
                        new_password: "",
                        confirm_Password: "",
                    });
                }}
            />
            <Box width={{ md: "full", lg: "60%" }} mt={15}>
                <Box mb={"22px"}>
                    <CustomInput
                        label="Current Password"
                        value={formState.old_password}
                        name="old_password"
                        type="password"
                        onChange={handleInputs}
                        greyInput={true}
                    />
                </Box>

                <Box mb={"22px"}>
                    <CustomInput
                        label="New Password"
                        value={formState.new_password}
                        name="new_password"
                        type="password"
                        onChange={handleInputs}
                        greyInput={true}
                    />
                </Box>

                <Box>
                    <CustomInput
                        label="Re-enter new Password"
                        name="confirm_Password"
                        type="password"
                        value={formState.confirm_Password}
                        onChange={handleInputs}
                        greyInput={true}
                    />
                </Box>

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
            </Box>
        </>
    );
};

export default Password;
