import { PageProps } from "@inertiajs/core";

export interface CustomUsePageProps extends PageProps {
    fsUrl: string;
    user: User | null;
    flash: {
        success?: string | null;
        error?: string | null;
        message?: string | null;
    };
}

type UserRoles = "admin" | "supervisor" | "registrar" | "assistant-supervisor";

export enum UserRoleEnum {
    ADMIN = "admin",
    SUPERVISOR = "supervisor",
    REGISTRAR = "registrar",
    ASSISTANT_SUPERVISOR = "assistant-supervisor",
}

export interface User {
    id: number;
    name: string;
    email: string;
    coverUrl: string | null;
    role: UserRoles;
}

export interface InterfacePaginated {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    path: string;
    total: number;
}

export interface UserInterface {
    id: number;
    name: string;
    email: string;
    coverUrl: string | null;
    role: UserRoles;
}

export interface UserInterfacePaginated extends InterfacePaginated {
    data: UserInterface[];
}

export interface DocumentPaperInterface {
    id: number;
    type?: "undergraduate" | "postgraduate";
    holders_name?: string | null;
    registration_number?: string | null;
    nin?: string | null;
    dob?: string | null;
    faculty_id?: number | null;
    faculty?: FacultyInterface | null;
    passport_photo?: string | null;
    passport_photo_url?: string | null;
    department_id?: number | null;
    discipline?: string | null;
    department: DepartmentInterface | null;
    issuer: UserInterface | null;
    approver: UserInterface | null;
    session?: string | null;
    cgpa?: string | null;
    cgpa_class?: string | null;
    effective_date?: string | null;
    logged_by?: string;
    registered_date?: string | null;
    registered_by?: string | null;
    approved_date?: string | null;
    approved_by?: string | null;
    status?: 0 | 1 | 2;
    refusal_comment?: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

export interface DocumentPaperInterfacePaginated extends InterfacePaginated {
    data: DocumentPaperInterface[];
}

export interface FacultyInterface {
    id: number;
    name: string;
    key: string;
}

export interface DepartmentInterface {
    id: number;
    name: string;
    key: string;
    faculty_id: number | null;
    faculty?: FacultyInterface | null;
}

export interface StudentSubmissionInterface {
    id: number;
    full_name: string;
    email: string;
    document_type: "undergraduate" | "postgraduate";
    registration_number: string;
    nin: string;
    dob: string;
    faculty_id: number | null;
    faculty: FacultyInterface | null;
    department_id: number;
    department: DepartmentInterface | null;
    passport_photo: string;
    passport_photo_url: string | null;
    status: 0 | 1;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface StudentSubmissionInterfacePaginated extends InterfacePaginated {
    data: StudentSubmissionInterface[];
}

// The set of document fields that have a printable X/Y position — must stay
// in sync with DocumentLayoutController::FIELDS and the *_x/*_y columns on
// DocumentParamsPositionSettingInterface below.
export type DocumentPositionFieldKey =
    | "holders_name"
    | "registration_number"
    | "department_name"
    | "discipline"
    | "cgpa"
    | "cgpa_class"
    | "effective_date"
    | "nin"
    | "dob"
    | "faculty"
    | "passport_photo";

export interface LayoutSettingProfileInterface {
    id: number;
    name: string;
    is_default: boolean;
    show_document_template: boolean;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface DocumentParamsPositionSettingInterface {
    id: number;
    document_type: string;
    layout_setting_profile_id: number | null;
    holders_name_x: number;
    holders_name_y: number;
    registration_number_x: number;
    registration_number_y: number;
    department_name_x: number;
    department_name_y: number;
    discipline_x: number;
    discipline_y: number;
    session_x: number;
    session_y: number;
    cgpa_x: number;
    cgpa_y: number;
    cgpa_class_x: number;
    cgpa_class_y: number;
    effective_date_x: number;
    effective_date_y: number;
    nin_x: number;
    nin_y: number;
    dob_x: number;
    dob_y: number;
    faculty_x: number;
    faculty_y: number;
    passport_photo_x: number;
    passport_photo_y: number;
}
