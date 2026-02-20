import { organization_service } from "../service/organization.service.js";
async function get_organizations_of_member(req, res, next) {
    const userId = Number(req.params.userId);
    try {
        const result = await organization_service.get_organizations_of_member(userId);
        if (!result.ok)
            throw new Error(result.message);
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function create_organization(req, res, next) {
    const DTO = req.body;
    try {
        const result = await organization_service.create_organization(DTO);
        if (!result.ok)
            throw new Error(result.message);
        res.json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const organization_controller = { get_organizations_of_member, create_organization };
