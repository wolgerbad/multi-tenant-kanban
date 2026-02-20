import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { organization, organization_invite, users } from "../db/schema.js";
import { alias } from "drizzle-orm/mysql-core";
async function send_organization_invite(inviteDTO) {
    return await db.insert(organization_invite).values(inviteDTO).$returningId();
}
const sender = alias(users, 'sender');
const receiver = alias(users, 'receiver');
async function get_organization_invites_of_member(userId) {
    return await db.select({ id: organization_invite.id, sender, receiver, organization, role: organization_invite.role, status: organization_invite.status, created_at: organization_invite.created_at }).from(organization_invite).where(eq(organization_invite.receiver_id, userId)).leftJoin(sender, eq(sender.id, organization_invite.sender_id)).leftJoin(receiver, eq(receiver.id, organization_invite.receiver_id)).leftJoin(organization, eq(organization.id, organization_invite.org_id)).orderBy(desc(organization_invite.created_at));
}
async function get_receiver_id_by_invite_id(invite_id) {
    return await db.select({ receiver_id: organization_invite.receiver_id }).from(organization_invite).where(eq(organization_invite.id, invite_id));
}
async function answer_organization_invite(status, invite_id) {
    await db.update(organization_invite).set({ status }).where(eq(organization_invite.id, invite_id));
    const [org] = await db.select({ org_id: organization_invite.org_id, user_id: organization_invite.receiver_id, role: organization_invite.role, status: organization_invite.status }).from(organization_invite).where(eq(organization_invite.id, invite_id));
    return org;
}
async function get_organization_invite(user_id, org_id) {
    return await db.select().from(organization_invite).where(and(eq(organization_invite.org_id, org_id), eq(organization_invite.receiver_id, user_id)));
}
export const organization_invite_repository = { send_organization_invite, get_organization_invites_of_member, get_receiver_id_by_invite_id, answer_organization_invite, get_organization_invite };
