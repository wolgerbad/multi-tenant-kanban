import { user_repository } from "../repository/user.repository.js";

async function get_user(userId: number) {
    const [user] = await user_repository.get_user_by_id(userId);
    if(!user) return {ok: false, message: 'No user found with the given id'}
    return {ok: true, data: user};
}

export const user_service = { get_user }