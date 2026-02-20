import { organization_repository } from "../repository/organization.repository.js";
import { organization_member_repository } from "../repository/organization_member.repository.js";
async function get_organizations_of_member(userId) {
    const orgIds = await organization_member_repository.get_organization_ids_of_member(userId);
    const orgs = await organization_repository.get_organizations_of_member(orgIds);
    if (!orgs.length)
        return { ok: false, message: 'No org found for the user' };
    return { ok: true, data: orgs };
}
async function create_organization(DTO) {
    const [organization] = await organization_repository.create_organization({ organization_title: DTO.organization_title, organization_image: DTO.organization_image });
    if (!organization)
        return { ok: false, message: 'Failed to create organization' };
    await organization_member_repository.create_organization_member(organization.id, DTO.user_id, 'owner');
    return { ok: true };
}
export const organization_service = { get_organizations_of_member, create_organization };
