export type Organization = {
    id: number;
    title: string;
    image?: string;
}

export type OrganizationMember = {
    id: number;
    user_id: number;
    org_id: number;
    role: string;
}

export type Board = {
    id: number;
    title: string;
    org_id: number
}