export interface User {
  id: number
  name: string
  email: string
  image: string | null
}

export interface Organization {
  id: number
  title: string
  image?: string
}

export interface OrganizationMember {
  id: number
  user_id: number
  org_id: number
  role: string
}

export interface OrgMemberForDropdown {
  id: number
  org_id: number
  role: number
  user: User
}

export interface Board {
  id: number
  title: string
  org_id: number
}

export interface Column {
  id: number
  title: string
  position: number
  org_id: number
  board_id: number
}

export type ColumnWithCards = Column & {
  cards: Card[]
}

export interface Card {
  id?: number
  title: string
  description?: string
  position: number
  created_by: number
  org_id: number
  column_id: number
}
