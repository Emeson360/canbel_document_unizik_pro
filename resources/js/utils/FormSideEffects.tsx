import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { CustomUsePageProps } from "./types";
import { showError } from "./Alert";

interface UtilProp {
    onSuccess?: () => void;
    onError?: () => void;
    errors: any;
    showErrorMsg?: boolean;
}

const FormSideEffects = ({
    onSuccess,
    onError,
    showErrorMsg = true,
    errors,
}: UtilProp) => {
    const { flash } = usePage<CustomUsePageProps>().props;

    // form submission side effects
    useEffect(() => {
        if (flash?.success) {
            onSuccess?.();
        }
    }, [flash?.success]);

    useEffect(() => {
        if (errors) {
            const errorValues: string[] = Object.values(errors);
            if (showErrorMsg) {
                errorValues.forEach((errorMessage) => {
                    onError?.();
                    showError(errorMessage);
                });
            } else {
                if (errorValues.length) onError?.();
            }
        }
    }, [errors]);

    return <></>;
};

export default FormSideEffects;
