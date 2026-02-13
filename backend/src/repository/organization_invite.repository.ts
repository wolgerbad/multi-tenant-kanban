import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { organization, organization_invite, OrganizationInvite, users } from "../db/schema.js";
import { alias } from "drizzle-orm/mysql-core";

async function send_organization_invite(inviteDTO: {org_id: number; sender_id: number, receiver_id: number}) {
   return await db.insert(organization_invite).values(inviteDTO)   
}

const sender = alias(users, 'sender')
const receiver = alias(users, 'receiver')

async function get_organization_invites_of_member(userId: number) {
   return await db.select({ id: organization_invite.id, sender, receiver, organization, role: organization_invite.role, status: organization_invite.status, created_at: organization_invite.created_at }).from(organization_invite).where(eq(organization_invite.receiver_id, userId)).leftJoin(sender, eq(sender.id, organization_invite.sender_id)).leftJoin(receiver, eq(receiver.id, organization_invite.receiver_id)).leftJoin(organization, eq(organization.id, organization_invite.org_id))
}

async function answer_organization_invite(status: string, invite_id: number) {
    await db.update(organization_invite).set({status}).where(eq(organization_invite.id, invite_id))
    const [org] = await db.select({org_id: organization_invite.org_id, user_id: organization_invite.receiver_id, role: organization_invite.role, status: organization_invite.status }).from(organization_invite).where(eq(organization_invite.id, invite_id))
    return org
}

export const organization_invite_repository = { send_organization_invite, get_organization_invites_of_member, answer_organization_invite }
 