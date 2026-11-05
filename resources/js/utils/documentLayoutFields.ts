import { formatTableDate } from "@/utils/helpers";
import { DocumentPositionFieldKey } from "@/utils/types";

export type DocumentLayoutFieldConfig = {
    key: DocumentPositionFieldKey;
    label: string;
};

export const FIELDS: DocumentLayoutFieldConfig[] = [
    { key: "passport_photo", label: "Passport Photo" },
    { key: "holders_name", label: "Holder's Name" },
    { key: "registration_number", label: "Registration Number" },
    { key: "department_name", label: "Department Name" },
    { key: "discipline", label: "Discipline" },
    { key: "cgpa", label: "CGPA" },
    { key: "cgpa_class", label: "CGPA Class" },
    { key: "effective_date", label: "Given Date" },
    { key: "nin", label: "NIN" },
    { key: "dob", label: "Date of Birth" },
    { key: "faculty", label: "Faculty" },
];

// These fields don't apply to postgraduate documents (no discipline/CGPA classification).
export const FIELDS_HIDDEN_FOR_POSTGRADUATE: DocumentPositionFieldKey[] = [
    "discipline",
    "cgpa",
    "cgpa_class",
    "faculty",
    "registration_number",
];

// These fields don't apply to undergraduate documents.
export const FIELDS_HIDDEN_FOR_UNDERGRADUATE: DocumentPositionFieldKey[] = [
    "cgpa",
    "faculty",
    "registration_number",
];

export const SAMPLE_VALUES: Record<DocumentPositionFieldKey, string> = {
    holders_name: "John Doe",
    registration_number: "REG-2024-001",
    department_name: "Computer Science",
    discipline: "Science",
    cgpa: "3.2",
    cgpa_class: "Second Class Upper Division",
    effective_date: formatTableDate(new Date().toISOString()),
    nin: "12345678901",
    dob: formatTableDate("2001-05-14"),
    faculty: "Faculty of Engineering",
    passport_photo: "",
};

export const getVisibleFields = (activeType: string) =>
    FIELDS.filter(
        (field) =>
            !(
                (activeType === "postgraduate" &&
                    FIELDS_HIDDEN_FOR_POSTGRADUATE.includes(field.key)) ||
                (activeType === "undergraduate" &&
                    FIELDS_HIDDEN_FOR_UNDERGRADUATE.includes(field.key))
            ),
    );

export const emptyFormState = (fields: DocumentLayoutFieldConfig[]) =>
    fields.reduce(
        (acc, field) => {
            acc[`${field.key}_x`] = 0;
            acc[`${field.key}_y`] = 0;
            return acc;
        },
        {} as Record<string, number>,
    );
