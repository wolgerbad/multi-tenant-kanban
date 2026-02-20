import { upload_service } from "../service/upload_service.js";
async function create_presigned_url(req, res, next) {
    const DTO = req.body;
    try {
        const result = await upload_service.create_presigned_url(DTO);
        res.json({ ok: true, data: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const upload_controller = { create_presigned_url };
