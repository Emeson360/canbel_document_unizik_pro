import { showError } from "./Alert";

export const capitalizeFirstText = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeText = (str: string) => {
    if (str === undefined) {
        return "";
    }

    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export function currentYear() {
    const date = new Date();
    const currentYear = date.getFullYear();
    return currentYear;
}

export function formatTableDate(dateString: string) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Get ordinal suffix
    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${day}${getOrdinal(day)}, ${month} ${year}`;
}

export function replaceUnderscoreWithSpace(string: string) {
    return string.replace(/_/g, " ");
}

export const checkEmptyFields = (fields: any) => {
    let err = false;
    Object.keys(fields).forEach((key) => {
        if (
            fields[key] === "" ||
            fields[key] === undefined ||
            fields[key] === null
        ) {
            showError(
                capitalizeFirstText(`${key?.replace(/_/g, " ")} is required`)
            );
            err = true;
        }
    });

    return err;
};

export const isCgpaValid = (cgpa: string | number) => {
    const value = Number(cgpa);
    return cgpa !== "" && !Number.isNaN(value) && value >= 1 && value <= 4;
};

export const classifyCgpa = (cgpa: string | number) => {
    const value = Number(cgpa);
    if (value >= 3.6) return "First Class";
    if (value >= 3.0) return "Second Class Upper Division";
    if (value >= 2.5) return "Second Class Lower Division";
    if (value >= 2.0) return "Third Class Division";
    if (value >= 1.0) return "Pass";
    return "Fail";
};

export const returnDocStatusIndex = (
    status: "awaitingApproval" | "approved" | "refused"
) => {
    const stObj = { awaitingApproval: 0, approved: 1, refused: 2 };
    return stObj[status];
};

// Convert ISO string to MySQL datetime format for submission to BE
export function formatDateForMySQL(isoString: string | null) {
    if (!isoString) {
        return "";
    }

    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace("T", " ");
}

export function myAppendQueryParam(newParams: any) {
    const currentParams = new URLSearchParams(window.location.search);

    for (const key in newParams) {
        currentParams.set(key, newParams[key]);
    }

    return currentParams.toString();
}

export function myRemoveQueryParam(keyToRemove: string) {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete(keyToRemove);

    return currentParams.toString();
}
