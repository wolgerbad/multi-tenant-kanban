import { eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { organization } from "../db/schema.js";

async function create_organization(values: { organization_title: string; organization_image?: string | null }) {
   return await db.insert(organization).values({title: values.organization_title, image: values?.organization_image
   }).$returningId()
}

async function get_organizations_of_member(orgId: number[]) {
   return await db.select().from(organization).where(inArray(organization.id, orgId))
}


export const organization_repository = { create_organization, get_organizations_of_member }