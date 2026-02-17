import { relations } from "drizzle-orm";
import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const organization = mysqlTable('organization', {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({length: 100}).notNull(),
    image: text(),
    created_at: timestamp({mode: 'string'}).defaultNow()
})

export const organization_relations = relations(organization, ({ many }) => ({
    organization_member: many(organization_member),
    board: many(board),
    column: many(column),
    card: many(card),
    organization_invite: many(organization_invite),
    card_comment: many(card_comment)
}))

export type Organization = typeof organization.$inferSelect;

export const users = mysqlTable('users', {
    id: int().primaryKey().notNull().autoincrement(),
    name: varchar({length:100}).notNull(),
    email: varchar({length: 150}).notNull().unique(),
    password: text().notNull(),
    image: text(),
    created_at: timestamp({mode: 'string'}).defaultNow()
})

export const users_relations = relations(users, ({ many }) => ({
    organization_member: many(organization_member),
    card: many(card),
    organization_invite: many(organization_invite),
    card_comment: many(card_comment)
}))

export type User = typeof users.$inferSelect;

export const organization_member = mysqlTable('organization_member', {
    id: int().primaryKey().notNull().autoincrement(),
    user_id: int().notNull().references(() => users.id),
    org_id: int().notNull().references(() => organization.id),
    role: varchar({length: 50}).notNull().default('member'),
    created_at: timestamp({mode: 'string'}).defaultNow()
})

export const organization_member_relations = relations(organization_member, ({ one }) => ({
   users: one(users, {
    fields: [organization_member.user_id],
    references: [users.id]
   }),
   organization: one(organization, {
    fields: [organization_member.org_id],
    references: [organization.id]
   })
}))

export type OrganizationMember = typeof organization_member.$inferSelect;

export const board = mysqlTable('board', {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({length:100}).notNull(), // unq across board
    org_id: int().notNull().references(() => organization.id),
    created_at: timestamp({mode: 'string'}).defaultNow()
})

export const board_relations = relations(board, ({one, many}) => ({
    organization: one(organization, {
        fields: [board.org_id],
        references: [organization.id]
    }),
    column: many(column)
}))

export type Board = typeof board.$inferSelect;

export const column = mysqlTable('column', {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({length: 100}).notNull(),
    position: int().notNull(),
    org_id: int().notNull().references(() => organization.id),
    board_id: int().notNull().references(() => board.id),
    created_at: timestamp({mode: 'string'}).defaultNow()
})

export const column_relations = relations(column, ({one, many}) => ({
   organization: one(organization, {
    fields: [column.org_id],
    references: [organization.id]
   }),
   board: one(board, {
    fields: [column.board_id],
    references: [board.id]
   }),
   cards: many(card)
}))

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
    org_id: int().notNull().references(() => organization.id),
    created_at: timestamp({mode: 'string'}).defaultNow()
})

export const card_relations = relations(card, ({ one, many }) => ({
    users: one(users, {
        fields: [card.created_by],
        references: [users.id]
    }),
    column: one(column, {
        fields: [card.column_id],
        references: [column.id]
    }),
    organization: one(organization, {
        fields: [card.org_id],
        references: [organization.id]
    }),
    card_comment: many(card_comment)
}))

export type Card = typeof card.$inferSelect;

export const card_comment = mysqlTable('card_comment', {
    id: int().primaryKey().notNull().autoincrement(),
    comment: text().notNull(),
    sender_id: int().notNull().references(() => users.id),
    card_id: int().notNull().references(() => card.id, { onDelete: 'cascade' }),
    org_id: int().notNull().references(() => organization.id, { onDelete: 'cascade' }),
    created_at: timestamp({mode: 'string'}).defaultNow()
})

export type CardComment = typeof card_comment.$inferSelect;

export const card_comment_relations = relations(card_comment, ({ one }) => ({
    sender_id: one(users, {
        fields: [card_comment.sender_id],
        references: [users.id]
    }),
    card_id: one(card, {
      fields: [card_comment.card_id],
      references: [card.id]  
    }),
    org_id: one(organization, {
        fields: [card_comment.org_id],
        references: [organization.id]
    })
}))

export const organization_invite = mysqlTable('organization_invite', {
    id: int().primaryKey().notNull().autoincrement(),
    sender_id: int().notNull().references(() => users.id),
    org_id: int().notNull().references(() => organization.id),
    receiver_id: int().notNull().references(() => users.id),
    created_at: timestamp({mode: 'string'}).defaultNow(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    role: varchar('role', { length: 20 }).notNull()
})

export type OrganizationInvite = typeof organization_invite.$inferSelect

export const organization_invite_relations = relations(organization_invite, ({one}) => ({
    sender: one(users, {
        fields: [organization_invite.sender_id],
        references: [users.id],
    }),
    org_id: one(organization, ({
        fields: [organization_invite.org_id],
        references: [organization.id]
    })),
    receiver: one(users, {
        fields: [organization_invite.receiver_id],
        references: [users.id],
    }),
}))