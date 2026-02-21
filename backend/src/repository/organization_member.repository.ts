import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { organization_member, users } from '../db/schema.js';

async function create_organization_member(
  orgId: number,
  userId: number,
  role: string
) {
  return await db
    .insert(organization_member)
    .values({ org_id: orgId, user_id: userId, role });
}

async function get_organization_ids_of_member(userId: number) {
  const organizations = await db
    .select({ orgId: organization_member.org_id })
    .from(organization_member)
    .where(eq(organization_member.user_id, userId));
  const organizationIds = organizations.map((org) => org.orgId);
  return organizationIds;
}

async function get_members_of_organization(orgId: number) {
  return await db
    .select({
      id: organization_member.id,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      },
      org_id: organization_member.org_id,
      role: organization_member.role,
    })
    .from(organization_member)
    .where(eq(organization_member.org_id, orgId))
    .leftJoin(users, eq(users.id, organization_member.user_id));
}

export const organization_member_repository = {
  create_organization_member,
  get_organization_ids_of_member,
  get_members_of_organization,
};
