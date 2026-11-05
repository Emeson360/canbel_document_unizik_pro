import {
    DocumentPaperInterface,
    DocumentParamsPositionSettingInterface,
    DocumentPositionFieldKey,
} from "@/utils/types";
import { formatTableDate } from "@/utils/helpers";
import {
    FIELDS_HIDDEN_FOR_POSTGRADUATE,
    FIELDS_HIDDEN_FOR_UNDERGRADUATE,
} from "@/utils/documentLayoutFields";

export const PREVIEW_FIELDS: {
    key: DocumentPositionFieldKey;
    getValue: (
        document: DocumentPaperInterface,
    ) => string | number | null | undefined;
}[] = [
    { key: "holders_name", getValue: (document) => document.holders_name },
    {
        key: "registration_number",
        getValue: (document) => document.registration_number,
    },
    {
        key: "department_name",
        getValue: (document) => document.department?.name,
    },
    { key: "discipline", getValue: (document) => document.discipline },
    { key: "cgpa", getValue: (document) => document.cgpa },
    { key: "cgpa_class", getValue: (document) => document.cgpa_class },
    {
        key: "effective_date",
        getValue: (document) =>
            document.effective_date
                ? formatTableDate(document.effective_date)
                : null,
    },
    { key: "nin", getValue: (document) => document.nin },
    {
        key: "dob",
        getValue: (document) =>
            document.dob ? formatTableDate(document.dob) : null,
    },
    { key: "faculty", getValue: (document) => document.faculty?.name },
    {
        key: "passport_photo",
        getValue: (document) => document.passport_photo_url,
    },
];

export const getPreviewCanvasFields = (
    document: DocumentPaperInterface | null,
    positionSettings: DocumentParamsPositionSettingInterface | null,
) => {
    if (!document || !positionSettings) return [];

    return PREVIEW_FIELDS.filter(
        (field) =>
            !(
                (document.type === "postgraduate" &&
                    FIELDS_HIDDEN_FOR_POSTGRADUATE.includes(field.key)) ||
                (document.type === "undergraduate" &&
                    FIELDS_HIDDEN_FOR_UNDERGRADUATE.includes(field.key))
            ),
    ).map((field) => ({
        key: field.key,
        x: (positionSettings as any)[`${field.key}_x`],
        y: (positionSettings as any)[`${field.key}_y`],
        value: field.getValue(document) ?? "--",
    }));
};
