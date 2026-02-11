import { organization_repository } from "../repository/organization.repository.js";
import { organization_member_repository } from "../repository/organization_member.repository.js";

async function get_organizations_of_member(userId: number) {
   const orgIds = await organization_member_repository.get_organization_ids_of_member(userId)
   const orgs = await organization_repository.get_organizations_of_member(orgIds)
   if(!orgs.length) return {ok: false, message: 'No org found for the user'}
   return {ok: true, data: orgs};
}

export const organization_service = { get_organizations_of_member }