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
   return await db.select({ id: organization_invite.id, sender, receiver, organization }).from(organization_invite).where(eq(organization_invite.receiver_id, userId)).leftJoin(sender, eq(sender.id, organization_invite.sender_id)).leftJoin(receiver, eq(receiver.id, organization_invite.receiver_id)).leftJoin(organization, eq(organization.id, organization_invite.org_id))
}

export const organization_invite_repository = { send_organization_invite, get_organization_invites_of_member }