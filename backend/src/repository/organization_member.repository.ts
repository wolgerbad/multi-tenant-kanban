import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { organization_member } from "../db/schema.js";

async function create_organization_member(orgId: number, userId: number, role: string) {
    return await db.insert(organization_member).values({org_id: orgId, user_id: userId, role})
}

async function get_organization_ids_of_member(userId: number) {
   const organizations = await db.select({ orgId: organization_member.org_id }).from(organization_member).where(eq(organization_member.user_id, userId))
   const organizationIds = organizations.map(org => org.orgId)
   return organizationIds
}

export const organization_member_repository = { create_organization_member, get_organization_ids_of_member }
 