import { auth_service } from '../service/auth.service.js';
async function signup(req, res, next) {
    const userDTO = { ...req.body };
    const result = await auth_service.signup(userDTO);
    if (result?.error)
        res.status(500).json({ error: result.error });
    res.json({ ok: true, data: result.data });
}
async function login(req, res, next) {
    const userDTO = { ...req.body };
    console.log("userDTO", userDTO);
    const result = await auth_service.login(userDTO);
    console.log("result of login from back", result);
    if (!result.ok)
        res.status(500).json({ error: result.error });
    res.json({ ok: true, data: result.data });
}
async function logout(req, res, next) {
    res.cookie('jwt', '', {
        maxAge: 1,
        sameSite: 'none'
    });
    res.send('success');
}
export const auth_controller = { signup, login, logout };
