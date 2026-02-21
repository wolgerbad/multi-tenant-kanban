import { user_repository } from '../repository/user.repository.js';

async function get_user(userId: number) {
  const [user] = await user_repository.get_user_by_id(userId);
  if (!user) return { ok: false, message: 'No user found with the given id' };
  return { ok: true, data: user };
}

async function update_user_image(DTO: { user_id: number; image: string }) {
  return await user_repository.update_user_image(DTO);
}

async function update_user_name(DTO: { user_id: number; name: string }) {
  return await user_repository.update_user_name(DTO);
}

export const user_service = { get_user, update_user_image, update_user_name };
