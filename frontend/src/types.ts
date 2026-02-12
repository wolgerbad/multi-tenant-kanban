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

export type Column = {
    id: number;
    title: string;
    position: number;
    org_id: number;
    board_id: number;
}

export type ColumnWithCards = Column & {
cards: Card[]
}


export type Card = {
    id?: number;
    title: string;
    description?: string;
    position: number;
    created_by: number;
    org_id: number;
    column_id: number
}