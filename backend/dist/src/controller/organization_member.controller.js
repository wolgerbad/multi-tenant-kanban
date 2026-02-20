import { organization_member_service } from "../service/organization_member.service.js";
async function get_members_of_organization(req, res, next) {
    const orgId = Number(req.params.orgId);
    try {
        const result = await organization_member_service.get_members_of_organization(orgId);
        if (!result.ok)
            throw new Error(result.message);
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const organization_member_controller = { get_members_of_organization };
