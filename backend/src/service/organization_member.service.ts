import { organization_member_repository } from "../repository/organization_member.repository.js"

async function get_members_of_organization(orgId: number) {
   const result = await organization_member_repository.get_members_of_organization(orgId)
   if(!result.length) return {ok: false, message: 'No member found in this organization.'}
   return {ok: true, data: result}
}

export const organization_member_service = { get_members_of_organization }