import { auth_service } from "../service/auth.service.js";
async function signup(req, res, next) {
    const userDTO = { ...req.body };
    const result = await auth_service.signup(userDTO);
    if (result?.error)
        res.status(500).json({ error: result.error });
    res.cookie('jwt', result.data, {
        httpOnly: true,
        secure: true,
    }).json({ ok: true });
}
async function login(req, res, next) {
    const userDTO = { ...req.body };
    const result = await auth_service.login(userDTO);
    if (!result.ok)
        res.status(500).json({ error: result.error });
    res.cookie("jwt", result.data, {
        httpOnly: true,
        secure: true
    }).json({ ok: true });
}
async function logout(req, res, next) {
    res.cookie('jwt', '', {
        maxAge: 1
    });
    res.send('success');
}
export const auth_controller = { signup, login, logout };
