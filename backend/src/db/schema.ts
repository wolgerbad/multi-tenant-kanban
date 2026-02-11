import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const organization = mysqlTable('organization', {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({length: 100}).notNull(),
    image: text(),
})

export type Organization = typeof organization.$inferSelect;

export const users = mysqlTable('users', {
    id: int().primaryKey().notNull().autoincrement(),
    name: varchar({length:100}).notNull(),
    email: varchar({length: 150}).notNull().unique(),
    password: text().notNull(),
    image: text(),
})

export type User = typeof users.$inferSelect;

export const organization_member = mysqlTable('organization_member', {
    id: int().primaryKey().notNull().autoincrement(),
    user_id: int().notNull().references(() => users.id),
    org_id: int().notNull().references(() => organization.id),
    role: varchar({length: 50}).notNull().default('member')
})

export type OrganizationMember = typeof organization_member.$inferSelect;

export const board = mysqlTable('board', {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({length:100}).notNull(), // unq across board
    org_id: int().notNull().references(() => organization.id)
})

export type Board = typeof board.$inferSelect;

export const column = mysqlTable('column', {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({length: 100}).notNull(),
    position: int().notNull(),
    org_id: int().notNull().references(() => organization.id),
    board_id: int().notNull().references(() => board.id)
})

export type Column = typeof column.$inferSelect;

export const card = mysqlTable('card' , {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({length: 100}).notNull(),
    description: varchar({length: 100}),
    position: int().notNull(),
    created_by: int().notNull().references(() => users.id),
    due_date: timestamp({mode: 'string'}),
    priority: varchar({length: 50}).notNull(),
    column_id: int().notNull().references(() => column.id),
    org_id: int().notNull().references(() => organization.id)
})

export type Card = typeof card.$inferSelect;