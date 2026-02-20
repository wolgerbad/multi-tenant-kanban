import { user_service } from "../service/user.service.js";
async function get_user(req, res, next) {
    const userId = Number(req.params.userId);
    console.log("userid:", userId);
    const result = await user_service.get_user(userId);
    if (!result?.ok)
        res.status(500).json({ error: result.message });
    res.json(result.data);
}
async function update_user_image(req, res, next) {
    const DTO = req.body;
    try {
        await user_service.update_user_image(DTO);
        res.json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
}
async function update_user_name(req, res, next) {
    const DTO = req.body;
    try {
        await user_service.update_user_name(DTO);
        res.json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
}
export const user_controller = { get_user, update_user_image, update_user_name };
